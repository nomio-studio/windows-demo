import { useState } from 'react'
import { useT } from '../../core/i18n'
import { listApps } from '../../core/registry'
import { useSystemStore } from '../../core/store/system'
import { useWindowsStore } from '../../core/store/windows'
import { SearchIcon } from '../icons'

const QUICK = ['search.q1', 'search.q2', 'search.q3', 'app.settings']

/** Cortana-style search panel above the taskbar search box. */
export default function SearchFlyout({ exiting }: { exiting?: boolean }) {
  const openApp = useWindowsStore((s) => s.openApp)
  const setFlyout = useSystemStore((s) => s.setFlyout)
  const [query, setQuery] = useState('')
  const t = useT()
  const topApps = listApps().slice(0, 6)

  const hour = new Date().getHours()
  const greeting =
    hour < 12
      ? t('search.morning')
      : hour < 18
        ? t('search.afternoon')
        : t('search.evening')

  return (
    <div
      className={`${
        exiting ? 'anim-flyout-down' : 'anim-flyout-up'
      } absolute bottom-10 left-0 z-[55000] flex h-[600px] max-h-[calc(100%-40px)] w-[640px] max-w-full flex-col border border-black/60 bg-[#1f1f1f]/95 text-white shadow-2xl backdrop-blur-xl`}
    >
      <div className="flex h-11 shrink-0 items-center gap-2.5 border-b border-white/15 px-4">
        <SearchIcon className="size-4 text-white/70" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('shell.search')}
          className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-white/45"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <p className="mb-4 text-[22px] font-light">{greeting}</p>
        <p className="mb-2 text-[12px] font-semibold text-white/60">{t('search.topApps')}</p>
        <div className="mb-5 grid grid-cols-3 gap-1 sm:grid-cols-6">
          {topApps.map((a) => (
            <button
              key={a.id}
              className="flex flex-col items-center gap-1.5 rounded-sm px-1 py-2 hover:bg-white/10"
              onClick={() => {
                openApp(a.id)
                setFlyout(null)
              }}
            >
              <a.icon className="size-8" />
              <span className="w-full truncate text-center text-[11px]">
                {t(a.title)}
              </span>
            </button>
          ))}
        </div>
        <p className="mb-2 text-[12px] font-semibold text-white/60">
          {t('search.quick')}
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q}
              className="rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] hover:bg-white/20"
            >
              {t(q)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
