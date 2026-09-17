import { useMemo, useState } from 'react'
import { formatDateTime } from '../core/hooks'
import { useLocale, useT } from '../core/i18n'
import type { AppProps } from '../core/types'
import { navEntries, resolve, resolveChain, type FsNode } from './vfs'
import {
  BackIcon,
  ChevronRight,
  FileIcon,
  FolderIcon,
  ForwardIcon,
  RecycleBinIcon,
  RefreshIcon,
  SearchIcon,
  StarIcon,
  UpIcon,
} from '../components/icons'

const RIBBON: [string, boolean][] = [
  ['exp.rib.pin', false],
  ['exp.rib.copy', true],
  ['exp.rib.paste', true],
  ['exp.rib.moveto', true],
  ['exp.rib.copypath', false],
  ['exp.rib.delete', true],
  ['exp.rib.rename', true],
  ['exp.rib.newfolder', false],
  ['exp.rib.properties', false],
]

/** Files app: nav pane, breadcrumb bar, details view, status bar. */
export default function ExplorerApp({ launch }: AppProps) {
  const initial = (launch as { path?: string[] } | undefined)?.path ?? [
    'Quick access',
  ]
  const [hist, setHist] = useState<string[][]>([initial])
  const [hi, setHi] = useState(0)
  const [sel, setSel] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const t = useT()
  const locale = useLocale()
  const path = hist[hi]
  const node = resolve(path)
  const chain = resolveChain(path)

  const items = useMemo(
    () =>
      (node.children ?? []).filter((n) =>
        n.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [node, query],
  )

  const navigate = (p: string[]) => {
    const nh = [...hist.slice(0, hi + 1), p]
    setHist(nh)
    setHi(nh.length - 1)
    setSel(null)
  }
  const back = () => hi > 0 && setHi(hi - 1)
  const fwd = () => hi < hist.length - 1 && setHi(hi + 1)
  const up = () => path.length > 1 && navigate(path.slice(0, -1))
  const open = (n: FsNode) => {
    if (n.kind === 'file') return
    navigate([...path, n.name])
  }

  const navBtn = 'flex h-6 w-7 items-center justify-center text-[#333] hover:bg-[#e0e0e0] disabled:text-[#b8b8b8] disabled:hover:bg-transparent'
  const nameOf = (n: FsNode) => t(n.labelKey ?? n.name)

  return (
    <div className="flex h-full flex-col bg-white text-black">
      {/* Ribbon */}
      <div className="shrink-0 border-b border-[#dcdcdc]">
        <div className="flex items-center text-[12px]">
          <span className="bg-[#0078d7] px-3 py-1 text-white">{t('exp.tab.file')}</span>
          {(['exp.tab.home', 'exp.tab.share', 'exp.tab.view'] as const).map((k, i) => (
            <span
              key={k}
              className={`px-3 py-1 ${i === 0 ? 'border-b-2 border-[#0078d7] text-[#0078d7]' : 'text-[#444]'}`}
            >
              {t(k)}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 overflow-x-auto px-2 py-1">
          {RIBBON.map(([label, disabled]) => (
            <button
              key={label}
              disabled={disabled}
              className="whitespace-nowrap px-2 py-0.5 text-[11.5px] text-[#333] hover:bg-[#e5f3ff] disabled:text-[#aaa] disabled:hover:bg-transparent"
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
        <button className={navBtn} aria-label={t('aria.refresh')}>
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
        <div key={path.join('/')} className="anim-fade min-w-0 flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-[#888]">
              {path[0] === 'Recycle Bin' ? (
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
          ) : (
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left text-[12px] text-[#6d6d6d]">
                  <th className="border-b border-[#dcdcdc] px-2 py-0.5 font-normal">{t('exp.col.name')}</th>
                  <th className="w-36 border-b border-l border-[#dcdcdc] px-2 py-0.5 font-normal">{t('exp.col.modified')}</th>
                  <th className="w-32 border-b border-l border-[#dcdcdc] px-2 py-0.5 font-normal">{t('exp.col.type')}</th>
                  <th className="w-28 border-b border-l border-[#dcdcdc] px-2 py-0.5 font-normal">{t('exp.col.size')}</th>
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
                  >
                    <td className="flex items-center gap-1.5 px-2 py-[2.5px]">
                      <n.icon className="size-4 shrink-0" />
                      <span className="truncate">{nameOf(n)}</span>
                    </td>
                    <td className="px-2 py-[2.5px] text-[#555]">
                      {n.modified ? formatDateTime(n.modified, locale) : ''}
                    </td>
                    <td className="px-2 py-[2.5px] text-[#555]">{t(n.type)}</td>
                    <td className="px-2 py-[2.5px] text-[#555]">{n.size}</td>
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
      </div>
    </div>
  )
}
