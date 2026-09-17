import type { PointerEvent as ReactPointerEvent } from 'react'
import { getApp } from '../core/registry'
import { shellSize, useWindowsStore } from '../core/store/windows'
import type { WindowState } from '../core/types'
import { CloseIcon, MaximizeIcon, MinimizeIcon, RestoreIcon } from './icons'

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/**
 * A window: title bar with drag/double-click-maximize, edge+corner
 * resize handles, taskbar-style min/max/close buttons.
 */
export default function WindowFrame({ win }: { win: WindowState }) {
  const app = getApp(win.appId)
  const active = useWindowsStore((s) => s.activeId === win.id)
  const focusWindow = useWindowsStore((s) => s.focusWindow)
  const minimizeWindow = useWindowsStore((s) => s.minimizeWindow)
  const closeWindow = useWindowsStore((s) => s.closeWindow)
  const toggleMaximize = useWindowsStore((s) => s.toggleMaximize)
  const setBounds = useWindowsStore((s) => s.setBounds)
  const min = app.minSize ?? { width: 320, height: 200 }

  const Icon = win.icon ?? app.icon
  const title = win.title ?? app.title
  const AppComponent = app.component

  const onTitlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('[data-winbtn]')) return
    focusWindow(win.id)
    const st = {
      mx: e.clientX,
      my: e.clientY,
      rect: { ...win.bounds },
      prev: win.prevBounds,
      max: win.maximized,
    }
    const onMove = (ev: PointerEvent) => {
      if (st.max) {
        // Dragging a maximized title bar restores the window under the cursor.
        const pb = st.prev ?? { x: 40, y: 40, width: 800, height: 560 }
        const nx = ev.clientX - pb.width / 2
        const ny = Math.max(0, ev.clientY - 16)
        st.max = false
        st.mx = ev.clientX
        st.my = ev.clientY
        st.rect = { ...pb, x: nx, y: ny }
        useWindowsStore.setState((s) => ({
          windows: s.windows.map((w) =>
            w.id === win.id
              ? { ...w, maximized: false, prevBounds: null, bounds: st.rect }
              : w,
          ),
        }))
        return
      }
      const sh = shellSize()
      const nx = clamp(
        st.rect.x + ev.clientX - st.mx,
        80 - st.rect.width,
        sh.width - 60,
      )
      const ny = clamp(
        st.rect.y + ev.clientY - st.my,
        0,
        sh.height - 80,
      )
      setBounds(win.id, { ...st.rect, x: nx, y: ny })
    }
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onMove)
      // Released at the very top edge -> snap to maximized.
      if (ev.clientY <= 0 && !st.max) toggleMaximize(win.id)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp, { once: true })
  }

  const startResize =
    (dir: string) => (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      focusWindow(win.id)
      const s = { mx: e.clientX, my: e.clientY, ...win.bounds }
      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - s.mx
        const dy = ev.clientY - s.my
        let { x, y, width, height } = s
        if (dir.includes('e')) width = s.width + dx
        if (dir.includes('s')) height = s.height + dy
        if (dir.includes('w')) {
          width = s.width - dx
          x = s.x + dx
        }
        if (dir.includes('n')) {
          height = s.height - dy
          y = s.y + dy
        }
        if (width < min.width) {
          if (dir.includes('w')) x += width - min.width
          width = min.width
        }
        if (height < min.height) {
          if (dir.includes('n')) y += height - min.height
          height = min.height
        }
        setBounds(win.id, { x, y, width, height })
      }
      const onUp = () => window.removeEventListener('pointermove', onMove)
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp, { once: true })
    }

  const btn =
    'flex w-[46px] items-center justify-center text-black transition-colors'

  return (
    <div
      className={`absolute flex flex-col bg-white ${
        win.maximized ? '' : 'border border-black/30'
      } ${
        active
          ? 'shadow-[0_12px_50px_rgba(0,0,0,0.5)]'
          : 'shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
      }`}
      style={{
        left: win.bounds.x,
        top: win.bounds.y,
        width: win.bounds.width,
        height: win.bounds.height,
        zIndex: win.z,
        display: win.minimized ? 'none' : undefined,
      }}
      onPointerDown={() => focusWindow(win.id)}
    >
      {/* Title bar */}
      <div
        className={`flex h-8 shrink-0 select-none items-center pl-2 ${
          active ? 'bg-white' : 'bg-[#f0f0f0]'
        }`}
        onPointerDown={onTitlePointerDown}
        onDoubleClick={(e) => {
          if ((e.target as HTMLElement).closest('[data-winbtn]')) return
          toggleMaximize(win.id)
        }}
      >
        <Icon className="mr-2 size-4 shrink-0" />
        <div
          className={`min-w-0 flex-1 truncate text-[12px] ${
            active ? 'text-black' : 'text-[#767676]'
          }`}
        >
          {title}
        </div>
        <div className="flex h-full" data-winbtn>
          <button
            className={`${btn} hover:bg-black/10`}
            onClick={() => minimizeWindow(win.id)}
            aria-label="Minimize"
            tabIndex={-1}
          >
            <MinimizeIcon className="size-[10px]" />
          </button>
          <button
            className={`${btn} hover:bg-black/10`}
            onClick={() => toggleMaximize(win.id)}
            aria-label="Maximize"
            tabIndex={-1}
          >
            {win.maximized ? (
              <RestoreIcon className="size-[10px]" />
            ) : (
              <MaximizeIcon className="size-[10px]" />
            )}
          </button>
          <button
            className={`${btn} hover:bg-[#e81123] hover:text-white`}
            onClick={() => closeWindow(win.id)}
            aria-label="Close"
            tabIndex={-1}
          >
            <CloseIcon className="size-[10px]" />
          </button>
        </div>
      </div>

      {/* App content */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <AppComponent windowId={win.id} launch={win.launch} />
      </div>

      {/* Resize handles */}
      {!win.maximized && (
        <>
          <div onPointerDown={startResize('n')} className="absolute inset-x-2 top-0 h-[6px] cursor-ns-resize" />
          <div onPointerDown={startResize('s')} className="absolute inset-x-2 bottom-0 h-[6px] cursor-ns-resize" />
          <div onPointerDown={startResize('e')} className="absolute inset-y-2 right-0 w-[6px] cursor-ew-resize" />
          <div onPointerDown={startResize('w')} className="absolute inset-y-2 left-0 w-[6px] cursor-ew-resize" />
          <div onPointerDown={startResize('nw')} className="absolute left-0 top-0 size-3 cursor-nwse-resize" />
          <div onPointerDown={startResize('ne')} className="absolute right-0 top-0 size-3 cursor-nesw-resize" />
          <div onPointerDown={startResize('sw')} className="absolute bottom-0 left-0 size-3 cursor-nesw-resize" />
          <div onPointerDown={startResize('se')} className="absolute bottom-0 right-0 size-3 cursor-nwse-resize" />
        </>
      )}
    </div>
  )
}
