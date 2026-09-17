import type { MessageKey } from '../core/i18n/en'
import type { IconType } from '../core/types'
import {
  DocFileIcon,
  DriveIcon,
  FileIcon,
  FolderIcon,
  ImageFileIcon,
  MoviesIcon,
  MusicIcon,
} from '../components/icons'

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
  size: string
  children?: FsNode[]
}

const MODIFIED_DIR = new Date(2026, 8, 10, 16, 12)
const MODIFIED_FILE = new Date(2026, 7, 22, 10, 3)

const dir = (
  name: string,
  children: FsNode[] = [],
  icon: IconType = FolderIcon,
  labelKey?: MessageKey,
): FsNode => ({
  name,
  labelKey,
  kind: 'folder',
  icon,
  type: 'fs.type.folder',
  modified: MODIFIED_DIR,
  size: '',
  children,
})

const file = (
  name: string,
  type: MessageKey,
  size: string,
  icon: IconType = FileIcon,
): FsNode => ({
  name,
  kind: 'file',
  icon,
  type,
  size,
  modified: MODIFIED_FILE,
})

const drive = (name: string, size: string, labelKey: MessageKey): FsNode => ({
  name,
  labelKey,
  kind: 'drive',
  icon: DriveIcon,
  type: 'fs.type.drive',
  size,
  modified: null,
})

const documents = dir(
  'Documents',
  [
    file('Project notes.txt', 'fs.type.txt', '2 KB'),
    file('Quarterly report.docx', 'fs.type.docx', '84 KB', DocFileIcon),
    file('Budget.xlsx', 'fs.type.xlsx', '31 KB', DocFileIcon),
    dir('Work', [file('Meeting minutes.txt', 'fs.type.txt', '4 KB')], FolderIcon, 'fs.work'),
  ],
  FolderIcon,
  'fs.documents',
)

const pictures = dir(
  'Pictures',
  [
    file('Screenshot (1).png', 'fs.type.png', '412 KB', ImageFileIcon),
    file('Screenshot (2).png', 'fs.type.png', '389 KB', ImageFileIcon),
    dir(
      'Camera Roll',
      [
        file('IMG_2041.jpg', 'fs.type.jpg', '3.1 MB', ImageFileIcon),
        file('IMG_2042.jpg', 'fs.type.jpg', '2.8 MB', ImageFileIcon),
      ],
      FolderIcon,
      'fs.cameraRoll',
    ),
  ],
  FolderIcon,
  'fs.pictures',
)

const downloads = dir(
  'Downloads',
  [
    file('installer.exe', 'fs.type.exe', '48.2 MB'),
    file('windows-demo.zip', 'fs.type.zip', '12.4 MB'),
    file('brochure.pdf', 'fs.type.pdf', '1.2 MB', DocFileIcon),
  ],
  FolderIcon,
  'fs.downloads',
)

const desktop = dir(
  'Desktop',
  [file('todo.txt', 'fs.type.txt', '1 KB'), dir('Screenshots', [], FolderIcon, 'fs.screenshots')],
  FolderIcon,
  'fs.desktop',
)

const music = dir(
  'Music',
  [file('demo-track.mp3', 'fs.type.mp3', '5.4 MB', MusicIcon)],
  FolderIcon,
  'fs.music',
)

const videos = dir(
  'Videos',
  [file('capture.mp4', 'fs.type.mp4', '128 MB', MoviesIcon)],
  FolderIcon,
  'fs.videos',
)

const cDrive = {
  ...drive('Local Disk (C:)', '89.4 GB free of 237 GB', 'fs.driveC'),
  children: [
    dir('PerfLogs'),
    dir('Program Files', [
      dir('Common Files'),
      dir('Internet Explorer'),
      dir('Windows Defender'),
    ]),
    dir('Program Files (x86)', [dir('Common Files'), dir('Microsoft')]),
    dir('Users', [
      dir('User', [desktop, documents, downloads, pictures, music, videos]),
      dir(
        'Public',
        [
          dir('Public Documents', [], FolderIcon, 'fs.publicDocs'),
          dir('Public Pictures', [], FolderIcon, 'fs.publicPics'),
        ],
        FolderIcon,
        'fs.public',
      ),
    ], FolderIcon, 'fs.users'),
    dir('Windows', [dir('System32'), dir('SysWOW64'), dir('Fonts'), dir('Web')]),
  ],
}

export const roots: Record<string, FsNode> = {
  'Quick access': dir(
    'Quick access',
    [desktop, downloads, documents, pictures],
    FolderIcon,
    'fs.quickAccess',
  ),
  'This PC': {
    ...dir('This PC', [], FolderIcon, 'fs.thisPC'),
    children: [
      desktop,
      documents,
      downloads,
      music,
      pictures,
      videos,
      cDrive,
      drive('Data (D:)', '412 GB free of 931 GB', 'fs.driveD'),
    ],
  },
  'Recycle Bin': dir('Recycle Bin', [], FolderIcon, 'fs.recycleBin'),
}

/** Every node along a path, for per-segment breadcrumb labels. */
export function resolveChain(path: string[]): FsNode[] {
  let node = roots[path[0]] ?? roots['Quick access']
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
export function resolve(path: string[]): FsNode {
  const chain = resolveChain(path)
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
