import { useEffect, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useEscape } from '../core/hooks'
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
          title: `${pendingFile.name} - Notepad`,
        }),
      )
      .catch(() => {})
  }, [pendingFile, openApp, setPendingFile])

  const openSettings = (page: string) =>
    openApp('settings', { launch: { page } })

  const desktopMenu = (): ContextMenuItem[] => [
    {
      label: 'View',
      submenu: (['large', 'medium', 'small'] as IconSize[]).map((s) => ({
        label: `${s[0].toUpperCase()}${s.slice(1)} icons`,
        checked: iconSize === s,
        onClick: () => setIconSize(s),
      })),
    },
    {
      label: 'Sort by',
      submenu: ['Name', 'Size', 'Item type', 'Date modified'].map((l, i) => ({
        label: l,
        checked: i === 0,
      })),
    },
    { label: 'Refresh' },
    { type: 'separator' },
    { label: 'Paste', disabled: true },
    { label: 'Paste shortcut', disabled: true },
    { type: 'separator' },
    { label: 'Display settings', onClick: () => openSettings('system') },
    { label: 'Personalize', onClick: () => openSettings('personalization') },
  ]

  const iconMenu = (entry: DesktopIconEntry): ContextMenuItem[] => [
    {
      label: 'Open',
      onClick: () => openApp(entry.appId, { launch: entry.launch, title: entry.title }),
    },
    { type: 'separator' },
    { label: 'Pin to Start' },
    { label: 'Pin to taskbar' },
    { type: 'separator' },
    { label: 'Properties' },
  ]

  const taskbarMenu = (): ContextMenuItem[] => [
    {
      label: 'Toolbars',
      submenu: ['Address', 'Links', 'Desktop'].map((l) => ({ label: l })),
    },
    {
      label: 'Search',
      submenu: [
        { label: 'Hidden' },
        { label: 'Show search icon' },
        { label: 'Show search box', checked: true },
      ],
    },
    { type: 'separator' },
    {
      label: 'Task Manager',
      onClick: () => openApp('modern', { title: 'Task Manager' }),
    },
    { type: 'separator' },
    { label: 'Lock the taskbar', checked: true },
    { label: 'Taskbar settings', onClick: () => openSettings('personalization') },
  ]

  const winxMenu = (): ContextMenuItem[] => [
    { label: 'Programs and Features' },
    { label: 'Power Options' },
    { type: 'separator' },
    { label: 'System', onClick: () => openSettings('system') },
    { label: 'Device Manager' },
    { label: 'Network Connections' },
    { label: 'Disk Management' },
    { type: 'separator' },
    { label: 'Task Manager', onClick: () => openApp('modern', { title: 'Task Manager' }) },
    { label: 'Settings', onClick: () => openApp('settings') },
    { type: 'separator' },
    { label: 'File Explorer', onClick: () => openApp('explorer') },
    { label: 'Search', onClick: () => setFlyout('search') },
    { label: 'Run' },
    { type: 'separator' },
    {
      label: 'Shut down or sign out',
      submenu: [
        { label: 'Sign out', onClick: () => setPhase('lock') },
        { label: 'Sleep', onClick: () => setPhase('lock') },
        { label: 'Shut down', onClick: () => setPhase('shutdown') },
        { label: 'Restart', onClick: () => setPhase('restart') },
      ],
    },
    { label: 'Desktop', onClick: minimizeAll },
  ]

  return (
    <div id="shell" className="relative h-full w-full overflow-hidden">
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
      {brightness < 100 && (
        <div
          className="pointer-events-none fixed inset-0 z-[80000] bg-black"
          style={{ opacity: ((100 - brightness) / 100) * 0.55 }}
        />
      )}
    </div>
  )
}
