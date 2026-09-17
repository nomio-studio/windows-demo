import { create } from 'zustand'
import { getApp } from '../registry'
import type { IconType, Rect, Size, WindowState } from '../types'

export const TASKBAR_HEIGHT = 40

/**
 * Current drawable area of the desktop. Measures the shell element so
 * safe-area insets are honoured; falls back to the visual viewport
 * (which, unlike innerWidth/innerHeight, tracks pinch-zoom and
 * collapsing mobile browser chrome).
 */
export function shellSize(): Size {
  const el = document.getElementById('shell')
  if (el) return { width: el.clientWidth, height: el.clientHeight }
  const vv = window.visualViewport
  return {
    width: Math.round(vv?.width ?? window.innerWidth),
    height: Math.round(vv?.height ?? window.innerHeight),
  }
}

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
  /** Close unless the app's closeGuard vetoes it (unsaved changes). */
  requestClose: (id: string) => void
  setTitle: (id: string, title: string) => void
  setCloseGuard: (id: string, fn?: () => boolean) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  /** Taskbar-button behaviour: focus, restore, or minimize if focused. */
  toggleTaskbar: (id: string) => void
  toggleMaximize: (id: string) => void
  setBounds: (id: string, r: Rect) => void
  minimizeAll: () => void
  /** Re-fit windows after a viewport resize (maximize stays synced). */
  reflow: () => void
}

function spawnBounds(appId: string, index: number): Rect {
  const app = getApp(appId)
  const sh = shellSize()
  const vw = sh.width
  const vh = sh.height - TASKBAR_HEIGHT
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
    // Phone-sized screens: apps open maximized like mobile apps.
    const sh = shellSize()
    const full = sh.width < 640
    const win: WindowState = {
      id,
      appId,
      launch: opts?.launch,
      title: opts?.title,
      icon: opts?.icon,
      bounds: full
        ? { x: 0, y: 0, width: sh.width, height: sh.height - TASKBAR_HEIGHT }
        : spawnBounds(appId, s.windows.length),
      prevBounds: null,
      z: s.topZ + 1,
      minimized: false,
      maximized: full,
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

  requestClose: (id) => {
    const s = get()
    const w = s.windows.find((x) => x.id === id)
    if (w?.closeGuard && w.closeGuard() === false) return
    s.closeWindow(id)
  },

  setTitle: (id, title) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, title } : w)),
    })),

  setCloseGuard: (id, fn) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, closeGuard: fn } : w,
      ),
    })),

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
            width: shellSize().width,
            height: shellSize().height - TASKBAR_HEIGHT,
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

  reflow: () =>
    set((s) => {
      const sh = shellSize()
      const vw = sh.width
      const vh = sh.height - TASKBAR_HEIGHT
      return {
        windows: s.windows.map((w) => {
          if (w.maximized)
            return { ...w, bounds: { x: 0, y: 0, width: vw, height: vh } }
          const width = Math.min(w.bounds.width, vw)
          const height = Math.min(w.bounds.height, vh)
          return {
            ...w,
            bounds: {
              width,
              height,
              // Keep at least a sliver of the title bar reachable.
              x: Math.max(60 - width, Math.min(vw - 60, w.bounds.x)),
              y: Math.max(0, Math.min(vh - 32, w.bounds.y)),
            },
          }
        }),
      }
    }),
}))
