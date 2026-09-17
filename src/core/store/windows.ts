import { create } from 'zustand'
import { getApp } from '../registry'
import type { IconType, Rect, WindowState } from '../types'

export const TASKBAR_HEIGHT = 40

let counter = 0

export interface OpenOptions {
  /** Per-app launch payload (e.g. initial path for Explorer). */
  launch?: unknown
  /** Overrides so a generic app window can pose as another program. */
  title?: string
  icon?: IconType
}

interface WindowsStore {
  windows: WindowState[]
  activeId: string | null
  topZ: number
  openApp: (appId: string, opts?: OpenOptions) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  /** Taskbar-button behaviour: focus, restore, or minimize if focused. */
  toggleTaskbar: (id: string) => void
  toggleMaximize: (id: string) => void
  setBounds: (id: string, r: Rect) => void
  minimizeAll: () => void
}

function spawnBounds(appId: string, index: number): Rect {
  const app = getApp(appId)
  const vw = window.innerWidth
  const vh = window.innerHeight - TASKBAR_HEIGHT
  const width = Math.min(app.defaultSize.width, vw - 16)
  const height = Math.min(app.defaultSize.height, vh - 16)
  const offset = (index % 6) * 30
  return {
    width,
    height,
    x: Math.max(0, Math.round((vw - width) / 2) - 40 + offset),
    y: Math.max(0, Math.round((vh - height) / 2) - 20 + offset),
  }
}

export const useWindowsStore = create<WindowsStore>()((set, get) => ({
  windows: [],
  activeId: null,
  topZ: 1,

  openApp: (appId, opts) => {
    const app = getApp(appId)
    const s = get()
    if (app.singleInstance) {
      const existing = s.windows.find((w) => w.appId === appId)
      if (existing) {
        s.focusWindow(existing.id)
        return
      }
    }
    const id = `w${++counter}`
    const win: WindowState = {
      id,
      appId,
      launch: opts?.launch,
      title: opts?.title,
      icon: opts?.icon,
      bounds: spawnBounds(appId, s.windows.length),
      prevBounds: null,
      z: s.topZ + 1,
      minimized: false,
      maximized: false,
    }
    set({ windows: [...s.windows, win], activeId: id, topZ: s.topZ + 1 })
  },

  closeWindow: (id) =>
    set((s) => {
      const windows = s.windows.filter((w) => w.id !== id)
      const activeId =
        s.activeId === id
          ? (windows
              .filter((w) => !w.minimized)
              .sort((a, b) => b.z - a.z)[0]?.id ?? null)
          : s.activeId
      return { windows, activeId }
    }),

  focusWindow: (id) =>
    set((s) => ({
      topZ: s.topZ + 1,
      activeId: id,
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, z: s.topZ + 1, minimized: false } : w,
      ),
    })),

  minimizeWindow: (id) =>
    set((s) => ({
      activeId: s.activeId === id ? null : s.activeId,
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w,
      ),
    })),

  toggleTaskbar: (id) => {
    const s = get()
    const w = s.windows.find((x) => x.id === id)
    if (!w) return
    if (w.minimized || s.activeId !== id) s.focusWindow(id)
    else s.minimizeWindow(id)
  },

  toggleMaximize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w
        if (w.maximized) {
          return {
            ...w,
            maximized: false,
            bounds: w.prevBounds ?? w.bounds,
            prevBounds: null,
          }
        }
        return {
          ...w,
          maximized: true,
          prevBounds: w.bounds,
          bounds: {
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight - TASKBAR_HEIGHT,
          },
        }
      }),
    })),

  setBounds: (id, r) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, bounds: r } : w)),
    })),

  minimizeAll: () =>
    set((s) => ({
      activeId: null,
      windows: s.windows.map((w) => ({ ...w, minimized: true })),
    })),
}))
