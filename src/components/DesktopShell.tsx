import { useEffect, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useEscape } from '../core/hooks'
import { useT } from '../core/i18n'
import { usePwaStore } from '../core/store/pwa'
import {
  useSystemStore,
  type ContextMenuItem,
  type IconSize,
} from '../core/store/system'
import { useWindowsStore } from '../core/store/windows'
import type { DesktopIconEntry } from '../config/shell'
import ActionCenter from './ActionCenter'
import CalendarFlyout from './CalendarFlyout'
import ContextMenu from './ContextMenu'
import DesktopIcons from './DesktopIcons'
import SearchFlyout from './SearchFlyout'
import StartMenu from './StartMenu'
import Taskbar from './Taskbar'
import TrayFlyouts from './TrayFlyouts'
import UpdateToast from './UpdateToast'
import Wallpaper from './Wallpaper'
import WindowFrame from './WindowFrame'

interface MenuState {
  x: number
  y: number
  items: ContextMenuItem[]
}

/**
 * The desktop session: wallpaper, icons, windows, taskbar, flyouts,
 * context menus and the brightness veil.
 */
export default function DesktopShell() {
  const windows = useWindowsStore((s) => s.windows)
  const openApp = useWindowsStore((s) => s.openApp)
  const minimizeAll = useWindowsStore((s) => s.minimizeAll)
  const reflow = useWindowsStore((s) => s.reflow)
  const flyout = useSystemStore((s) => s.flyout)
  const setFlyout = useSystemStore((s) => s.setFlyout)
  const setPhase = useSystemStore((s) => s.setPhase)
  const iconSize = useSystemStore((s) => s.desktopIconSize)
  const setIconSize = useSystemStore((s) => s.setDesktopIconSize)
  const brightness = useSystemStore((s) => s.brightness)
  const pendingFile = usePwaStore((s) => s.pendingFile)
  const setPendingFile = usePwaStore((s) => s.setPendingFile)
  const [menu, setMenu] = useState<MenuState | null>(null)
  const t = useT()

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

  const openSettings = (page: string) =>
    openApp('settings', { launch: { page } })

  const desktopMenu = (): ContextMenuItem[] => [
    {
      label: t('menu.view'),
      submenu: (['large', 'medium', 'small'] as IconSize[]).map((s) => ({
        label: t(`menu.icons.${s}`),
        checked: iconSize === s,
        onClick: () => setIconSize(s),
      })),
    },
    {
      label: t('menu.sortBy'),
      submenu: (['name', 'size', 'type', 'date'] as const).map((k, i) => ({
        label: t(`menu.sort.${k}`),
        checked: i === 0,
      })),
    },
    { label: t('menu.refresh') },
    { type: 'separator' },
    { label: t('menu.paste'), disabled: true },
    { label: t('menu.pasteShortcut'), disabled: true },
    { type: 'separator' },
    { label: t('menu.displaySettings'), onClick: () => openSettings('system') },
    { label: t('menu.personalize'), onClick: () => openSettings('personalization') },
  ]

  const iconMenu = (entry: DesktopIconEntry): ContextMenuItem[] => [
    {
      label: t('menu.open'),
      onClick: () => openApp(entry.appId, { launch: entry.launch, title: entry.title }),
    },
    { type: 'separator' },
    { label: t('menu.pinStart') },
    { label: t('menu.pinTaskbar') },
    { type: 'separator' },
    { label: t('menu.properties') },
  ]

  const taskbarMenu = (): ContextMenuItem[] => [
    {
      label: t('menu.toolbars'),
      submenu: (['address', 'links', 'desktop'] as const).map((k) => ({
        label: t(`menu.toolbar.${k}`),
      })),
    },
    {
      label: t('menu.search'),
      submenu: [
        { label: t('menu.search.hidden') },
        { label: t('menu.search.icon') },
        { label: t('menu.search.box'), checked: true },
      ],
    },
    { type: 'separator' },
    {
      label: t('app.taskmgr'),
      onClick: () => openApp('modern', { title: 'app.taskmgr' }),
    },
    { type: 'separator' },
    { label: t('menu.lockTaskbar'), checked: true },
    { label: t('menu.taskbarSettings'), onClick: () => openSettings('personalization') },
  ]

  const winxMenu = (): ContextMenuItem[] => [
    { label: t('winx.programs') },
    { label: t('winx.powerOptions') },
    { type: 'separator' },
    { label: t('winx.system'), onClick: () => openSettings('system') },
    { label: t('winx.deviceManager') },
    { label: t('winx.netConnections') },
    { label: t('winx.diskMgmt') },
    { type: 'separator' },
    { label: t('app.taskmgr'), onClick: () => openApp('modern', { title: 'app.taskmgr' }) },
    { label: t('app.settings'), onClick: () => openApp('settings') },
    { type: 'separator' },
    { label: t('app.explorer'), onClick: () => openApp('explorer') },
    { label: t('menu.search'), onClick: () => setFlyout('search') },
    { label: t('winx.run') },
    { type: 'separator' },
    {
      label: t('winx.shutdown'),
      submenu: [
        { label: t('power.signout'), onClick: () => setPhase('lock') },
        { label: t('power.sleep'), onClick: () => setPhase('lock') },
        { label: t('power.shutdown'), onClick: () => setPhase('shutdown') },
        { label: t('power.restart'), onClick: () => setPhase('restart') },
      ],
    },
    { label: t('menu.toolbar.desktop'), onClick: minimizeAll },
  ]

  return (
    <div id="shell" className="anim-fade relative h-full w-full overflow-hidden">
      <Wallpaper />
      <DesktopIcons
        onMenu={(e, entry) => openMenu(e, entry ? iconMenu(entry) : desktopMenu())}
      />

      {windows.map((w) => (
        <WindowFrame key={w.id} win={w} />
      ))}

      {/* Flyouts */}
      {flyout === 'start' && <StartMenu />}
      {flyout === 'search' && <SearchFlyout />}
      {flyout === 'calendar' && <CalendarFlyout />}
      {flyout === 'actionCenter' && <ActionCenter />}
      <TrayFlyouts />
      <UpdateToast />

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

      {menu && (
        <ContextMenu x={menu.x} y={menu.y} items={menu.items} onClose={() => setMenu(null)} />
      )}

      {/* Brightness veil */}
      <div
        className="pointer-events-none fixed inset-0 z-[80000] bg-black transition-opacity duration-200"
        style={{ opacity: ((100 - brightness) / 100) * 0.55 }}
      />
    </div>
  )
}
