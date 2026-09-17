import { useT } from '../core/i18n'
import {
  BackIcon,
  CloseIcon,
  DotsIcon,
  ForwardIcon,
  GlobeIcon,
  HomeIcon,
  LockIcon,
  RefreshIcon,
  SearchIcon,
  StarIcon,
} from '../components/icons'

const SITES: { name: string; color: string; abbr: string }[] = [
  { name: 'GitHub', color: '#24292e', abbr: 'GH' },
  { name: 'Wikipedia', color: '#ffffff', abbr: 'W' },
  { name: 'YouTube', color: '#ff0000', abbr: 'YT' },
  { name: 'Microsoft', color: '#0078d7', abbr: 'M' },
  { name: 'Reddit', color: '#ff4500', abbr: 'R' },
  { name: 'X', color: '#000000', abbr: 'X' },
  { name: 'Stack Overflow', color: '#f48024', abbr: 'SO' },
  { name: 'Twitch', color: '#9146ff', abbr: 'T' },
]

const NEWS = ['edge.news1', 'edge.news2', 'edge.news3']

/** Microsoft Edge: chrome toolbar + new-tab style start page. */
export default function EdgeApp() {
  const t = useT()
  const navBtn =
    'flex h-7 w-7 items-center justify-center text-[#444] hover:bg-[#e5e5e5] disabled:text-[#b8b8b8]'

  return (
    <div className="flex h-full flex-col bg-[#f7f7f7] text-black">
      {/* Tab strip */}
      <div className="flex h-9 shrink-0 items-end bg-[#dee1e6] px-2">
        <div className="flex h-[30px] w-56 items-center justify-between rounded-t-md bg-white px-3">
          <span className="truncate text-[12px]">{t('edge.newTab')}</span>
          <CloseIcon className="size-2.5 text-[#666]" />
        </div>
        <button className="mb-1 ml-1 flex size-6 items-center justify-center text-[16px] text-[#666] hover:bg-white/60">
          +
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-[#e0e0e0] bg-white px-2">
        <button className={navBtn} disabled aria-label={t('aria.back')}>
          <BackIcon className="size-4" />
        </button>
        <button className={navBtn} disabled aria-label={t('aria.forward')}>
          <ForwardIcon className="size-4" />
        </button>
        <button className={navBtn} aria-label={t('aria.refresh')}>
          <RefreshIcon className="size-4" />
        </button>
        <button className={navBtn} aria-label={t('aria.home')}>
          <HomeIcon className="size-4" />
        </button>
        <div className="mx-1 flex h-7 min-w-0 flex-1 items-center gap-2 rounded-sm bg-[#f1f3f4] px-2.5 text-[12.5px] text-[#333]">
          <LockIcon className="size-3.5 shrink-0 text-[#0f9d58]" />
          <span className="truncate">https://www.bing.com</span>
        </div>
        <button className={navBtn} aria-label={t('aria.favorites')}>
          <StarIcon className="size-4" />
        </button>
        <button className={navBtn} aria-label={t('aria.hub')}>
          <GlobeIcon className="size-4" />
        </button>
        <button className={navBtn} aria-label={t('aria.more')}>
          <DotsIcon className="size-4" />
        </button>
      </div>

      {/* New tab page */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[560px] flex-col items-center pt-12">
          <GlobeIcon className="mb-5 size-12 text-[#0078d7]" />
          <div className="flex h-11 w-full items-center gap-3 bg-white px-4 shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
            <SearchIcon className="size-4 text-[#0078d7]" />
            <input
              placeholder={t('edge.search')}
              className="flex-1 text-[14px] outline-none"
            />
          </div>

          <div className="mt-10 w-full">
            <p className="mb-2 text-[12px] font-semibold text-[#666]">
              {t('edge.topSites')}
            </p>
            <div className="grid grid-cols-4 gap-3">
              {SITES.map((s) => (
                <button
                  key={s.name}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span
                    className="flex size-16 items-center justify-center text-[20px] font-semibold shadow-sm"
                    style={{
                      background: s.color,
                      color: s.color === '#ffffff' ? '#333' : '#fff',
                    }}
                  >
                    {s.abbr}
                  </span>
                  <span className="text-[11px] text-[#444]">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-10 mt-10 w-full">
            <p className="mb-2 text-[12px] font-semibold text-[#666]">
              {t('edge.headlines')}
            </p>
            {NEWS.map((n) => (
              <div
                key={n}
                className="mb-2 flex items-center gap-3 bg-white p-3 shadow-sm"
              >
                <div className="size-14 shrink-0 bg-gradient-to-br from-[#9db8d2] to-[#5a7ca8]" />
                <div>
                  <p className="text-[13px] font-medium">{t(n)}</p>
                  <p className="mt-0.5 text-[11px] text-[#888]">
                    demo.news · {t('edge.justNow')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
