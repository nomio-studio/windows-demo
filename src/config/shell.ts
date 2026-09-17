import type { CSSProperties } from 'react'
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
  name: string
  style: CSSProperties
}

export const wallpapers: Wallpaper[] = [
  {
    name: 'Windows Hero',
    style: {
      background:
        'radial-gradient(ellipse 90% 70% at 68% 32%, rgba(80,160,240,0.75), transparent 55%),' +
        'radial-gradient(ellipse 70% 80% at 25% 75%, rgba(10,110,220,0.7), transparent 60%),' +
        'linear-gradient(155deg, #1a5fb4 0%, #0d3e8f 45%, #062a6e 100%)',
    },
  },
  {
    name: 'Teal Bloom',
    style: {
      background:
        'radial-gradient(ellipse 60% 60% at 70% 30%, rgba(120,220,200,0.5), transparent 55%),' +
        'radial-gradient(ellipse 60% 70% at 25% 70%, rgba(20,140,130,0.7), transparent 60%),' +
        'linear-gradient(150deg, #0e6e6b 0%, #0a4f5e 55%, #073642 100%)',
    },
  },
  {
    name: 'Midnight',
    style: {
      background:
        'radial-gradient(ellipse 80% 60% at 60% 20%, rgba(80,80,140,0.5), transparent 55%),' +
        'linear-gradient(160deg, #1b1b3a 0%, #12122b 60%, #0a0a1a 100%)',
    },
  },
  {
    name: 'Solid Blue',
    style: { background: '#0078D7' },
  },
]

/* ------------------------------------------------------------------ */
/* Desktop icons                                                       */
/* ------------------------------------------------------------------ */

export interface DesktopIconEntry {
  id: string
  label: string
  icon: IconType
  appId: string
  launch?: unknown
  title?: string
}

export const desktopIcons: DesktopIconEntry[] = [
  { id: 'thispc', label: 'This PC', icon: ThisPCIcon, appId: 'explorer', launch: { path: ['This PC'] }, title: 'This PC' },
  { id: 'bin', label: 'Recycle Bin', icon: RecycleBinIcon, appId: 'explorer', launch: { path: ['Recycle Bin'] }, title: 'Recycle Bin' },
  { id: 'edge', label: 'Microsoft Edge', icon: EdgeIcon, appId: 'edge' },
  { id: 'explorer', label: 'File Explorer', icon: FolderIcon, appId: 'explorer' },
  { id: 'notepad', label: 'Notepad', icon: NotepadIcon, appId: 'notepad' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, appId: 'settings' },
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
  label?: string
}

export interface StartTileGroup {
  name: string
  tiles: StartTile[]
}

export const startTileGroups: StartTileGroup[] = [
  {
    name: 'Life at a glance',
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
    name: 'Play and explore',
    tiles: [
      { appId: 'xbox', size: 'md' },
      { appId: 'groove', size: 'md', label: 'Groove Music' },
      { appId: 'movies', size: 'md', label: 'Movies & TV' },
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
  name: string
  icon: IconType
  color: string
}

export const startExtras: StartExtra[] = [
  { name: '3D Viewer', icon: AppsIcon, color: '#7A5EA8' },
  { name: 'Paint 3D', icon: PaintIcon, color: '#5B2D8E' },
  { name: 'Sticky Notes', icon: StickyNoteIcon, color: '#E8B93E' },
  { name: 'Voice Recorder', icon: MicIcon, color: '#4A4A4A' },
]

/** Folder shortcuts on the start-menu side rail. */
export interface RailItem {
  id: string
  label: string
  icon: IconType
  appId: string
  launch?: unknown
  title?: string
}

export const railItems: RailItem[] = [
  { id: 'documents', label: 'Documents', icon: FileIcon, appId: 'explorer', launch: { path: ['Quick access', 'Documents'] }, title: 'Documents' },
  { id: 'pictures', label: 'Pictures', icon: PhotosIcon, appId: 'explorer', launch: { path: ['Quick access', 'Pictures'] }, title: 'Pictures' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, appId: 'settings' },
]
