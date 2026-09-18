import { useState } from 'react'
import { formatTime } from '../../core/hooks'
import { useLocale, useT } from '../../core/i18n'
import { usePwaStore } from '../../core/store/pwa'
import { useSystemStore } from '../../core/store/system'
import { Slider } from '../ui'
import {
  AirplaneIcon,
  BatteryIcon,
  BluetoothIcon,
  CloseIcon,
  LocationIcon,
  MailIcon,
  MoonIcon,
  SunIcon,
  TabletIcon,
  UpdateIcon,
  VpnIcon,
  WifiIcon,
} from '../icons'
import type { IconType } from '../../core/types'

interface Notification {
  /** App name + strings — message keys resolved via `t()`. */
  app: string
  icon: IconType
  title: string
  text: string
  time: Date
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    app: 'app.wu',
    icon: UpdateIcon,
    title: 'notif.1.title',
    text: 'notif.1.text',
    time: new Date(2026, 0, 1, 9, 14),
  },
  {
    app: 'app.mail',
    icon: MailIcon,
    title: 'notif.2.title',
    text: 'notif.2.text',
    time: new Date(2026, 0, 1, 8, 52),
  },
]

/** Right-edge Action Center: notifications + quick actions + brightness. */
export default function ActionCenter({ exiting }: { exiting?: boolean }) {
  const brightness = useSystemStore((s) => s.brightness)
  const setBrightness = useSystemStore((s) => s.setBrightness)
  const wifiOn = useSystemStore((s) => s.wifiOn)
  const toggleWifi = useSystemStore((s) => s.toggleWifi)
  const quick = useSystemStore((s) => s.quickActions)
  const toggleQuick = useSystemStore((s) => s.toggleQuickAction)
  const accent = useSystemStore((s) => s.accent)
  const updateReady = usePwaStore((s) => s.updateReady)
  const [notes, setNotes] = useState(INITIAL_NOTIFICATIONS)
  const t = useT()
  const locale = useLocale()

  // The Windows Update entry only appears once an update is really
  // installed (the toast is the primary signal).
  const shownNotes = notes.filter((n) => n.app !== 'app.wu' || updateReady)

  const tiles: { id: string; label: string; icon: IconType; on: boolean; toggle: () => void }[] = [
    { id: 'tablet', label: 'qa.tablet', icon: TabletIcon, on: !!quick.tablet, toggle: () => toggleQuick('tablet') },
    { id: 'network', label: 'qa.wifi', icon: WifiIcon, on: wifiOn, toggle: toggleWifi },
    { id: 'bluetooth', label: 'qa.bluetooth', icon: BluetoothIcon, on: !!quick.bluetooth, toggle: () => toggleQuick('bluetooth') },
    { id: 'airplane', label: 'qa.airplane', icon: AirplaneIcon, on: !!quick.airplane, toggle: () => toggleQuick('airplane') },
    { id: 'nightlight', label: 'qa.nightlight', icon: MoonIcon, on: !!quick.nightlight, toggle: () => toggleQuick('nightlight') },
    { id: 'location', label: 'qa.location', icon: LocationIcon, on: !!quick.location, toggle: () => toggleQuick('location') },
    { id: 'batterySaver', label: 'qa.battery', icon: BatteryIcon, on: !!quick.batterySaver, toggle: () => toggleQuick('batterySaver') },
    { id: 'vpn', label: 'qa.vpn', icon: VpnIcon, on: !!quick.vpn, toggle: () => toggleQuick('vpn') },
  ]

  return (
    <div
      className={`${
        exiting ? 'anim-flyout-out-right' : 'anim-flyout-right'
      } absolute bottom-10 right-0 z-[55000] flex h-[calc(100%-40px)] w-[360px] max-w-full flex-col border-l border-black/60 bg-[#1f1f1f]/95 text-white shadow-2xl backdrop-blur-xl`}
    >
      {/* Notifications */}
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {shownNotes.length > 0 ? (
          <>
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-[12px] text-white/60">{t('ac.notifications')}</span>
              <button
                className="text-[12px] text-white/70 hover:text-white"
                onClick={() => setNotes([])}
              >
                {t('ac.clearAll')}
              </button>
            </div>
            {shownNotes.map((n, i) => (
              <div key={i} className="group relative mb-2 bg-[#383838] p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] text-white/60">
                  <n.icon className="size-3.5" />
                  <span className="flex-1">{t(n.app)}</span>
                  <span>{formatTime(n.time, locale)}</span>
                  <button
                    className="invisible ml-1 group-hover:visible"
                    onClick={() => setNotes((v) => v.filter((x) => x !== n))}
                    aria-label={t('aria.dismiss')}
                  >
                    <CloseIcon className="size-2.5" />
                  </button>
                </div>
                <p className="text-[13px] font-semibold">{t(n.title)}</p>
                <p className="text-[12px] text-white/75">{t(n.text)}</p>
              </div>
            ))}
          </>
        ) : (
          <p className="px-2 py-4 text-center text-[12px] text-white/45">
            {t('ac.none')}
          </p>
        )}
      </div>

      {/* Brightness */}
      <div className="flex items-center gap-3 border-t border-white/10 px-4 py-2.5">
        <SunIcon className="size-4 shrink-0 text-white/80" />
        <Slider value={brightness} onChange={setBrightness} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-px border-t border-white/10 bg-black/40">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            className={`flex h-[74px] flex-col items-center justify-center gap-1.5 px-1 transition-all duration-150 active:scale-95 ${
              tile.on ? 'hover:brightness-110' : 'bg-[#2e2e2e] hover:bg-[#3d3d3d]'
            }`}
            style={tile.on ? { background: accent } : undefined}
            onClick={tile.toggle}
          >
            <tile.icon className="size-5" />
            <span className="w-full truncate text-center text-[10.5px]">
              {t(tile.label)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
