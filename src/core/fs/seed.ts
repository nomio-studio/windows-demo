import { DESKTOP_FS } from './tree'

/* Seed content — written to OPFS on first run. */

const PLACEHOLDER =
  'This is a sample file in the Windows 10 web demo. Its contents\n' +
  'are stored in the Origin Private File System (OPFS), so edits and\n' +
  'new files persist across reloads.\n'

export const SEED_DIRS: string[][] = [
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

export const SEED_FILES: [string[], string][] = [
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
