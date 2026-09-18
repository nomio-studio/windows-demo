import { useEffect, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useEscape } from '../../core/hooks'
import { useT } from '../../core/i18n'
import type { FsNode } from '../../core/fs/tree'
import { usePwaStore } from '../../core/store/pwa'
import { useSystemStore, type ContextMenuItem } from '../../core/store/system'
import { useWindowsStore } from '../../core/store/windows'
import ActionCenter from '../flyouts/ActionCenter'
import CalendarFlyout from '../flyouts/CalendarFlyout'
import ContextMenu from '../dialogs/ContextMenu'
import DesktopIcons from './DesktopIcons'
import FilePropertiesDialog from '../dialogs/FilePropertiesDialog'
import SearchFlyout from '../flyouts/SearchFlyout'
import StartMenu from '../flyouts/StartMenu'
import Taskbar from './Taskbar'
import TrayFlyouts from '../flyouts/TrayFlyouts'
import UpdateToast from './UpdateToast'
import { useShellMenus } from './useShellMenus'
import Wallpaper from './Wallpaper'
import WindowFrame from '../window/WindowFrame'
import { Presence } from '../ui'

interface MenuState {
  x: number
  y: number
  items: ContextMenuItem[]
}

const TRAY_KINDS = new Set([
  'trayOverflow',
  'volume',
  'network',
  'language',
])

/**
 * The desktop session: wallpaper, icons, windows, taskbar, flyouts,
 * context menus and the brightness veil. Composition only — menu
 * definitions live in useShellMenus.ts.
 */
export default function DesktopShell() {
  const windows = useWindowsStore((s) => s.windows)
  const openApp = useWindowsStore((s) => s.openApp)
  const reflow = useWindowsStore((s) => s.reflow)
  const flyout = useSystemStore((s) => s.flyout)
  const setFlyout = useSystemStore((s) => s.setFlyout)
  const brightness = useSystemStore((s) => s.brightness)
  const nightlight = useSystemStore((s) => s.quickActions.nightlight)
  const pendingFile = usePwaStore((s) => s.pendingFile)
  const setPendingFile = usePwaStore((s) => s.setPendingFile)
  const [menu, setMenu] = useState<MenuState | null>(null)
  const [propsNode, setPropsNode] = useState<{
    node: FsNode
    uiPath: string[]
  } | null>(null)
  const t = useT()
  const { desktopMenu, iconMenu, taskbarMenu, winxMenu } =
    useShellMenus(setPropsNode)

  const openMenu = (e: ReactMouseEvent, items: ContextMenuItem[]) => {
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY, items })
  }

  useEscape(() => {
    setMenu(null)
    setFlyout(null)
  })

  // Keep windows fitted to the viewport on resize/rotation/zoom.
  useEffect(() => {
    window.addEventListener('resize', reflow)
    window.visualViewport?.addEventListener('resize', reflow)
    return () => {
      window.removeEventListener('resize', reflow)
      window.visualViewport?.removeEventListener('resize', reflow)
    }
  }, [reflow])

  // App shortcut deep links (`?app=<id>` from manifest shortcuts).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const appId = params.get('app')
    if (appId) {
      try {
        openApp(appId)
      } catch {
        // Unknown app id — land on a plain desktop.
      }
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [openApp])

  // Files delivered by the OS "Open with" handler open in Notepad.
  useEffect(() => {
    if (!pendingFile) return
    setPendingFile(null)
    pendingFile
      .read()
      .then((text) =>
        openApp('notepad', {
          launch: { name: pendingFile.name, text },
          title: t('app.notepadFile', { name: pendingFile.name }),
        }),
      )
      .catch(() => {})
  }, [pendingFile, openApp, setPendingFile, t])

  return (
    <div id="shell" className="anim-fade relative h-full w-full overflow-hidden">
      <Wallpaper />
      <DesktopIcons
        onMenu={(e, entry, actions) =>
          openMenu(e, entry ? iconMenu(entry, actions) : desktopMenu())
        }
      />

      {windows.map((w) => (
        <WindowFrame key={w.id} win={w} />
      ))}

      {/* Flyouts — Presence keeps the last one mounted for its outro. */}
      <Presence value={flyout}>
        {(kind, exiting) => (
          <>
            {kind === 'start' && <StartMenu exiting={exiting} />}
            {kind === 'search' && <SearchFlyout exiting={exiting} />}
            {kind === 'calendar' && <CalendarFlyout exiting={exiting} />}
            {kind === 'actionCenter' && <ActionCenter exiting={exiting} />}
            {TRAY_KINDS.has(kind) && (
              <TrayFlyouts kind={kind} exiting={exiting} />
            )}
          </>
        )}
      </Presence>

      {/* Click-away layer while a flyout is open */}
      {flyout && (
        <div
          className="fixed inset-0 z-[50000]"
          onPointerDown={() => setFlyout(null)}
          onContextMenu={(e) => {
            e.preventDefault()
            setFlyout(null)
          }}
        />
      )}

      <Taskbar
        onMenu={(e, kind) => openMenu(e, kind === 'winx' ? winxMenu() : taskbarMenu())}
      />

      <Presence value={menu} ms={110}>
        {(m, exiting) => (
          <ContextMenu
            x={m.x}
            y={m.y}
            items={m.items}
            exiting={exiting}
            onClose={() => setMenu(null)}
          />
        )}
      </Presence>

      {propsNode && (
        <FilePropertiesDialog
          node={propsNode.node}
          uiPath={propsNode.uiPath}
          onClose={() => setPropsNode(null)}
        />
      )}

      <UpdateToast />

      {/* Night-light veil — a warm wash under the brightness dimmer. */}
      {nightlight && (
        <div className="pointer-events-none fixed inset-0 z-[80000] bg-[#ff9d45] opacity-[0.13]" />
      )}

      {/* Brightness veil */}
      <div
        className="pointer-events-none fixed inset-0 z-[80000] bg-black transition-opacity duration-200"
        style={{ opacity: ((100 - brightness) / 100) * 0.55 }}
      />
    </div>
  )
}
