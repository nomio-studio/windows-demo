import { useRef, useState } from 'react'
import { useT } from '../../core/i18n'
import { getApp } from '../../core/registry'
import { useWindowsStore } from '../../core/store/windows'
import type { WindowState } from '../../core/types'
import { CloseIcon, MaximizeIcon, MinimizeIcon, RestoreIcon } from '../icons'
import { useWindowGestures } from './gestures'
import { animateClose, useWindowAnims } from './motion'

/**
 * A window: title bar with drag/double-click-maximize, edge+corner
 * resize handles, taskbar-style min/max/close buttons. Gestures live
 * in gestures.ts; animations in motion.ts.
 */
export default function WindowFrame({ win }: { win: WindowState }) {
  const app = getApp(win.appId)
  const active = useWindowsStore((s) => s.activeId === win.id)
  const focusWindow = useWindowsStore((s) => s.focusWindow)
  const minimizeWindow = useWindowsStore((s) => s.minimizeWindow)
  const requestClose = useWindowsStore((s) => s.requestClose)
  const toggleMaximize = useWindowsStore((s) => s.toggleMaximize)
  const t = useT()
  const min = app.minSize ?? { width: 320, height: 200 }
  const rootRef = useRef<HTMLDivElement>(null)
  // Stays visible until the minimize-outro finishes, then display:none.
  const [hidden, setHidden] = useState(win.minimized)
  const [closing, setClosing] = useState(false)

  const Icon = win.icon ?? app.icon
  const title = t(win.title ?? app.title)
  const AppComponent = app.component

  useWindowAnims(win, rootRef, setHidden)
  const { onTitlePointerDown, startResize } = useWindowGestures(win, min)

  // Windows closes with a quick shrink-fade before unmounting — unless
  // the app's closeGuard vetoes it (e.g. unsaved changes).
  const handleClose = () => {
    if (closing) return
    if (win.closeGuard && win.closeGuard() === false) return
    setClosing(true)
    animateClose(rootRef.current, () => requestClose(win.id))
  }

  const btn =
    'flex w-[46px] items-center justify-center text-black transition-colors'

  return (
    <div
      ref={rootRef}
      className={`anim-win-open absolute flex flex-col bg-white transition-shadow duration-150 ${
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
        display: hidden ? 'none' : undefined,
      }}
      onPointerDown={() => focusWindow(win.id)}
    >
      {/* Title bar */}
      <div
        className={`flex h-8 shrink-0 select-none items-center pl-2 transition-colors duration-150 ${
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
            aria-label={t('aria.minimize')}
            tabIndex={-1}
          >
            <MinimizeIcon className="size-[10px]" />
          </button>
          <button
            className={`${btn} hover:bg-black/10`}
            onClick={() => toggleMaximize(win.id)}
            aria-label={t('aria.maximize')}
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
            onClick={handleClose}
            aria-label={t('aria.close')}
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
