import type { MessageKey } from '../i18n/en'
import type { IconType } from '../types'
import {
  DocFileIcon,
  DriveIcon,
  FileIcon,
  FolderIcon,
  ImageFileIcon,
  MoviesIcon,
  MusicIcon,
  NotepadIcon,
} from '../../components/icons'

export interface FsNode {
  /** Identity + path segment — stays in English (like real folder paths). */
  name: string
  /** Display name for known folders — a message key resolved via `t()`. */
  labelKey?: MessageKey
  kind: 'folder' | 'file' | 'drive'
  icon: IconType
  /** File-type column — a message key resolved via `t()`. */
  type: MessageKey
  modified: Date | null
  /** Human-readable size (formatted at scan time). */
  size: string
  /** Byte size — used by sort + the properties dialog. */
  sizeBytes: number
  children?: FsNode[]
  /** Backing OPFS path; undefined for purely virtual nodes. */
  fsPath?: string[]
  /** Recycle-bin entry: where it came from and when it was deleted. */
  bin?: { originalPath: string[]; deletedAt: number }
  /** Drives only: free/total bytes (real storage estimate for C:). */
  driveInfo?: { free: number; total: number }
}

/** Known-folder display names (matched by real directory name). */
export const LABEL_KEYS: Record<string, MessageKey> = {
  'Quick access': 'fs.quickAccess',
  'This PC': 'fs.thisPC',
  'Recycle Bin': 'fs.recycleBin',
  Desktop: 'fs.desktop',
  Documents: 'fs.documents',
  Downloads: 'fs.downloads',
  Pictures: 'fs.pictures',
  Music: 'fs.music',
  Videos: 'fs.videos',
  Users: 'fs.users',
  Public: 'fs.public',
  'Public Documents': 'fs.publicDocs',
  'Public Pictures': 'fs.publicPics',
  'Local Disk (C:)': 'fs.driveC',
  'Data (D:)': 'fs.driveD',
  Work: 'fs.work',
  'Camera Roll': 'fs.cameraRoll',
  Screenshots: 'fs.screenshots',
}

interface TypeInfo {
  type: MessageKey
  icon: IconType
}

const EXT_TYPES: Record<string, TypeInfo> = {
  txt: { type: 'fs.type.txt', icon: NotepadIcon },
  md: { type: 'fs.type.md', icon: NotepadIcon },
  log: { type: 'fs.type.txt', icon: NotepadIcon },
  docx: { type: 'fs.type.docx', icon: DocFileIcon },
  doc: { type: 'fs.type.docx', icon: DocFileIcon },
  xlsx: { type: 'fs.type.xlsx', icon: DocFileIcon },
  pdf: { type: 'fs.type.pdf', icon: DocFileIcon },
  png: { type: 'fs.type.png', icon: ImageFileIcon },
  jpg: { type: 'fs.type.jpg', icon: ImageFileIcon },
  jpeg: { type: 'fs.type.jpg', icon: ImageFileIcon },
  gif: { type: 'fs.type.png', icon: ImageFileIcon },
  webp: { type: 'fs.type.png', icon: ImageFileIcon },
  mp3: { type: 'fs.type.mp3', icon: MusicIcon },
  wav: { type: 'fs.type.mp3', icon: MusicIcon },
  mp4: { type: 'fs.type.mp4', icon: MoviesIcon },
  exe: { type: 'fs.type.exe', icon: FileIcon },
  zip: { type: 'fs.type.zip', icon: FileIcon },
  json: { type: 'fs.type.json', icon: FileIcon },
}

export function extOf(name: string): string {
  const i = name.lastIndexOf('.')
  return i > 0 ? name.slice(i + 1).toLowerCase() : ''
}

/** Extensions Notepad can open. */
export const TEXT_EXTS = new Set(['txt', 'md', 'log', 'json', 'csv'])

/** Type label + icon for a file name. */
export function typeFor(name: string): TypeInfo {
  return EXT_TYPES[extOf(name)] ?? { type: 'fs.type.file', icon: FileIcon }
}

export function formatSize(bytes: number): string {
  if (bytes <= 0) return ''
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let v = bytes
  let u = -1
  do {
    v /= 1024
    u++
  } while (v >= 1024 && u < units.length - 1)
  return `${v >= 100 ? Math.round(v) : v.toFixed(1)} ${units[u]}`
}

export const dirNode = (
  name: string,
  children: FsNode[] = [],
  fsPath?: string[],
): FsNode => ({
  name,
  labelKey: LABEL_KEYS[name],
  kind: 'folder',
  icon: FolderIcon,
  type: 'fs.type.folder',
  modified: null,
  size: '',
  sizeBytes: 0,
  children,
  fsPath,
})

export const fileNode = (
  name: string,
  sizeBytes: number,
  modified: Date | null,
  fsPath?: string[],
): FsNode => ({
  name,
  kind: 'file',
  ...typeFor(name),
  modified,
  size: formatSize(sizeBytes),
  sizeBytes,
  fsPath,
})

export const driveNode = (name: string, size: string): FsNode => ({
  name,
  labelKey: LABEL_KEYS[name],
  kind: 'drive',
  icon: DriveIcon,
  type: 'fs.type.drive',
  modified: null,
  size,
  sizeBytes: 0,
})

/** Every node along a path, for per-segment breadcrumb labels. */
export function resolveChain(roots: Record<string, FsNode>, path: string[]): FsNode[] {
  // Fall back to an empty node while the fs is still initializing
  // (roots = {}), so callers can always read `.children`.
  let node = roots[path[0]] ?? roots['Quick access'] ?? dirNode(path[0] ?? '')
  const chain = [node]
  for (const seg of path.slice(1)) {
    const next = node.children?.find((c) => c.name === seg)
    if (!next) break
    node = next
    chain.push(node)
  }
  return chain
}

/** Resolve a path like ['This PC', 'Local Disk (C:)', 'Windows']. */
export function resolve(roots: Record<string, FsNode>, path: string[]): FsNode {
  const chain = resolveChain(roots, path)
  return chain[chain.length - 1]
}

/** Left-hand navigation pane entries. */
export interface NavEntry {
  /** Display label — a message key resolved via `t()`. */
  labelKey: MessageKey
  path: string[]
  icon: IconType
  indent?: boolean
}

export const navEntries: NavEntry[] = [
  { labelKey: 'fs.quickAccess', path: ['Quick access'], icon: FolderIcon },
  { labelKey: 'fs.desktop', path: ['Quick access', 'Desktop'], icon: FolderIcon, indent: true },
  { labelKey: 'fs.downloads', path: ['Quick access', 'Downloads'], icon: FolderIcon, indent: true },
  { labelKey: 'fs.documents', path: ['Quick access', 'Documents'], icon: FolderIcon, indent: true },
  { labelKey: 'fs.pictures', path: ['Quick access', 'Pictures'], icon: FolderIcon, indent: true },
  { labelKey: 'fs.thisPC', path: ['This PC'], icon: DriveIcon },
  { labelKey: 'fs.driveC', path: ['This PC', 'Local Disk (C:)'], icon: DriveIcon, indent: true },
  { labelKey: 'fs.driveD', path: ['This PC', 'Data (D:)'], icon: DriveIcon, indent: true },
  { labelKey: 'fs.recycleBin', path: ['Recycle Bin'], icon: FolderIcon },
]

/** OPFS path for a UI node path segment that exists under C:\. */
export const DESKTOP_FS = ['Users', 'User', 'Desktop']
export const DOCUMENTS_FS = ['Users', 'User', 'Documents']
export const BIN_FS = ['$RECYCLE.BIN']

/** UI path of the Desktop folder (Quick access alias). */
export const DESKTOP_UI = ['Quick access', 'Desktop']
