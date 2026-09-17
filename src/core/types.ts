import type { ComponentType } from 'react'
import type { MessageKey } from './i18n/en'

export type IconType = ComponentType<{ className?: string }>

export interface Size {
  width: number
  height: number
}

export interface Rect extends Size {
  x: number
  y: number
}

/** Props every app window component receives. */
export interface AppProps {
  windowId: string
  launch?: unknown
}

/**
 * An installable application. Register one via `registerApp()` and it
 * automatically becomes available to the desktop, taskbar, start menu
 * and window manager.
 */
export interface AppDefinition {
  id: string
  /** Display name — a message key resolved via `t()` at render. */
  title: MessageKey
  icon: IconType
  component: ComponentType<AppProps>
  defaultSize: Size
  minSize?: Size
  /** Re-focus the existing window instead of opening a second one. */
  singleInstance?: boolean
  /** Accent color used by modern-style app placeholders and tiles. */
  color?: string
  /** Hide from the start-menu app list (e.g. internal helper apps). */
  hidden?: boolean
}

export interface WindowState {
  id: string
  appId: string
  launch?: unknown
  /** Optional overrides so a generic app can pose as another program.
   *  `title` may be a message key or a literal (resolved by `t()`). */
  title?: string
  icon?: IconType
  /**
   * Apps may veto a close (e.g. Notepad's unsaved-changes prompt).
   * Return false to keep the window open.
   */
  closeGuard?: () => boolean
  bounds: Rect
  prevBounds: Rect | null
  z: number
  minimized: boolean
  maximized: boolean
}
