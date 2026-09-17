import { create } from 'zustand'
import * as opfs from './opfs'
import {
  BIN_FS,
  DESKTOP_FS,
  dirNode,
  driveNode,
  extOf,
  fileNode,
  resolveChain,
  type FsNode,
} from './tree'

/**
 * Reactive mirror of the OPFS filesystem. The tree is scanned once at
 * session start (seeding on first run), then every mutation writes
 * through to OPFS and rescans — components stay synchronous and the UI
 * updates reactively.
 *
 * Virtual roots (Quick access / This PC / Recycle Bin) are synthesized
 * around the real tree: `C:\` maps to the OPFS root, user folders are
 * aliased into Quick access / This PC, and `$RECYCLE.BIN` backs the
 * Recycle Bin with an `index.json` recording original locations.
 */

interface BinIndex {
  [binName: string]: { path: string[]; deletedAt: number }
}

interface Clipboard {
  fsPaths: string[][]
  cut: boolean
}

export interface FsStats {
  files: number
  folders: number
  bytes: number
}

const PINS_PATH = ['Users', 'User', 'AppData', 'quick-access.json']
const BIN_INDEX = [...BIN_FS, 'index.json']

const GB = 1024 ** 3

/* ------------------------------------------------------------------ */
/* Seed content — written to OPFS on first run.                        */
/* ------------------------------------------------------------------ */

const PLACEHOLDER =
  'This is a sample file in the Windows 10 web demo. Its contents\n' +
  'are stored in the Origin Private File System (OPFS), so edits and\n' +
  'new files persist across reloads.\n'

const SEED_DIRS: string[][] = [
  ['PerfLogs'],
  ['Program Files', 'Common Files'],
  ['Program Files', 'Internet Explorer'],
  ['Program Files', 'Windows Defender'],
  ['Program Files (x86)', 'Common Files'],
  ['Program Files (x86)', 'Microsoft'],
  ['Users', 'User', 'Desktop'],
  ['Users', 'User', 'Documents', 'Work'],
  ['Users', 'User', 'Downloads'],
  ['Users', 'User', 'Pictures', 'Camera Roll'],
  ['Users', 'User', 'Music'],
  ['Users', 'User', 'Videos'],
  ['Users', 'User', 'AppData'],
  ['Users', 'Public', 'Public Documents'],
  ['Users', 'Public', 'Public Pictures'],
  ['Windows', 'System32'],
  ['Windows', 'Fonts'],
  ['Windows', 'Web'],
]

const SEED_FILES: [string[], string][] = [
  [
    [...DESKTOP_FS, 'todo.txt'],
    '- Try double-clicking this file — it opens in Notepad.\n' +
      '- Right-click the desktop: New > Text Document.\n' +
      '- Files, folders and deletions persist (OPFS).\n',
  ],
  [
    ['Users', 'User', 'Documents', 'Welcome.txt'],
    'Welcome to the Windows 10 web demo!\n\n' +
      'This file lives in real browser storage (OPFS). Anything you\n' +
      'create, rename, move or delete in Files, Notepad or on the\n' +
      'desktop survives reloads — the Recycle Bin works too.\n',
  ],
  [
    ['Users', 'User', 'Documents', 'Project notes.txt'],
    'windows-demo\n============\n\n* OPFS-backed virtual filesystem\n' +
      '* Start menu, taskbar, Action Center\n* EN/ZH localization\n',
  ],
  [['Users', 'User', 'Documents', 'Quarterly report.docx'], PLACEHOLDER],
  [['Users', 'User', 'Documents', 'Budget.xlsx'], PLACEHOLDER],
  [
    ['Users', 'User', 'Documents', 'Work', 'Meeting minutes.txt'],
    'Attendees: demo team\n\n- Ship OPFS persistence\n- Polish window animations\n',
  ],
  [['Users', 'User', 'Downloads', 'installer.exe'], PLACEHOLDER],
  [['Users', 'User', 'Downloads', 'windows-demo.zip'], PLACEHOLDER],
  [['Users', 'User', 'Downloads', 'brochure.pdf'], PLACEHOLDER],
  [['Users', 'User', 'Pictures', 'Screenshot (1).png'], PLACEHOLDER],
  [['Users', 'User', 'Pictures', 'Screenshot (2).png'], PLACEHOLDER],
  [['Users', 'User', 'Pictures', 'Camera Roll', 'IMG_2041.jpg'], PLACEHOLDER],
  [['Users', 'User', 'Pictures', 'Camera Roll', 'IMG_2042.jpg'], PLACEHOLDER],
  [['Users', 'User', 'Music', 'demo-track.mp3'], PLACEHOLDER],
  [['Users', 'User', 'Videos', 'capture.mp4'], PLACEHOLDER],
]

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

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

/**
 * fsPath of a UI path — null when the node is purely virtual or the
 * path doesn't fully resolve (an ancestor's fsPath would be wrong).
 */
function fsPathOf(roots: Record<string, FsNode>, uiPath: string[]): string[] | null {
  if (uiPath[0] === 'Recycle Bin') return uiPath.length === 1 ? [...BIN_FS] : null
  const chain = resolveChain(roots, uiPath)
  if (chain.length !== uiPath.length) return null
  return chain[chain.length - 1].fsPath ?? null
}

/** "Report.docx" -> "Report (2).docx" when the name is taken. */
async function uniqueName(dir: string[], name: string): Promise<string> {
  if (!(await opfs.exists([...dir, name]))) return name
  const ext = extOf(name)
  const base = ext ? name.slice(0, -(ext.length + 1)) : name
  const suffix = ext ? `.${ext}` : ''
  for (let i = 2; ; i++) {
    const candidate = `${base} (${i})${suffix}`
    if (!(await opfs.exists([...dir, candidate]))) return candidate
  }
}

/** "Report.docx" -> "Report - Copy.docx" (paste-collision style). */
async function copyName(dir: string[], name: string): Promise<string> {
  if (!(await opfs.exists([...dir, name]))) return name
  const ext = extOf(name)
  const base = ext ? name.slice(0, -(ext.length + 1)) : name
  const suffix = ext ? `.${ext}` : ''
  const candidate = `${base} - Copy${suffix}`
  if (!(await opfs.exists([...dir, candidate]))) return candidate
  return uniqueName(dir, `${base} - Copy${suffix}`)
}

const INVALID_NAME = /[\\/:*?"<>|]/

async function readBinIndex(): Promise<BinIndex> {
  try {
    return JSON.parse(await opfs.readText(BIN_INDEX)) as BinIndex
  } catch {
    return {}
  }
}

async function writeBinIndex(idx: BinIndex): Promise<void> {
  await opfs.mkdir(BIN_FS)
  await opfs.writeText(BIN_INDEX, JSON.stringify(idx))
}

export const useFsStore = create<FsStore>()((set, get) => {
  /** Rescan OPFS and re-synthesize the virtual roots. */
  async function build(): Promise<Record<string, FsNode>> {
    const byFs = new Map<string, FsNode>()
    const stats: FsStats = { files: 0, folders: 0, bytes: 0 }

    async function scan(path: string[]): Promise<FsNode[]> {
      const entries = await opfs.list(path)
      const nodes: FsNode[] = []
      for (const e of entries) {
        if (e.name.startsWith('$')) continue // $RECYCLE.BIN etc.
        const p = [...path, e.name]
        if (e.kind === 'directory') {
          stats.folders++
          const node = dirNode(e.name, await scan(p), p)
          nodes.push(node)
        } else {
          stats.files++
          stats.bytes += e.size
          nodes.push(fileNode(e.name, e.size, e.modified, p))
        }
        byFs.set(p.join('/'), nodes[nodes.length - 1])
      }
      return nodes
    }

    const cChildren = await scan([])
    const byFsPath = (fs: string[]) => byFs.get(fs.join('/'))

    // Drive usage from the real storage estimate.
    let driveInfo: { free: number; total: number } | null = null
    try {
      const est = await navigator.storage.estimate()
      if (est.quota)
        driveInfo = { free: Math.max(0, est.quota - (est.usage ?? 0)), total: est.quota }
    } catch {
      /* estimate unavailable */
    }
    const cDrive: FsNode = {
      ...driveNode('Local Disk (C:)', ''),
      fsPath: [],
      children: cChildren,
      driveInfo: driveInfo ?? undefined,
    }

    // Recycle Bin contents from $RECYCLE.BIN + index.json.
    const binIndex = await readBinIndex()
    const binEntries = await opfs.list(BIN_FS).catch(() => [])
    const binChildren: FsNode[] = []
    for (const e of binEntries) {
      if (e.name === 'index.json') continue
      const meta = binIndex[e.name]
      const original = meta?.path ?? []
      const display = original[original.length - 1] ?? e.name
      const node: FsNode =
        e.kind === 'directory'
          ? { ...dirNode(display, [], [...BIN_FS, e.name]), bin: { originalPath: original, deletedAt: meta?.deletedAt ?? 0 } }
          : {
              ...fileNode(display, e.size, meta ? new Date(meta.deletedAt) : e.modified, [...BIN_FS, e.name]),
              bin: { originalPath: original, deletedAt: meta?.deletedAt ?? 0 },
            }
      binChildren.push(node)
    }

    // User-pinned folders for Quick access.
    const pins = get().pins
    const pinned = pins
      .map((p) => byFsPath(p))
      .filter((n): n is FsNode => !!n)

    const fdir = (fs: string[]) =>
      byFsPath(fs) ?? dirNode(fs[fs.length - 1], [], fs)
    const desktop = fdir(DESKTOP_FS)
    const documents = fdir(['Users', 'User', 'Documents'])
    const downloads = fdir(['Users', 'User', 'Downloads'])
    const pictures = fdir(['Users', 'User', 'Pictures'])
    const music = fdir(['Users', 'User', 'Music'])
    const videos = fdir(['Users', 'User', 'Videos'])

    const dDrive: FsNode = {
      ...driveNode('Data (D:)', ''),
      children: [dirNode('Backups'), dirNode('Media'), dirNode('Projects')],
      driveInfo: { free: 412 * GB, total: 931 * GB },
    }

    const roots: Record<string, FsNode> = {
      'Quick access': {
        ...dirNode('Quick access'),
        children: [desktop, downloads, documents, pictures, ...pinned],
      },
      'This PC': {
        ...dirNode('This PC'),
        children: [desktop, documents, downloads, music, pictures, videos, cDrive, dDrive],
      },
      'Recycle Bin': { ...dirNode('Recycle Bin'), fsPath: [...BIN_FS], children: binChildren },
    }
    set({ stats, driveInfo })
    return roots
  }

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
      set({ roots: await build() })
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
