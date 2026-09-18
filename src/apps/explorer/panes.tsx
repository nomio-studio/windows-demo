import { navEntries } from '../../core/fs/tree'
import {
  BackIcon,
  ChevronRight,
  ForwardIcon,
  RefreshIcon,
  SearchIcon,
  StarIcon,
  UpIcon,
} from '../../components/icons'
import { ribbonItems } from './menus'
import type { ExplorerState } from './useExplorer'

/* Explorer chrome: ribbon tabs, address bar, navigation pane. */

export function Ribbon({ ex }: { ex: ExplorerState }) {
  const { t, inBin } = ex
  return (
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
        {ribbonItems(ex).map(([label, disabled, fn]) => (
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
  )
}

const navBtn =
  'flex h-6 w-7 items-center justify-center text-[#333] hover:bg-[#e0e0e0] disabled:text-[#b8b8b8] disabled:hover:bg-transparent'

export function AddressBar({ ex }: { ex: ExplorerState }) {
  const { t, fs, hist, hi, path, chain, back, fwd, up, navigate, query, setQuery, node, nameOf } = ex
  return (
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
  )
}

export function NavPane({ ex }: { ex: ExplorerState }) {
  const { t, path, navigate } = ex
  return (
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
  )
}
