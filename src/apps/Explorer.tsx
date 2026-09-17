import { useMemo, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { formatDateTime } from '../core/hooks'
import { useLocale, useT } from '../core/i18n'
import { useFsStore } from '../core/fs/store'
import {
  TEXT_EXTS,
  extOf,
  formatSize,
  navEntries,
  resolve,
  resolveChain,
  type FsNode,
} from '../core/fs/tree'
import { useWindowsStore } from '../core/store/windows'
import type { ContextMenuItem } from '../core/store/system'
import type { AppProps } from '../core/types'
import ContextMenu from '../components/ContextMenu'
import FileDialog from '../components/FileDialog'
import FilePropertiesDialog from '../components/FilePropertiesDialog'
import {
  BackIcon,
  ChevronRight,
  CopyIcon,
  CutIcon,
  DeleteIcon,
  DetailsIcon,
  FileIcon,
  FolderIcon,
  ForwardIcon,
  GridIcon,
  InfoIcon,
  NewFileIcon,
  NewFolderIcon,
  PasteIcon,
  PinIcon,
  PinOffIcon,
  RecycleBinIcon,
  RefreshIcon,
  RenameIcon,
  SearchIcon,
  StarIcon,
  UndoIcon,
  UpIcon,
} from '../components/icons'

type SortKey = 'name' | 'modified' | 'type' | 'size'
type ViewMode = 'details' | 'icons'

interface MenuState {
  x: number
  y: number
  items: ContextMenuItem[]
}

type Dialog =
  | { kind: 'props'; node: FsNode }
  | { kind: 'move'; node: FsNode }
  | null

/** Files app: nav pane, ribbon, breadcrumb, sortable view, Recycle Bin. */
export default function ExplorerApp({ launch }: AppProps) {
  const initial = (launch as { path?: string[] } | undefined)?.path ?? [
    'Quick access',
  ]
  const [hist, setHist] = useState<string[][]>([initial])
  const [hi, setHi] = useState(0)
  const [sel, setSel] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortAsc, setSortAsc] = useState(true)
  const [view, setView] = useState<ViewMode>('details')
  const [menu, setMenu] = useState<MenuState | null>(null)
  const [dialog, setDialog] = useState<Dialog>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const t = useT()
  const locale = useLocale()

  const roots = useFsStore((s) => s.roots)
  const ready = useFsStore((s) => s.ready)
  const clipboard = useFsStore((s) => s.clipboard)
  const pins = useFsStore((s) => s.pins)
  const fs = useFsStore()
  const openApp = useWindowsStore((s) => s.openApp)

  const path = hist[hi]
  const node = resolve(roots, path)
  const chain = resolveChain(roots, path)
  const inBin = path[0] === 'Recycle Bin'
  const writable = !inBin && !!node.fsPath

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    const kids = (node.children ?? []).filter((n) =>
      n.name.toLowerCase().includes(q),
    )
    const val = (n: FsNode): string | number => {
      if (sortKey === 'name') return n.name.toLowerCase()
      if (sortKey === 'modified') return n.modified?.getTime() ?? 0
      if (sortKey === 'size') return n.sizeBytes
      return t(n.type)
    }
    const dirs = kids.filter((n) => n.kind !== 'file')
    const files = kids.filter((n) => n.kind === 'file')
    const cmp = (a: FsNode, b: FsNode) => {
      const va = val(a)
      const vb = val(b)
      const c =
        typeof va === 'number' && typeof vb === 'number'
          ? va - vb
          : String(va).localeCompare(String(vb), locale)
      return sortAsc ? c : -c
    }
    return [...dirs.sort(cmp), ...files.sort(cmp)]
  }, [node, query, sortKey, sortAsc, locale, t])

  const selNode = items.find((n) => n.name === sel) ?? null
  const selPinned =
    selNode?.fsPath && pins.some((p) => p.join('/') === selNode.fsPath!.join('/'))

  const navigate = (p: string[]) => {
    const nh = [...hist.slice(0, hi + 1), p]
    setHist(nh)
    setHi(nh.length - 1)
    setSel(null)
    setRenaming(null)
  }
  const back = () => hi > 0 && setHi(hi - 1)
  const fwd = () => hi < hist.length - 1 && setHi(hi + 1)
  const up = () => path.length > 1 && navigate(path.slice(0, -1))

  const open = (n: FsNode) => {
    if (n.bin) return // bin entries: restore via context menu
    if (n.kind === 'file') {
      if (TEXT_EXTS.has(extOf(n.name)))
        openApp('notepad', {
          launch: { path: [...path, n.name] },
          title: t('app.notepadFile', { name: n.name }),
        })
      return
    }
    navigate([...path, n.name])
  }

  const setSort = (k: SortKey) => {
    if (sortKey === k) setSortAsc((v) => !v)
    else {
      setSortKey(k)
      setSortAsc(true)
    }
  }

  const startRename = () => selNode && setRenaming(selNode.name)

  const commitRename = async (old: string, next: string) => {
    setRenaming(null)
    const name = next.trim()
    if (!name || name === old) return
    await fs.rename([...path, old], name)
  }

  const openMenu = (e: ReactMouseEvent, items: ContextMenuItem[]) => {
    e.preventDefault()
    e.stopPropagation()
    setMenu({ x: e.clientX, y: e.clientY, items })
  }

  const itemMenu = (n: FsNode): ContextMenuItem[] => {
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
      n.fsPath && pins.some((p) => p.join('/') === n.fsPath!.join('/'))
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

  const restoreAll = () => {
    for (const n of node.children ?? []) if (n.bin) fs.restoreBin(n)
  }

  const bgMenu = (): ContextMenuItem[] => {
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
          label: t(`exp.col.${k === 'modified' ? 'modified' : k}`),
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

  const copyPath = (n: FsNode) => {
    const fsPath = n.fsPath
    const text = fsPath ? `C:\\${fsPath.join('\\')}` : [...path, n.name].join(' > ')
    navigator.clipboard?.writeText(text).catch(() => {})
  }

  /* Ribbon — contextual between Home and Recycle-Bin tools. */
  const ribbon: [string, boolean, () => void][] = inBin
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

  const navBtn = 'flex h-6 w-7 items-center justify-center text-[#333] hover:bg-[#e0e0e0] disabled:text-[#b8b8b8] disabled:hover:bg-transparent'
  const nameOf = (n: FsNode) => t(n.labelKey ?? n.name)
  const colHeader = (key: SortKey, label: string, cls = '') => (
    <th
      className={`cursor-pointer select-none border-b border-l border-[#dcdcdc] px-2 py-0.5 font-normal hover:bg-[#e5f3ff] ${cls}`}
      onClick={() => setSort(key)}
    >
      {label}
      {sortKey === key && (
        <span className="ml-1 text-[9px]">{sortAsc ? '▲' : '▼'}</span>
      )}
    </th>
  )

  return (
    <div className="relative flex h-full flex-col bg-white text-black">
      {/* Ribbon */}
      <div className="shrink-0 border-b border-[#dcdcdc]">
        <div className="flex items-center text-[12px]">
          <span className="bg-[#0078d7] px-3 py-1 text-white">{t('exp.tab.file')}</span>
          {(inBin ? ['exp.tab.bin'] : ['exp.tab.home', 'exp.tab.share', 'exp.tab.view']).map((k, i) => (
            <span
              key={k}
              className={`px-3 py-1 ${i === 0 ? 'border-b-2 border-[#0078d7] text-[#0078d7]' : 'text-[#444]'}`}
            >
              {t(k)}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 overflow-x-auto px-2 py-1">
          {ribbon.map(([label, disabled, fn]) => (
            <button
              key={label}
              disabled={disabled}
              className="whitespace-nowrap px-2 py-0.5 text-[11.5px] text-[#333] hover:bg-[#e5f3ff] disabled:text-[#aaa] disabled:hover:bg-transparent"
              onClick={fn}
            >
              {t(label)}
            </button>
          ))}
        </div>
      </div>

      {/* Address bar */}
      <div className="flex shrink-0 items-center gap-0.5 border-b border-[#e4e4e4] px-1.5 py-1">
        <button className={navBtn} onClick={back} disabled={hi === 0} aria-label={t('aria.back')}>
          <BackIcon className="size-3.5" />
        </button>
        <button className={navBtn} onClick={fwd} disabled={hi >= hist.length - 1} aria-label={t('aria.forward')}>
          <ForwardIcon className="size-3.5" />
        </button>
        <button className={navBtn} onClick={up} disabled={path.length <= 1} aria-label={t('aria.up')}>
          <UpIcon className="size-3.5" />
        </button>
        <button className={navBtn} onClick={() => fs.refresh()} aria-label={t('aria.refresh')}>
          <RefreshIcon className="size-3.5" />
        </button>
        <div className="mx-1 flex h-6 min-w-0 flex-1 items-center gap-0.5 overflow-hidden border border-[#cfcfcf] px-1.5">
          {path.map((seg, i) => (
            <span key={i} className="flex shrink-0 items-center">
              {i > 0 && <ChevronRight className="mx-0.5 size-2.5 text-[#999]" />}
              <button
                className="truncate px-1 text-[12px] hover:bg-[#e5f3ff]"
                onClick={() => navigate(path.slice(0, i + 1))}
              >
                {chain[i] ? nameOf(chain[i]) : seg}
              </button>
            </span>
          ))}
        </div>
        <div className="flex h-6 w-40 shrink-0 items-center gap-1.5 border border-[#cfcfcf] px-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('exp.searchIn', { name: nameOf(node) })}
            className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#888]"
          />
          <SearchIcon className="size-3.5 shrink-0 text-[#777]" />
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Navigation pane */}
        <div className="w-36 shrink-0 overflow-y-auto border-r border-[#e8e8e8] py-1">
          {navEntries.map((n) => {
            const active = path.join('/') === n.path.join('/')
            return (
              <button
                key={n.labelKey}
                className={`flex w-full items-center gap-1.5 py-[3px] text-left text-[12px] ${
                  n.indent ? 'pl-6' : 'pl-2'
                } ${active ? 'bg-[#cce8ff]' : 'hover:bg-[#e5f3ff]'}`}
                onClick={() => navigate(n.path)}
              >
                {n.labelKey === 'fs.quickAccess' ? (
                  <StarIcon className="size-3.5 shrink-0" />
                ) : (
                  <n.icon className="size-3.5 shrink-0" />
                )}
                <span className="truncate">{t(n.labelKey)}</span>
              </button>
            )
          })}
        </div>

        {/* Listing */}
        <div
          key={path.join('/')}
          className="anim-fade min-w-0 flex-1 overflow-y-auto"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) setSel(null)
          }}
          onContextMenu={(e) => openMenu(e, bgMenu())}
        >
          {!ready ? (
            <div className="flex h-full items-center justify-center text-[13px] text-[#888]">
              {t('exp.loading')}
            </div>
          ) : items.length === 0 ? (
            <div
              className="flex h-full flex-col items-center justify-center gap-3 text-[#888]"
              onContextMenu={(e) => openMenu(e, bgMenu())}
            >
              {inBin ? (
                <>
                  <RecycleBinIcon className="size-16 opacity-60" />
                  <p className="text-[14px]">{t('exp.binEmpty')}</p>
                </>
              ) : (
                <>
                  <FolderIcon className="size-16 opacity-50" />
                  <p className="text-[14px]">{t('exp.empty')}</p>
                </>
              )}
            </div>
          ) : view === 'icons' ? (
            <div className="flex flex-wrap content-start gap-1 p-2">
              {items.map((n) => (
                <button
                  key={n.name}
                  className={`flex w-[88px] flex-col items-center gap-1 rounded-[2px] border px-1 py-2 ${
                    sel === n.name
                      ? 'border-[#99d1ff] bg-[#cce8ff]'
                      : 'border-transparent hover:bg-[#e5f3ff]'
                  }`}
                  onClick={() => setSel(n.name)}
                  onDoubleClick={() => open(n)}
                  onContextMenu={(e) => {
                    setSel(n.name)
                    openMenu(e, itemMenu(n))
                  }}
                >
                  <n.icon className="size-10 shrink-0" />
                  {renaming === n.name ? (
                    <RenameInput
                      initial={n.name}
                      dir={n.kind !== 'file'}
                      onDone={(v) => commitRename(n.name, v)}
                    />
                  ) : (
                    <span className="w-full break-words text-center text-[11px] leading-[1.2] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
                      {nameOf(n)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left text-[12px] text-[#6d6d6d]">
                  {colHeader('name', t('exp.col.name'), 'border-l-0')}
                  {colHeader('modified', inBin ? t('exp.col.deleted') : t('exp.col.modified'), 'w-36')}
                  {colHeader('type', t('exp.col.type'), 'w-32')}
                  {colHeader('size', t('exp.col.size'), 'w-32')}
                </tr>
              </thead>
              <tbody>
                {items.map((n) => (
                  <tr
                    key={n.name}
                    className={`cursor-default text-[12.5px] ${
                      sel === n.name ? 'bg-[#cce8ff]' : 'hover:bg-[#e5f3ff]'
                    }`}
                    onClick={() => setSel(n.name)}
                    onDoubleClick={() => open(n)}
                    onContextMenu={(e) => {
                      setSel(n.name)
                      openMenu(e, itemMenu(n))
                    }}
                  >
                    <td className="flex items-center gap-1.5 px-2 py-[2.5px]">
                      <n.icon className="size-4 shrink-0" />
                      {renaming === n.name ? (
                        <RenameInput
                          initial={n.name}
                          dir={n.kind !== 'file'}
                          onDone={(v) => commitRename(n.name, v)}
                        />
                      ) : (
                        <span className="truncate">{nameOf(n)}</span>
                      )}
                    </td>
                    <td className="px-2 py-[2.5px] text-[#555]">
                      {n.modified ? formatDateTime(n.modified, locale) : ''}
                    </td>
                    <td className="px-2 py-[2.5px] text-[#555]">{t(n.type)}</td>
                    <td className="px-2 py-[2.5px] text-[#555]">
                      {n.driveInfo
                        ? t('fs.freeOf', {
                            free: formatSize(n.driveInfo.free),
                            total: formatSize(n.driveInfo.total),
                          })
                        : n.size}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex h-6 shrink-0 items-center gap-5 border-t border-[#dcdcdc] px-3 text-[11.5px] text-[#333]">
        <span>{t(items.length === 1 ? 'exp.item' : 'exp.items', { n: items.length })}</span>
        {sel && <span>{t('exp.selected')}</span>}
        <span className="flex items-center gap-1">
          <FileIcon className="size-3" /> {t(node.type)}
        </span>
        <span className="ml-auto flex items-center gap-0.5">
          <button
            className={`p-0.5 ${view === 'details' ? 'bg-[#cce8ff]' : 'hover:bg-[#e5f3ff]'}`}
            onClick={() => setView('details')}
            aria-label={t('exp.view.details')}
          >
            <DetailsIcon className="size-3.5" />
          </button>
          <button
            className={`p-0.5 ${view === 'icons' ? 'bg-[#cce8ff]' : 'hover:bg-[#e5f3ff]'}`}
            onClick={() => setView('icons')}
            aria-label={t('exp.view.icons')}
          >
            <GridIcon className="size-3.5" />
          </button>
        </span>
      </div>

      {menu && (
        <ContextMenu x={menu.x} y={menu.y} items={menu.items} onClose={() => setMenu(null)} />
      )}
      {dialog?.kind === 'props' && (
        <FilePropertiesDialog
          node={dialog.node}
          uiPath={path}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.kind === 'move' && (
        <FileDialog
          mode="folder"
          title={t('exp.moveTo', { name: dialog.node.name })}
          actionLabel={t('exp.move')}
          onPick={({ dir }) => {
            fs.moveTo([...path, dialog.node.name], dir)
            setDialog(null)
          }}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  )
}

/** Inline rename field — selects the basename like Explorer does. */
function RenameInput({
  initial,
  dir,
  onDone,
}: {
  initial: string
  dir: boolean
  onDone: (v: string) => void
}) {
  return (
    <input
      autoFocus
      defaultValue={initial}
      className="min-w-0 flex-1 border border-[#0078d7] px-0.5 text-[12px] outline-none"
      onFocus={(e) => {
        const dot = dir ? -1 : initial.lastIndexOf('.')
        e.target.setSelectionRange(0, dot > 0 ? dot : initial.length)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onDone(e.currentTarget.value)
        if (e.key === 'Escape') onDone(initial)
        e.stopPropagation()
      }}
      onBlur={(e) => onDone(e.target.value)}
      onClick={(e) => e.stopPropagation()}
    />
  )
}
