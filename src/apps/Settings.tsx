import { useState } from 'react'
import { LOCALES, useI18n, useT } from '../core/i18n'
import type { MessageKey } from '../core/i18n/en'
import type { AppProps } from '../core/types'
import { useSystemStore } from '../core/store/system'
import { wallpapers } from '../config/shell'
import { Slider, Toggle } from '../components/ui'
import {
  AppsIcon,
  BackIcon,
  DevicesIcon,
  EaseIcon,
  GamepadIcon,
  MonitorIcon,
  NetworkIcon,
  PaintIcon,
  PrivacyIcon,
  SettingsIcon,
  TimeIcon,
  UpdateIcon,
  UserIcon,
} from '../components/icons'
import type { IconType } from '../core/types'

interface Category {
  id: string
  /** Name + description — message keys resolved via `t()`. */
  name: MessageKey
  desc: MessageKey
  icon: IconType
  implemented?: boolean
}

const CATEGORIES: Category[] = [
  { id: 'system', name: 'set.cat.system.name', desc: 'set.cat.system.desc', icon: MonitorIcon, implemented: true },
  { id: 'devices', name: 'set.cat.devices.name', desc: 'set.cat.devices.desc', icon: DevicesIcon },
  { id: 'network', name: 'set.cat.network.name', desc: 'set.cat.network.desc', icon: NetworkIcon },
  { id: 'personalization', name: 'set.cat.personalization.name', desc: 'set.cat.personalization.desc', icon: PaintIcon, implemented: true },
  { id: 'apps', name: 'set.cat.apps.name', desc: 'set.cat.apps.desc', icon: AppsIcon },
  { id: 'accounts', name: 'set.cat.accounts.name', desc: 'set.cat.accounts.desc', icon: UserIcon },
  { id: 'time', name: 'set.cat.time.name', desc: 'set.cat.time.desc', icon: TimeIcon, implemented: true },
  { id: 'gaming', name: 'set.cat.gaming.name', desc: 'set.cat.gaming.desc', icon: GamepadIcon },
  { id: 'ease', name: 'set.cat.ease.name', desc: 'set.cat.ease.desc', icon: EaseIcon },
  { id: 'privacy', name: 'set.cat.privacy.name', desc: 'set.cat.privacy.desc', icon: PrivacyIcon },
  { id: 'update', name: 'set.cat.update.name', desc: 'set.cat.update.desc', icon: UpdateIcon },
]

/** Settings app: category grid + Display and Personalization pages. */
export default function SettingsApp({ launch }: AppProps) {
  const initial = (launch as { page?: string } | undefined)?.page ?? 'home'
  const [page, setPage] = useState(initial)
  const brightness = useSystemStore((s) => s.brightness)
  const setBrightness = useSystemStore((s) => s.setBrightness)
  const quick = useSystemStore((s) => s.quickActions)
  const toggleQuick = useSystemStore((s) => s.toggleQuickAction)
  const wallpaper = useSystemStore((s) => s.wallpaper)
  const setWallpaper = useSystemStore((s) => s.setWallpaper)
  const locale = useI18n((s) => s.locale)
  const setLocale = useI18n((s) => s.setLocale)
  const t = useT()

  const cat = CATEGORIES.find((c) => c.id === page)

  return (
    <div className="flex h-full flex-col bg-white text-black">
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-[#e0e0e0] px-3">
        <button
          className="flex size-7 items-center justify-center hover:bg-[#e5f3ff] disabled:text-[#aaa]"
          onClick={() => setPage('home')}
          disabled={page === 'home'}
          aria-label={t('aria.back')}
        >
          <BackIcon className="size-4" />
        </button>
        <SettingsIcon className="size-4 text-[#0078d7]" />
        <span className="text-[15px]">
          {t('app.settings')}{cat ? `  ›  ${t(cat.name)}` : ''}
        </span>
      </div>

      {page === 'home' ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="mx-auto grid max-w-[720px] grid-cols-2 gap-1 sm:grid-cols-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className="flex items-center gap-3 border border-transparent p-3 text-left hover:border-[#99d1ff] hover:bg-[#e5f3ff]"
                onClick={() => setPage(c.id)}
              >
                <c.icon className="size-9 shrink-0 text-[#0078d7]" />
                <span>
                  <span className="block text-[13.5px] font-medium">
                    {t(c.name)}
                  </span>
                  <span className="block text-[11.5px] text-[#777]">
                    {t(c.desc)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          {/* Section nav */}
          <div className="w-44 shrink-0 border-r border-[#e8e8e8] py-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-[12.5px] ${
                  page === c.id
                    ? 'bg-[#cce8ff] font-medium'
                    : 'hover:bg-[#e5f3ff]'
                }`}
                onClick={() => setPage(c.id)}
              >
                <c.icon className="size-4 shrink-0 text-[#555]" />
                {t(c.name)}
              </button>
            ))}
          </div>

          {/* Page content */}
          <div key={page} className="anim-fade min-w-0 flex-1 overflow-y-auto p-6">
            {page === 'system' && (
              <div className="max-w-[520px]">
                <h2 className="mb-1 text-[20px] font-light">{t('set.display')}</h2>
                <p className="mb-6 text-[12.5px] text-[#777]">
                  {t('set.display.sub')}
                </p>
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13.5px]">{t('set.brightness')}</span>
                    <span className="text-[12px] text-[#777]">{brightness}%</span>
                  </div>
                  <Slider value={brightness} onChange={setBrightness} />
                </div>
                <div className="flex items-center justify-between border-t border-[#eee] py-4">
                  <div>
                    <p className="text-[13.5px]">{t('set.nightlight')}</p>
                    <p className="text-[12px] text-[#777]">
                      {t('set.nightlight.desc')}
                    </p>
                  </div>
                  <Toggle
                    checked={!!quick.nightlight}
                    onChange={() => toggleQuick('nightlight')}
                  />
                </div>
              </div>
            )}

            {page === 'personalization' && (
              <div className="max-w-[560px]">
                <h2 className="mb-4 text-[20px] font-light">{t('set.background')}</h2>
                <p className="mb-3 text-[13px] text-[#555]">
                  {t('set.background.desc')}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {wallpapers.map((w, i) => (
                    <button
                      key={w.name}
                      className={`group border-2 p-0.5 ${
                        wallpaper === i
                          ? 'border-[#0078d7]'
                          : 'border-transparent hover:border-[#99d1ff]'
                      }`}
                      onClick={() => setWallpaper(i)}
                    >
                      <div className="h-20 w-full" style={w.style} />
                      <p className="mt-1 truncate text-center text-[11.5px]">
                        {t(w.name)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {page === 'time' && (
              <div className="max-w-[520px]">
                <h2 className="mb-1 text-[20px] font-light">
                  {t('set.time.region')}
                </h2>
                <p className="mb-6 text-[12.5px] text-[#777]">
                  {t('set.time.displayLang')}
                </p>
                <div className="border border-[#e0e0e0]">
                  {LOCALES.map((l) => (
                    <button
                      key={l.id}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#e5f3ff] ${
                        locale === l.id ? 'bg-[#cce8ff]' : ''
                      }`}
                      onClick={() => setLocale(l.id)}
                    >
                      <span
                        className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                          locale === l.id ? 'border-[#0078d7]' : 'border-[#999]'
                        }`}
                      >
                        {locale === l.id && (
                          <span className="size-2 rounded-full bg-[#0078d7]" />
                        )}
                      </span>
                      <span>
                        <span className="block text-[13.5px]">{l.name}</span>
                        <span className="block text-[11.5px] text-[#777]">
                          {l.sub}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-[12px] text-[#777]">
                  {t('set.time.note')}
                </p>
              </div>
            )}

            {cat && !cat.implemented && (
              <div className="flex h-full flex-col items-center justify-center text-[#888]">
                <cat.icon className="mb-3 size-14 opacity-40" />
                <p className="text-[14px]">
                  {t('set.notImpl', { name: t(cat.name) })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
