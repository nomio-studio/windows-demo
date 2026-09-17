import type { CSSProperties } from 'react'
import type { MessageKey } from '../core/i18n/en'
import type { FsNode } from '../core/fs/tree'
import type { IconType } from '../core/types'
import {
  AppsIcon,
  EdgeIcon,
  FileIcon,
  FolderIcon,
  MicIcon,
  NotepadIcon,
  PaintIcon,
  PhotosIcon,
  RecycleBinIcon,
  SettingsIcon,
  StickyNoteIcon,
  ThisPCIcon,
} from '../components/icons'

/* ------------------------------------------------------------------ */
/* Wallpapers — add an entry here and it appears in Settings >         */
/* Personalization automatically.                                      */
/* ------------------------------------------------------------------ */

export interface Wallpaper {
  /** Display name — a message key resolved via `t()`. */
  name: MessageKey
  style: CSSProperties
}

export const wallpapers: Wallpaper[] = [
  {
    name: 'wp.hero',
    style: {
      background:
        'radial-gradient(ellipse 90% 70% at 68% 32%, rgba(80,160,240,0.75), transparent 55%),' +
        'radial-gradient(ellipse 70% 80% at 25% 75%, rgba(10,110,220,0.7), transparent 60%),' +
        'linear-gradient(155deg, #1a5fb4 0%, #0d3e8f 45%, #062a6e 100%)',
    },
  },
  {
    name: 'wp.teal',
    style: {
      background:
        'radial-gradient(ellipse 60% 60% at 70% 30%, rgba(120,220,200,0.5), transparent 55%),' +
        'radial-gradient(ellipse 60% 70% at 25% 70%, rgba(20,140,130,0.7), transparent 60%),' +
        'linear-gradient(150deg, #0e6e6b 0%, #0a4f5e 55%, #073642 100%)',
    },
  },
  {
    name: 'wp.midnight',
    style: {
      background:
        'radial-gradient(ellipse 80% 60% at 60% 20%, rgba(80,80,140,0.5), transparent 55%),' +
        'linear-gradient(160deg, #1b1b3a 0%, #12122b 60%, #0a0a1a 100%)',
    },
  },
  {
    name: 'wp.blue',
    style: { background: '#0078D7' },
  },
]

/* ------------------------------------------------------------------ */
/* Desktop icons                                                       */
/* ------------------------------------------------------------------ */

export interface DesktopIconEntry {
  id: string
  /** Display label — a message key resolved via `t()` (file names pass through). */
  label: MessageKey | (string & {})
  icon: IconType
  appId: string
  launch?: unknown
  /** Window title — a message key resolved via `t()`. */
  title?: MessageKey
  /** Set when the icon is a real file/folder on the OPFS Desktop. */
  fs?: FsNode
}

export const desktopIcons: DesktopIconEntry[] = [
  { id: 'thispc', label: 'fs.thisPC', icon: ThisPCIcon, appId: 'explorer', launch: { path: ['This PC'] }, title: 'fs.thisPC' },
  { id: 'bin', label: 'fs.recycleBin', icon: RecycleBinIcon, appId: 'explorer', launch: { path: ['Recycle Bin'] }, title: 'fs.recycleBin' },
  { id: 'edge', label: 'app.edge', icon: EdgeIcon, appId: 'edge' },
  { id: 'explorer', label: 'app.explorer', icon: FolderIcon, appId: 'explorer' },
  { id: 'notepad', label: 'app.notepad', icon: NotepadIcon, appId: 'notepad' },
  { id: 'settings', label: 'app.settings', icon: SettingsIcon, appId: 'settings' },
]

/* ------------------------------------------------------------------ */
/* Taskbar                                                             */
/* ------------------------------------------------------------------ */

/** Apps pinned to the taskbar (in addition to running apps). */
export const taskbarPins: string[] = ['edge', 'store', 'explorer']

/* ------------------------------------------------------------------ */
/* Start menu                                                          */
/* ------------------------------------------------------------------ */

export type TileSize = 'sm' | 'md' | 'wd' | 'lg'

export interface StartTile {
  appId: string
  size: TileSize
  /** Tile background; falls back to the app's accent color. */
  color?: string
  /** Label override — a message key resolved via `t()`. */
  label?: MessageKey
}

export interface StartTileGroup {
  /** Group heading — a message key resolved via `t()`. */
  name: MessageKey
  tiles: StartTile[]
}

export const startTileGroups: StartTileGroup[] = [
  {
    name: 'start.group1',
    tiles: [
      { appId: 'edge', size: 'wd', color: '#20538C' },
      { appId: 'store', size: 'md' },
      { appId: 'photos', size: 'md' },
      { appId: 'calendar', size: 'md' },
      { appId: 'weather', size: 'md' },
      { appId: 'mail', size: 'wd' },
    ],
  },
  {
    name: 'start.group2',
    tiles: [
      { appId: 'xbox', size: 'md' },
      { appId: 'groove', size: 'md', label: 'app.groove' },
      { appId: 'movies', size: 'md', label: 'app.movies' },
      { appId: 'calculator', size: 'sm' },
      { appId: 'notepad', size: 'sm' },
      { appId: 'settings', size: 'md' },
      { appId: 'camera', size: 'md' },
      { appId: 'maps', size: 'md' },
    ],
  },
]

/** Extra names shown in the start-menu app list (open as placeholders). */
export interface StartExtra {
  /** Display name — a message key resolved via `t()`. */
  name: MessageKey
  icon: IconType
  color: string
}

export const startExtras: StartExtra[] = [
  { name: 'app.x3dviewer', icon: AppsIcon, color: '#7A5EA8' },
  { name: 'app.paint3d', icon: PaintIcon, color: '#5B2D8E' },
  { name: 'app.sticky', icon: StickyNoteIcon, color: '#E8B93E' },
  { name: 'app.voicerec', icon: MicIcon, color: '#4A4A4A' },
]

/** Folder shortcuts on the start-menu side rail. */
export interface RailItem {
  id: string
  /** Display label — a message key resolved via `t()`. */
  label: MessageKey
  icon: IconType
  appId: string
  launch?: unknown
  /** Window title — a message key resolved via `t()`. */
  title?: MessageKey
}

export const railItems: RailItem[] = [
  { id: 'documents', label: 'start.rail.documents', icon: FileIcon, appId: 'explorer', launch: { path: ['Quick access', 'Documents'] }, title: 'fs.documents' },
  { id: 'pictures', label: 'start.rail.pictures', icon: PhotosIcon, appId: 'explorer', launch: { path: ['Quick access', 'Pictures'] }, title: 'fs.pictures' },
  { id: 'settings', label: 'app.settings', icon: SettingsIcon, appId: 'settings' },
]
