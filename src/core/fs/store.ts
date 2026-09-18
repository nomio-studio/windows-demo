import { create } from 'zustand'
import * as opfs from './opfs'
import { readBinIndex, writeBinIndex } from './bin'
import { copyName, fsPathOf, INVALID_NAME, uniqueName } from './naming'
import { scanTree, type FsStats } from './scan'
import { SEED_DIRS, SEED_FILES } from './seed'
import { BIN_FS, dirNode, driveNode, type FsNode } from './tree'

/**
 * Reactive mirror of the OPFS filesystem. The tree is scanned once at
 * session start (seeding on first run), then every mutation writes
 * through to OPFS and rescans — components stay synchronous and the UI
 * updates reactively.
 *
 * Siblings: opfs.ts wraps the raw API, scan.ts builds the tree,
 * naming.ts handles path/collision rules, bin.ts persists the Recycle
 * Bin index, seed.ts holds first-run content.
 */

export interface Clipboard {
  fsPaths: string[][]
  cut: boolean
}

export type { FsStats }

const PINS_PATH = ['Users', 'User', 'AppData', 'quick-access.json']

interface FsStore {
  /** Tree scanned and ready for use. */
  ready: boolean
  /** OPFS unavailable — read-only demo fallback. */
  supported: boolean
  roots: Record<string, FsNode>
  /** fsPaths the user pinned to Quick access. */
  pins: string[][]
  clipboard: Clipboard | null
  stats: FsStats
  /** Drive usage from navigator.storage.estimate(). */
  driveInfo: { free: number; total: number } | null

  init: () => Promise<void>
  refresh: () => Promise<void>

  readText: (uiPath: string[]) => Promise<string>
  writeText: (uiPath: string[], text: string) => Promise<void>
  createFile: (dirUi: string[], name: string, text?: string) => Promise<string | null>
  createFolder: (dirUi: string[], name: string) => Promise<string | null>
  rename: (uiPath: string[], newName: string) => Promise<boolean>
  moveTo: (uiPath: string[], destUi: string[]) => Promise<void>
  /** Send to the Recycle Bin. */
  remove: (uiPath: string[]) => Promise<void>
  restoreBin: (node: FsNode) => Promise<void>
  deleteForever: (node: FsNode) => Promise<void>
  emptyBin: () => Promise<void>
  copyPaths: (uiPaths: string[][], cut: boolean) => void
  paste: (destUi: string[]) => Promise<void>
  pin: (uiPath: string[]) => Promise<void>
  unpin: (fsPath: string[]) => Promise<void>
}

export const useFsStore = create<FsStore>()((set, get) => {
  /** Run an op then rescan. */
  async function mutate(fn: () => Promise<void>): Promise<void> {
    if (!get().supported) return
    try {
      await fn()
    } catch {
      // OPFS hiccup — rescan anyway so the UI reflects real state.
    }
    await get().refresh()
  }

  return {
    ready: false,
    supported: opfs.supported,
    roots: {},
    pins: [],
    clipboard: null,
    stats: { files: 0, folders: 0, bytes: 0 },
    driveInfo: null,

    init: async () => {
      if (get().ready) return
      if (!opfs.supported) {
        // No OPFS — static fallback so the demo still renders.
        set({
          ready: true,
          roots: {
            'Quick access': dirNode('Quick access', [dirNode('Desktop'), dirNode('Downloads'), dirNode('Documents'), dirNode('Pictures')]),
            'This PC': { ...dirNode('This PC'), children: [{ ...driveNode('Local Disk (C:)', ''), children: [] }] },
            'Recycle Bin': dirNode('Recycle Bin'),
          },
        })
        return
      }
      try {
        if (!(await opfs.exists(['Users']))) {
          for (const d of SEED_DIRS) await opfs.mkdir(d)
          for (const [p, text] of SEED_FILES) await opfs.writeText(p, text)
        }
        try {
          const raw = await opfs.readText(PINS_PATH)
          const pins = JSON.parse(raw)
          if (Array.isArray(pins)) set({ pins })
        } catch {
          /* no pins file yet */
        }
        await get().refresh()
      } catch {
        /* OPFS failed — stay on empty roots */
      }
      set({ ready: true })
    },

    refresh: async () => {
      const { roots, stats, driveInfo } = await scanTree(get().pins)
      set({ roots, stats, driveInfo })
    },

    readText: async (uiPath) => {
      const fs = fsPathOf(get().roots, uiPath)
      if (!fs) throw new Error('Not a stored file')
      return opfs.readText(fs)
    },

    writeText: (uiPath, text) =>
      mutate(async () => {
        // Resolve the parent so Save As can create a brand-new name.
        const dir = fsPathOf(get().roots, uiPath.slice(0, -1))
        if (dir) await opfs.writeText([...dir, uiPath[uiPath.length - 1]], text)
      }),

    createFile: (dirUi, name, text = '') => {
      const fsDir = fsPathOf(get().roots, dirUi)
      if (!fsDir || !name || INVALID_NAME.test(name)) return Promise.resolve(null)
      let final: string | null = null
      return mutate(async () => {
        final = await uniqueName(fsDir, name)
        await opfs.writeText([...fsDir, final], text)
      }).then(() => final)
    },

    createFolder: (dirUi, name) => {
      const fsDir = fsPathOf(get().roots, dirUi)
      if (!fsDir || !name || INVALID_NAME.test(name)) return Promise.resolve(null)
      let final: string | null = null
      return mutate(async () => {
        final = await uniqueName(fsDir, name)
        await opfs.mkdir([...fsDir, final])
      }).then(() => final)
    },

    rename: async (uiPath, newName) => {
      const fs = fsPathOf(get().roots, uiPath)
      if (!fs || fs.length === 0 || !newName || INVALID_NAME.test(newName)) return false
      if (await opfs.exists([...fs.slice(0, -1), newName])) return false
      await mutate(() => opfs.move(fs, fs.slice(0, -1), newName))
      return true
    },

    moveTo: (uiPath, destUi) =>
      mutate(async () => {
        const fs = fsPathOf(get().roots, uiPath)
        const dest = fsPathOf(get().roots, destUi)
        if (!fs || !dest || fs.length === 0) return
        if (dest.join('/').startsWith(fs.join('/'))) return // into itself
        const name = await copyName(dest, fs[fs.length - 1])
        await opfs.move(fs, dest, name)
      }),

    remove: (uiPath) =>
      mutate(async () => {
        const fs = fsPathOf(get().roots, uiPath)
        if (!fs || fs.length === 0) return
        await opfs.mkdir(BIN_FS)
        const name = fs[fs.length - 1]
        const binName = `${Date.now()}-${name}`
        await opfs.move(fs, BIN_FS, binName)
        const idx = await readBinIndex()
        idx[binName] = { path: fs, deletedAt: Date.now() }
        await writeBinIndex(idx)
      }),

    restoreBin: (node) =>
      mutate(async () => {
        if (!node.bin || !node.fsPath) return
        const dest = node.bin.originalPath
        if (dest.length === 0) return
        const parent = dest.slice(0, -1)
        const name = await uniqueName(parent, dest[dest.length - 1])
        await opfs.mkdir(parent)
        await opfs.move(node.fsPath, parent, name)
        const idx = await readBinIndex()
        delete idx[node.fsPath[node.fsPath.length - 1]]
        await writeBinIndex(idx)
      }),

    deleteForever: (node) =>
      mutate(async () => {
        if (!node.fsPath) return
        await opfs.remove(node.fsPath)
        const idx = await readBinIndex()
        delete idx[node.fsPath[node.fsPath.length - 1]]
        await writeBinIndex(idx)
      }),

    emptyBin: () =>
      mutate(async () => {
        const entries = await opfs.list(BIN_FS).catch(() => [])
        for (const e of entries) await opfs.remove([...BIN_FS, e.name])
        await writeBinIndex({})
      }),

    copyPaths: (uiPaths, cut) => {
      const fsPaths = uiPaths
        .map((p) => fsPathOf(get().roots, p))
        .filter((p): p is string[] => !!p && p.length > 0)
      set({ clipboard: fsPaths.length ? { fsPaths, cut } : null })
    },

    paste: (destUi) =>
      mutate(async () => {
        const clip = get().clipboard
        const dest = fsPathOf(get().roots, destUi)
        if (!clip || !dest) return
        for (const fs of clip.fsPaths) {
          if (dest.join('/').startsWith(fs.join('/'))) continue
          const name = await copyName(dest, fs[fs.length - 1])
          if (clip.cut) await opfs.move(fs, dest, name)
          else await opfs.copy(fs, dest, name)
        }
        if (clip.cut) set({ clipboard: null })
      }),

    pin: (uiPath) =>
      mutate(async () => {
        const fs = fsPathOf(get().roots, uiPath)
        if (!fs || fs.length === 0) return
        const key = fs.join('/')
        const pins = get().pins
        if (pins.some((p) => p.join('/') === key)) return
        set({ pins: [...pins, fs] })
        await opfs.writeText(PINS_PATH, JSON.stringify(get().pins))
      }),

    unpin: (fsPath) =>
      mutate(async () => {
        const key = fsPath.join('/')
        set({ pins: get().pins.filter((p) => p.join('/') !== key) })
        await opfs.writeText(PINS_PATH, JSON.stringify(get().pins))
      }),
  }
})
