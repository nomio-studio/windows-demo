import { useEffect, useState, type ComponentType } from 'react'
import { useT } from '../core/i18n'
import type { MessageKey } from '../core/i18n/en'
import type { AppProps, IconType } from '../core/types'
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
import AccountsPage from './settings/AccountsPage'
import AppsPage from './settings/AppsPage'
import DevicesPage from './settings/DevicesPage'
import EasePage from './settings/EasePage'
import GamingPage from './settings/GamingPage'
import NetworkPage from './settings/NetworkPage'
import PersonalizationPage from './settings/PersonalizationPage'
import PrivacyPage from './settings/PrivacyPage'
import SystemPage from './settings/SystemPage'
import TimePage from './settings/TimePage'
import UpdatePage from './settings/UpdatePage'

interface Category {
  id: string
  /** Name + description — message keys resolved via `t()`. */
  name: MessageKey
  desc: MessageKey
  icon: IconType
  page: ComponentType
}

const CATEGORIES: Category[] = [
  { id: 'system', name: 'set.cat.system.name', desc: 'set.cat.system.desc', icon: MonitorIcon, page: SystemPage },
  { id: 'devices', name: 'set.cat.devices.name', desc: 'set.cat.devices.desc', icon: DevicesIcon, page: DevicesPage },
  { id: 'network', name: 'set.cat.network.name', desc: 'set.cat.network.desc', icon: NetworkIcon, page: NetworkPage },
  { id: 'personalization', name: 'set.cat.personalization.name', desc: 'set.cat.personalization.desc', icon: PaintIcon, page: PersonalizationPage },
  { id: 'apps', name: 'set.cat.apps.name', desc: 'set.cat.apps.desc', icon: AppsIcon, page: AppsPage },
  { id: 'accounts', name: 'set.cat.accounts.name', desc: 'set.cat.accounts.desc', icon: UserIcon, page: AccountsPage },
  { id: 'time', name: 'set.cat.time.name', desc: 'set.cat.time.desc', icon: TimeIcon, page: TimePage },
  { id: 'gaming', name: 'set.cat.gaming.name', desc: 'set.cat.gaming.desc', icon: GamepadIcon, page: GamingPage },
  { id: 'ease', name: 'set.cat.ease.name', desc: 'set.cat.ease.desc', icon: EaseIcon, page: EasePage },
  { id: 'privacy', name: 'set.cat.privacy.name', desc: 'set.cat.privacy.desc', icon: PrivacyIcon, page: PrivacyPage },
  { id: 'update', name: 'set.cat.update.name', desc: 'set.cat.update.desc', icon: UpdateIcon, page: UpdatePage },
]

/** Settings app: category grid + a functional page per category. */
export default function SettingsApp({ launch }: AppProps) {
  const launchPage = (launch as { page?: string } | undefined)?.page
  const [page, setPage] = useState(launchPage ?? 'home')
  const t = useT()

  // Deep links while the single-instance window is already open
  // (openApp retargets `launch` on re-focus).
  useEffect(() => {
    if (launchPage) setPage(launchPage)
  }, [launchPage])

  const cat = CATEGORIES.find((c) => c.id === page)
  const PageBody = cat?.page

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
        <SettingsIcon className="size-4" />
        <span className="text-[15px]">
          {t('app.settings')}
          {cat ? `  ›  ${t(cat.name)}` : ''}
        </span>
      </div>

      {page === 'home' || !PageBody ? (
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
          {/* Category rail — jump between sections like Win10's nav. */}
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
          <div key={page} className="anim-fade min-w-0 flex-1">
            <PageBody />
          </div>
        </div>
      )}
    </div>
  )
}
