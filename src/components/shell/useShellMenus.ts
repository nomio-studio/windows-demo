import { useT } from '../../core/i18n'
import { useFsStore } from '../../core/fs/store'
import { DESKTOP_UI, TEXT_EXTS, extOf, type FsNode } from '../../core/fs/tree'
import {
  useSystemStore,
  type ContextMenuItem,
  type IconSize,
} from '../../core/store/system'
import { useWindowsStore } from '../../core/store/windows'
import type { DesktopIconEntry } from '../../config/shell'
import type { IconActions } from './DesktopIcons'

/* Context-menu builders for the desktop chrome — desktop background,
 * icons, taskbar and the Win+X power menu. Returned from a hook so the
 * builders close over `t()` and the stores without prop drilling. */

export function useShellMenus(
  onProps: (p: { node: FsNode; uiPath: string[] }) => void,
) {
  const t = useT()
  const fs = useFsStore()
  const binCount = useFsStore(
    (s) => s.roots['Recycle Bin']?.children?.length ?? 0,
  )
  const openApp = useWindowsStore((s) => s.openApp)
  const minimizeAll = useWindowsStore((s) => s.minimizeAll)
  const setPhase = useSystemStore((s) => s.setPhase)
  const setFlyout = useSystemStore((s) => s.setFlyout)
  const iconSize = useSystemStore((s) => s.desktopIconSize)
  const setIconSize = useSystemStore((s) => s.setDesktopIconSize)

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
    { label: t('menu.refresh'), onClick: () => fs.refresh() },
    { type: 'separator' },
    {
      label: t('exp.ctx.paste'),
      disabled: !fs.clipboard,
      onClick: () => fs.paste(DESKTOP_UI),
    },
    { label: t('menu.pasteShortcut'), disabled: true },
    { type: 'separator' },
    {
      label: t('exp.ctx.new'),
      submenu: [
        {
          label: t('exp.new.folder'),
          onClick: () => fs.createFolder(DESKTOP_UI, t('fs.newFolder')),
        },
        {
          label: t('exp.new.text'),
          onClick: () => fs.createFile(DESKTOP_UI, t('fs.newTextDoc')),
        },
      ],
    },
    { type: 'separator' },
    { label: t('menu.displaySettings'), onClick: () => openSettings('system') },
    { label: t('menu.personalize'), onClick: () => openSettings('personalization') },
  ]

  const iconMenu = (
    entry: DesktopIconEntry,
    actions: IconActions,
  ): ContextMenuItem[] => {
    // Real file/folder icons get filesystem operations.
    if (entry.fs) {
      const n = entry.fs
      const p = [...DESKTOP_UI, n.name]
      const openable = n.kind !== 'file' || TEXT_EXTS.has(extOf(n.name))
      return [
        {
          label: t('menu.open'),
          onClick: () =>
            openApp(entry.appId, { launch: entry.launch, title: entry.title }),
          disabled: !openable,
        },
        { type: 'separator' },
        {
          label: t('exp.ctx.cut'),
          onClick: () => fs.copyPaths([p], true),
        },
        {
          label: t('exp.ctx.copy'),
          onClick: () => fs.copyPaths([p], false),
        },
        { type: 'separator' },
        { label: t('exp.ctx.delete'), onClick: () => fs.remove(p) },
        {
          label: t('exp.ctx.rename'),
          onClick: () => actions.startRename(entry.id),
        },
        { type: 'separator' },
        {
          label: t('exp.ctx.properties'),
          onClick: () => onProps({ node: n, uiPath: DESKTOP_UI }),
        },
      ]
    }
    const items: ContextMenuItem[] = [
      {
        label: t('menu.open'),
        onClick: () =>
          openApp(entry.appId, { launch: entry.launch, title: entry.title }),
      },
      { type: 'separator' },
      { label: t('menu.pinStart') },
      { label: t('menu.pinTaskbar') },
      { type: 'separator' },
    ]
    if (entry.id === 'bin')
      items.push({
        label: t('exp.bin.empty'),
        disabled: binCount === 0,
        onClick: () => fs.emptyBin(),
      })
    items.push({ label: t('menu.properties') })
    return items
  }

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
      onClick: () => openApp('taskmgr'),
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
    { label: t('app.taskmgr'), onClick: () => openApp('taskmgr') },
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

  return { desktopMenu, iconMenu, taskbarMenu, winxMenu }
}
