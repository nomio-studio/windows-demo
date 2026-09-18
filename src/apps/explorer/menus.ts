import type { FsNode } from '../../core/fs/tree'
import type { ContextMenuItem } from '../../core/store/system'
import {
  CopyIcon,
  CutIcon,
  DeleteIcon,
  InfoIcon,
  NewFileIcon,
  NewFolderIcon,
  PasteIcon,
  PinIcon,
  PinOffIcon,
  RefreshIcon,
  RenameIcon,
  UndoIcon,
} from '../../components/icons'
import type { ExplorerState } from './useExplorer'
import type { SortKey, ViewMode } from './types'

/* Context-menu and ribbon definitions, built from the ExplorerState. */

export function itemMenu(ex: ExplorerState, n: FsNode): ContextMenuItem[] {
  const { t, fs, path, clipboard, setSel, setDialog, setRenaming, open } = ex
  const p = [...path, n.name]
  if (n.bin)
    return [
      { label: t('exp.ctx.restore'), icon: UndoIcon, onClick: () => fs.restoreBin(n) },
      {
        label: t('exp.ctx.deleteForever'),
        icon: DeleteIcon,
        onClick: () => fs.deleteForever(n),
      },
      { type: 'separator' },
      { label: t('exp.ctx.properties'), icon: InfoIcon, onClick: () => setDialog({ kind: 'props', node: n }) },
    ]
  const canStore = !!n.fsPath
  const nPinned =
    n.fsPath && ex.pins?.some((p) => p.join('/') === n.fsPath!.join('/'))
  const items: ContextMenuItem[] = [
    { label: t('exp.ctx.open'), onClick: () => open(n) },
    { type: 'separator' },
    { label: t('exp.ctx.cut'), icon: CutIcon, shortcut: 'Ctrl+X', disabled: !canStore, onClick: () => fs.copyPaths([p], true) },
    { label: t('exp.ctx.copy'), icon: CopyIcon, shortcut: 'Ctrl+C', disabled: !canStore, onClick: () => fs.copyPaths([p], false) },
    {
      label: t('exp.ctx.paste'),
      icon: PasteIcon,
      shortcut: 'Ctrl+V',
      disabled: !clipboard || n.kind === 'file' || !canStore,
      onClick: () => fs.paste(p),
    },
    { type: 'separator' },
  ]
  if (n.kind !== 'file' && canStore && !nPinned)
    items.push({ label: t('exp.pinToQA'), icon: PinIcon, onClick: () => fs.pin(p) })
  else if (n.kind !== 'file' && nPinned)
    items.push({ label: t('exp.unpinQA'), icon: PinOffIcon, onClick: () => fs.unpin(n.fsPath!) })
  items.push(
    { label: t('exp.ctx.delete'), icon: DeleteIcon, disabled: !canStore, onClick: () => { setSel(null); fs.remove(p) } },
    { label: t('exp.ctx.rename'), icon: RenameIcon, disabled: !canStore, onClick: () => setRenaming(n.name) },
    { type: 'separator' },
    { label: t('exp.ctx.properties'), icon: InfoIcon, onClick: () => setDialog({ kind: 'props', node: n }) },
  )
  return items
}

export function bgMenu(ex: ExplorerState): ContextMenuItem[] {
  const { t, fs, path, clipboard, inBin, writable, view, setView, sortKey, setSortKey, setDialog, node, restoreAll } = ex
  if (inBin)
    return [
      { label: t('exp.bin.restoreAll'), icon: UndoIcon, onClick: restoreAll },
      { label: t('exp.bin.empty'), icon: DeleteIcon, onClick: () => fs.emptyBin() },
      { type: 'separator' },
      { label: t('exp.ctx.refresh'), icon: RefreshIcon, onClick: () => fs.refresh() },
    ]
  const items: ContextMenuItem[] = [
    {
      label: t('menu.view'),
      submenu: (['details', 'icons'] as ViewMode[]).map((v) => ({
        label: t(v === 'details' ? 'exp.view.details' : 'exp.view.icons'),
        checked: view === v,
        onClick: () => setView(v),
      })),
    },
    {
      label: t('menu.sortBy'),
      submenu: (['name', 'modified', 'type', 'size'] as SortKey[]).map((k) => ({
        label: t(`exp.col.${k}`),
        checked: sortKey === k,
        onClick: () => setSortKey(k),
      })),
    },
    { label: t('exp.ctx.refresh'), icon: RefreshIcon, onClick: () => fs.refresh() },
    { type: 'separator' },
    {
      label: t('exp.ctx.paste'),
      icon: PasteIcon,
      shortcut: 'Ctrl+V',
      disabled: !clipboard || !writable,
      onClick: () => fs.paste(path),
    },
    { type: 'separator' },
    {
      label: t('exp.ctx.new'),
      submenu: [
        {
          label: t('exp.new.folder'),
          icon: NewFolderIcon,
          onClick: () => fs.createFolder(path, t('fs.newFolder')),
        },
        {
          label: t('exp.new.text'),
          icon: NewFileIcon,
          onClick: () => fs.createFile(path, t('fs.newTextDoc')),
        },
      ],
    },
    { type: 'separator' },
    { label: t('exp.ctx.properties'), icon: InfoIcon, onClick: () => setDialog({ kind: 'props', node }) },
  ]
  if (!writable) {
    // Creating directly under a virtual node isn't possible.
    items[6].disabled = true
  }
  return items
}

/* Ribbon — contextual between Home and Recycle-Bin tools. */
export function ribbonItems(
  ex: ExplorerState,
): [string, boolean, () => void][] {
  const { fs, t, path, clipboard, inBin, writable, items, selNode, selPinned, setDialog, setSel, startRename, restoreAll, copyPath } = ex
  return inBin
    ? [
        ['exp.bin.empty', items.length === 0, () => fs.emptyBin()],
        ['exp.bin.restoreAll', items.length === 0, restoreAll],
        [
          'exp.ctx.restore',
          !selNode,
          () => selNode && fs.restoreBin(selNode),
        ],
        ['exp.ctx.properties', !selNode, () => selNode && setDialog({ kind: 'props', node: selNode })],
      ]
    : [
        ['exp.rib.pin', !selNode || selNode.kind === 'file' || !!selPinned, () => selNode && fs.pin([...path, selNode.name])],
        ['exp.rib.copy', !selNode, () => selNode && fs.copyPaths([[...path, selNode.name]], false)],
        ['exp.rib.paste', !clipboard || !writable, () => fs.paste(path)],
        ['exp.rib.moveto', !selNode, () => selNode && setDialog({ kind: 'move', node: selNode })],
        ['exp.rib.copypath', !selNode, () => selNode && copyPath(selNode)],
        ['exp.rib.delete', !selNode, () => { if (selNode) { fs.remove([...path, selNode.name]); setSel(null) } }],
        ['exp.rib.rename', !selNode, startRename],
        ['exp.rib.newfolder', !writable, () => fs.createFolder(path, t('fs.newFolder'))],
        ['exp.rib.properties', !selNode, () => selNode && setDialog({ kind: 'props', node: selNode })],
      ]
}
