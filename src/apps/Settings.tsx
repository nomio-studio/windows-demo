import { useState } from 'react'
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
  name: string
  desc: string
  icon: IconType
  implemented?: boolean
}

const CATEGORIES: Category[] = [
  { id: 'system', name: 'System', desc: 'Display, sound, notifications, power', icon: MonitorIcon, implemented: true },
  { id: 'devices', name: 'Devices', desc: 'Bluetooth, printers, mouse', icon: DevicesIcon },
  { id: 'network', name: 'Network & Internet', desc: 'Wi-Fi, airplane mode, VPN', icon: NetworkIcon },
  { id: 'personalization', name: 'Personalization', desc: 'Background, lock screen, colors', icon: PaintIcon, implemented: true },
  { id: 'apps', name: 'Apps', desc: 'Uninstall, defaults, optional features', icon: AppsIcon },
  { id: 'accounts', name: 'Accounts', desc: 'Your accounts, email, sync, work', icon: UserIcon },
  { id: 'time', name: 'Time & Language', desc: 'Speech, region, date', icon: TimeIcon },
  { id: 'gaming', name: 'Gaming', desc: 'Game bar, captures, broadcasting', icon: GamepadIcon },
  { id: 'ease', name: 'Ease of Access', desc: 'Narrator, magnifier, high contrast', icon: EaseIcon },
  { id: 'privacy', name: 'Privacy', desc: 'Location, camera, microphone', icon: PrivacyIcon },
  { id: 'update', name: 'Update & Security', desc: 'Windows Update, recovery, backup', icon: UpdateIcon },
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

  const cat = CATEGORIES.find((c) => c.id === page)

  return (
    <div className="flex h-full flex-col bg-white text-black">
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-[#e0e0e0] px-3">
        <button
          className="flex size-7 items-center justify-center hover:bg-[#e5f3ff] disabled:text-[#aaa]"
          onClick={() => setPage('home')}
          disabled={page === 'home'}
          aria-label="Back"
        >
          <BackIcon className="size-4" />
        </button>
        <SettingsIcon className="size-4 text-[#0078d7]" />
        <span className="text-[15px]">
          Settings{cat ? `  ›  ${cat.name}` : ''}
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
                    {c.name}
                  </span>
                  <span className="block text-[11.5px] text-[#777]">
                    {c.desc}
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
                {c.name}
              </button>
            ))}
          </div>

          {/* Page content */}
          <div className="min-w-0 flex-1 overflow-y-auto p-6">
            {page === 'system' && (
              <div className="max-w-[520px]">
                <h2 className="mb-1 text-[20px] font-light">Display</h2>
                <p className="mb-6 text-[12.5px] text-[#777]">
                  Windows HD Color · Advanced display settings
                </p>
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13.5px]">Brightness</span>
                    <span className="text-[12px] text-[#777]">{brightness}%</span>
                  </div>
                  <Slider value={brightness} onChange={setBrightness} />
                </div>
                <div className="flex items-center justify-between border-t border-[#eee] py-4">
                  <div>
                    <p className="text-[13.5px]">Night light</p>
                    <p className="text-[12px] text-[#777]">
                      Use warmer colors to help you sleep
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
                <h2 className="mb-4 text-[20px] font-light">Background</h2>
                <p className="mb-3 text-[13px] text-[#555]">
                  Choose your desktop background:
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
                        {w.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {cat && !cat.implemented && (
              <div className="flex h-full flex-col items-center justify-center text-[#888]">
                <cat.icon className="mb-3 size-14 opacity-40" />
                <p className="text-[14px]">
                  {cat.name} isn't part of this demo.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
