import { registerApp } from '../core/registry'
import type { AppDefinition } from '../core/types'
import CalculatorApp from './Calculator'
import EdgeApp from './Edge'
import ExplorerApp from './Explorer'
import ModernApp from './ModernApp'
import NotepadApp from './Notepad'
import SettingsApp from './Settings'
import {
  AppsIcon,
  CalculatorIcon,
  CalendarIcon,
  CameraIcon,
  EdgeIcon,
  FolderIcon,
  MailIcon,
  MapsIcon,
  MoviesIcon,
  MusicIcon,
  NotepadIcon,
  PhotosIcon,
  SettingsIcon,
  StoreIcon,
  WeatherIcon,
  XboxIcon,
} from '../components/icons'

/**
 * Install every app into the registry. To add a new program to the OS:
 * write its component and call `registerApp` here — it immediately
 * appears in the start menu, can be pinned, tiled or placed on the
 * desktop via `src/config/shell.ts`.
 */
export function registerApps(): void {
  registerApp({
    id: 'explorer',
    title: 'File Explorer',
    icon: FolderIcon,
    component: ExplorerApp,
    defaultSize: { width: 960, height: 600 },
    minSize: { width: 520, height: 340 },
  })
  registerApp({
    id: 'edge',
    title: 'Microsoft Edge',
    icon: EdgeIcon,
    component: EdgeApp,
    defaultSize: { width: 1100, height: 680 },
    minSize: { width: 640, height: 420 },
    color: '#2E7FC7',
  })
  registerApp({
    id: 'notepad',
    title: 'Notepad',
    icon: NotepadIcon,
    component: NotepadApp,
    defaultSize: { width: 720, height: 480 },
    minSize: { width: 360, height: 240 },
  })
  registerApp({
    id: 'calculator',
    title: 'Calculator',
    icon: CalculatorIcon,
    component: CalculatorApp,
    defaultSize: { width: 340, height: 520 },
    minSize: { width: 320, height: 480 },
    singleInstance: true,
  })
  registerApp({
    id: 'settings',
    title: 'Settings',
    icon: SettingsIcon,
    component: SettingsApp,
    defaultSize: { width: 900, height: 600 },
    minSize: { width: 560, height: 400 },
    singleInstance: true,
  })

  // Modern-style placeholder apps (Store, Mail, Photos, …)
  const modern = (
    id: string,
    title: string,
    icon: AppDefinition['icon'],
    color: string,
  ): AppDefinition => ({
    id,
    title,
    icon,
    color,
    component: ModernApp,
    defaultSize: { width: 560, height: 420 },
    minSize: { width: 360, height: 280 },
    singleInstance: true,
  })

  registerApp(modern('store', 'Microsoft Store', StoreIcon, '#0078D7'))
  registerApp(modern('photos', 'Photos', PhotosIcon, '#7A5EA8'))
  registerApp(modern('mail', 'Mail', MailIcon, '#0F6CBD'))
  registerApp(modern('calendar', 'Calendar', CalendarIcon, '#D83B01'))
  registerApp(modern('weather', 'Weather', WeatherIcon, '#0078D7'))
  registerApp(modern('xbox', 'Xbox', XboxIcon, '#107C10'))
  registerApp(modern('groove', 'Groove Music', MusicIcon, '#D83B01'))
  registerApp(modern('movies', 'Movies & TV', MoviesIcon, '#5B2D8E'))
  registerApp(modern('camera', 'Camera', CameraIcon, '#4A4A4A'))
  registerApp(modern('maps', 'Maps', MapsIcon, '#107C10'))

  // Generic fallback used by start-list extras / tray overflow.
  registerApp({
    id: 'modern',
    title: 'App',
    icon: AppsIcon,
    component: ModernApp,
    defaultSize: { width: 560, height: 420 },
    minSize: { width: 360, height: 280 },
    hidden: true,
  })
}
