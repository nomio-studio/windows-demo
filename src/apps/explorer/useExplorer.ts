import { useMemo, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useLocale, useT } from '../../core/i18n'
import { useFsStore } from '../../core/fs/store'
import {
  TEXT_EXTS,
  extOf,
  resolve,
  resolveChain,
  type FsNode,
} from '../../core/fs/tree'
import { useWindowsStore } from '../../core/store/windows'
import type { ContextMenuItem } from '../../core/store/system'
import type { Dialog, MenuState, SortKey, ViewMode } from './types'

/**
 * Explorer state: navigation history, selection, sorting, view mode,
 * context menu, dialogs and inline rename. Everything the Files app's
 * chrome needs, returned as one state object (`ex`) so panes and menu
 * builders share it without prop drilling.
 */
export function useExplorer(launch: unknown) {
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

  const restoreAll = () => {
    for (const n of node.children ?? []) if (n.bin) fs.restoreBin(n)
  }

  const copyPath = (n: FsNode) => {
    const fsPath = n.fsPath
    const text = fsPath ? `C:\\${fsPath.join('\\')}` : [...path, n.name].join(' > ')
    navigator.clipboard?.writeText(text).catch(() => {})
  }

  const nameOf = (n: FsNode) => t(n.labelKey ?? n.name)

  return {
    t,
    locale,
    fs,
    ready,
    clipboard,
    pins,
    hist,
    hi,
    path,
    node,
    chain,
    inBin,
    writable,
    items,
    sel,
    setSel,
    selNode,
    selPinned,
    query,
    setQuery,
    sortKey,
    sortAsc,
    setSort,
    setSortKey,
    view,
    setView,
    menu,
    setMenu,
    dialog,
    setDialog,
    renaming,
    setRenaming,
    navigate,
    back,
    fwd,
    up,
    open,
    startRename,
    commitRename,
    openMenu,
    restoreAll,
    copyPath,
    nameOf,
  }
}

export type ExplorerState = ReturnType<typeof useExplorer>
