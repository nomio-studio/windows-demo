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
  name: string
  kind: 'folder' | 'file' | 'drive'
  icon: IconType
  type: string
  modified: string
  size: string
  children?: FsNode[]
}

const dir = (
  name: string,
  children: FsNode[] = [],
  icon: IconType = FolderIcon,
): FsNode => ({
  name,
  kind: 'folder',
  icon,
  type: 'File folder',
  modified: '9/10/2026 4:12 PM',
  size: '',
  children,
})

const file = (
  name: string,
  type: string,
  size: string,
  icon: IconType = FileIcon,
): FsNode => ({
  name,
  kind: 'file',
  icon,
  type,
  size,
  modified: '8/22/2026 10:03 AM',
})

const drive = (name: string, size: string): FsNode => ({
  name,
  kind: 'drive',
  icon: DriveIcon,
  type: 'Local Disk',
  size,
  modified: '',
})

const documents = dir('Documents', [
  file('Project notes.txt', 'Text Document', '2 KB'),
  file('Quarterly report.docx', 'Microsoft Word Document', '84 KB', DocFileIcon),
  file('Budget.xlsx', 'Microsoft Excel Worksheet', '31 KB', DocFileIcon),
  dir('Work', [file('Meeting minutes.txt', 'Text Document', '4 KB')]),
])

const pictures = dir('Pictures', [
  file('Screenshot (1).png', 'PNG File', '412 KB', ImageFileIcon),
  file('Screenshot (2).png', 'PNG File', '389 KB', ImageFileIcon),
  dir('Camera Roll', [
    file('IMG_2041.jpg', 'JPG File', '3.1 MB', ImageFileIcon),
    file('IMG_2042.jpg', 'JPG File', '2.8 MB', ImageFileIcon),
  ]),
])

const downloads = dir('Downloads', [
  file('installer.exe', 'Application', '48.2 MB'),
  file('windows-demo.zip', 'Compressed (zipped) Folder', '12.4 MB'),
  file('brochure.pdf', 'PDF Document', '1.2 MB', DocFileIcon),
])

const desktop = dir('Desktop', [
  file('todo.txt', 'Text Document', '1 KB'),
  dir('Screenshots'),
])

const music = dir('Music', [
  file('demo-track.mp3', 'MP3 File', '5.4 MB', MusicIcon),
])

const videos = dir('Videos', [
  file('capture.mp4', 'MP4 Video', '128 MB', MoviesIcon),
])

const cDrive = {
  ...drive('Local Disk (C:)', '89.4 GB free of 237 GB'),
  children: [
    dir('PerfLogs'),
    dir('Program Files', [dir('Common Files'), dir('Internet Explorer'), dir('Windows Defender')]),
    dir('Program Files (x86)', [dir('Common Files'), dir('Microsoft')]),
    dir('Users', [
      dir('User', [desktop, documents, downloads, pictures, music, videos]),
      dir('Public', [dir('Public Documents'), dir('Public Pictures')]),
    ]),
    dir('Windows', [dir('System32'), dir('SysWOW64'), dir('Fonts'), dir('Web')]),
  ],
}

export const roots: Record<string, FsNode> = {
  'Quick access': dir('Quick access', [desktop, downloads, documents, pictures], FolderIcon),
  'This PC': {
    ...dir('This PC'),
    children: [desktop, documents, downloads, music, pictures, videos, cDrive, drive('Data (D:)', '412 GB free of 931 GB')],
  },
  'Recycle Bin': dir('Recycle Bin', []),
}

/** Resolve a path like ['This PC', 'Local Disk (C:)', 'Windows']. */
export function resolve(path: string[]): FsNode {
  let node = roots[path[0]] ?? roots['Quick access']
  for (const seg of path.slice(1)) {
    const next = node.children?.find((c) => c.name === seg)
    if (!next) break
    node = next
  }
  return node
}

/** Left-hand navigation pane entries. */
export interface NavEntry {
  label: string
  path: string[]
  icon: IconType
  indent?: boolean
}

export const navEntries: NavEntry[] = [
  { label: 'Quick access', path: ['Quick access'], icon: FolderIcon },
  { label: 'Desktop', path: ['Quick access', 'Desktop'], icon: FolderIcon, indent: true },
  { label: 'Downloads', path: ['Quick access', 'Downloads'], icon: FolderIcon, indent: true },
  { label: 'Documents', path: ['Quick access', 'Documents'], icon: FolderIcon, indent: true },
  { label: 'Pictures', path: ['Quick access', 'Pictures'], icon: FolderIcon, indent: true },
  { label: 'This PC', path: ['This PC'], icon: DriveIcon },
  { label: 'Local Disk (C:)', path: ['This PC', 'Local Disk (C:)'], icon: DriveIcon, indent: true },
  { label: 'Data (D:)', path: ['This PC', 'Data (D:)'], icon: DriveIcon, indent: true },
  { label: 'Recycle Bin', path: ['Recycle Bin'], icon: FolderIcon },
]
