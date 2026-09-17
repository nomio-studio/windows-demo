import { create } from 'zustand'
import type { IconType } from '../types'

/** Mutually-exclusive shell panels. */
export type Flyout =
  | 'start'
  | 'search'
  | 'calendar'
  | 'actionCenter'
  | 'volume'
  | 'network'
  | 'trayOverflow'
  | 'language'
  | null

/** OS-level power/session state machine. */
export type SessionPhase =
  | 'boot'
  | 'lock'
  | 'signin'
  | 'desktop'
  | 'shutdown'
  | 'restart'
  | 'off'

export type IconSize = 'small' | 'medium' | 'large'

export interface ContextMenuItem {
  type?: 'item' | 'separator'
  label?: string
  shortcut?: string
  disabled?: boolean
  checked?: boolean
  icon?: IconType
  submenu?: ContextMenuItem[]
  onClick?: () => void
}

interface SystemStore {
  phase: SessionPhase
  setPhase: (p: SessionPhase) => void

  flyout: Flyout
  setFlyout: (f: Flyout) => void
  toggleFlyout: (f: Exclude<Flyout, null>) => void

  brightness: number
  setBrightness: (n: number) => void
  volume: number
  setVolume: (n: number) => void
  wifiOn: boolean
  toggleWifi: () => void
  quickActions: Record<string, boolean>
  toggleQuickAction: (id: string) => void

  desktopIconSize: IconSize
  setDesktopIconSize: (s: IconSize) => void

  wallpaper: number
  setWallpaper: (i: number) => void
}

export const useSystemStore = create<SystemStore>()((set) => ({
  phase: 'boot',
  setPhase: (phase) => set({ phase, flyout: null }),

  flyout: null,
  setFlyout: (flyout) => set({ flyout }),
  toggleFlyout: (f) => set((s) => ({ flyout: s.flyout === f ? null : f })),

  brightness: 85,
  setBrightness: (brightness) => set({ brightness }),
  volume: 60,
  setVolume: (volume) => set({ volume }),
  wifiOn: true,
  toggleWifi: () => set((s) => ({ wifiOn: !s.wifiOn })),

  quickActions: {
    tablet: false,
    network: true,
    bluetooth: false,
    airplane: false,
    nightlight: false,
    location: false,
    batterySaver: false,
    vpn: false,
  },
  toggleQuickAction: (id) =>
    set((s) => ({
      quickActions: { ...s.quickActions, [id]: !s.quickActions[id] },
    })),

  desktopIconSize: 'medium',
  setDesktopIconSize: (desktopIconSize) => set({ desktopIconSize }),

  wallpaper: 0,
  setWallpaper: (wallpaper) => set({ wallpaper }),
}))
