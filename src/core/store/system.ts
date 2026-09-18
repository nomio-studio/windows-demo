import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
  /** Explicit write — needed for default-true toggles (flipping
      `undefined` would produce a misleading no-op first click). */
  setQuickAction: (id: string, v: boolean) => void

  desktopIconSize: IconSize
  setDesktopIconSize: (s: IconSize) => void

  wallpaper: number
  setWallpaper: (i: number) => void
  lockWallpaper: number
  setLockWallpaper: (i: number) => void
  /** Accent color applied to toggles, sliders, tiles and focus marks. */
  accent: string
  setAccent: (c: string) => void
  /** Ease-of-access: kill all shell animation when on. */
  reduceMotion: boolean
  setReduceMotion: (v: boolean) => void
  /** Frosted-glass backdrop on taskbar/flyouts when on. */
  transparency: boolean
  setTransparency: (v: boolean) => void
  /** The Wi-Fi network currently joined (ssid name). */
  wifiNetwork: string
  setWifiNetwork: (s: string) => void
  /** Update & Security: reload into a ready update without asking. */
  autoUpdate: boolean
  setAutoUpdate: (v: boolean) => void
  /** Cosmetic pref persisted like the real mouse-speed slider. */
  pointerSpeed: number
  setPointerSpeed: (n: number) => void
}

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
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
  setQuickAction: (id, v) =>
    set((s) => ({
      quickActions: { ...s.quickActions, [id]: v },
    })),

  desktopIconSize: 'medium',
  setDesktopIconSize: (desktopIconSize) => set({ desktopIconSize }),

  wallpaper: 0,
  setWallpaper: (wallpaper) => set({ wallpaper }),
  lockWallpaper: 1,
  setLockWallpaper: (lockWallpaper) => set({ lockWallpaper }),
  accent: '#0078D7',
  setAccent: (accent) => set({ accent }),
  reduceMotion: false,
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
  transparency: true,
  setTransparency: (transparency) => set({ transparency }),
  wifiNetwork: 'HomeNet-5G',
  setWifiNetwork: (wifiNetwork) => set({ wifiNetwork }),
  autoUpdate: true,
  setAutoUpdate: (autoUpdate) => set({ autoUpdate }),
  pointerSpeed: 10,
  setPointerSpeed: (pointerSpeed) => set({ pointerSpeed }),
    }),
    {
      name: 'win10.prefs',
      // Only user preferences persist — session/phase state always resets.
      partialize: (s) => ({
        brightness: s.brightness,
        volume: s.volume,
        wifiOn: s.wifiOn,
        quickActions: s.quickActions,
        desktopIconSize: s.desktopIconSize,
        wallpaper: s.wallpaper,
        lockWallpaper: s.lockWallpaper,
        accent: s.accent,
        reduceMotion: s.reduceMotion,
        transparency: s.transparency,
        wifiNetwork: s.wifiNetwork,
        autoUpdate: s.autoUpdate,
        pointerSpeed: s.pointerSpeed,
      }),
    },
  ),
)
