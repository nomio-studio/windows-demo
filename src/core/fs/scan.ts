import * as opfs from './opfs'
import { readBinIndex } from './bin'
import {
  BIN_FS,
  DESKTOP_FS,
  dirNode,
  driveNode,
  fileNode,
  type FsNode,
} from './tree'

/*
 * OPFS → FsNode tree scan. The real tree is scanned, then the virtual
 * roots (Quick access / This PC / Recycle Bin) are synthesized around
 * it: `C:\` maps to the OPFS root, user folders are aliased into the
 * virtual roots, and `$RECYCLE.BIN` backs the Recycle Bin.
 */

export interface FsStats {
  files: number
  folders: number
  bytes: number
}

export interface ScanResult {
  roots: Record<string, FsNode>
  stats: FsStats
  /** Drive usage from navigator.storage.estimate(). */
  driveInfo: { free: number; total: number } | null
}

const GB = 1024 ** 3

/** Rescan OPFS and re-synthesize the virtual roots. */
export async function scanTree(pins: string[][]): Promise<ScanResult> {
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
  return { roots, stats, driveInfo }
}
