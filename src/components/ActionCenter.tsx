import { useState } from 'react'
import { useSystemStore } from '../core/store/system'
import { Slider } from './ui'
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
} from './icons'
import type { IconType } from '../core/types'

interface Notification {
  app: string
  icon: IconType
  title: string
  text: string
  time: string
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    app: 'Windows Update',
    icon: UpdateIcon,
    title: 'Updates available',
    text: 'A feature update is ready to be installed. Restart to finish updating.',
    time: '9:14 AM',
  },
  {
    app: 'Mail',
    icon: MailIcon,
    title: 'Welcome!',
    text: 'Thanks for trying the Windows 10 web demo. Everything runs client-side.',
    time: '8:52 AM',
  },
]

/** Right-edge Action Center: notifications + quick actions + brightness. */
export default function ActionCenter() {
  const brightness = useSystemStore((s) => s.brightness)
  const setBrightness = useSystemStore((s) => s.setBrightness)
  const wifiOn = useSystemStore((s) => s.wifiOn)
  const toggleWifi = useSystemStore((s) => s.toggleWifi)
  const quick = useSystemStore((s) => s.quickActions)
  const toggleQuick = useSystemStore((s) => s.toggleQuickAction)
  const [notes, setNotes] = useState(INITIAL_NOTIFICATIONS)

  const tiles: { id: string; label: string; icon: IconType; on: boolean; toggle: () => void }[] = [
    { id: 'tablet', label: 'Tablet mode', icon: TabletIcon, on: !!quick.tablet, toggle: () => toggleQuick('tablet') },
    { id: 'network', label: 'Wi-Fi', icon: WifiIcon, on: wifiOn, toggle: toggleWifi },
    { id: 'bluetooth', label: 'Bluetooth', icon: BluetoothIcon, on: !!quick.bluetooth, toggle: () => toggleQuick('bluetooth') },
    { id: 'airplane', label: 'Airplane mode', icon: AirplaneIcon, on: !!quick.airplane, toggle: () => toggleQuick('airplane') },
    { id: 'nightlight', label: 'Night light', icon: MoonIcon, on: !!quick.nightlight, toggle: () => toggleQuick('nightlight') },
    { id: 'location', label: 'Location', icon: LocationIcon, on: !!quick.location, toggle: () => toggleQuick('location') },
    { id: 'batterySaver', label: 'Battery saver', icon: BatteryIcon, on: !!quick.batterySaver, toggle: () => toggleQuick('batterySaver') },
    { id: 'vpn', label: 'VPN', icon: VpnIcon, on: !!quick.vpn, toggle: () => toggleQuick('vpn') },
  ]

  return (
    <div className="anim-flyout-right absolute bottom-10 right-0 z-[55000] flex h-[calc(100%-40px)] w-[360px] max-w-full flex-col border-l border-black/60 bg-[#1f1f1f]/95 text-white shadow-2xl backdrop-blur-xl">
      {/* Notifications */}
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {notes.length > 0 ? (
          <>
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-[12px] text-white/60">Notifications</span>
              <button
                className="text-[12px] text-white/70 hover:text-white"
                onClick={() => setNotes([])}
              >
                Clear all
              </button>
            </div>
            {notes.map((n, i) => (
              <div key={i} className="group relative mb-2 bg-[#383838] p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] text-white/60">
                  <n.icon className="size-3.5" />
                  <span className="flex-1">{n.app}</span>
                  <span>{n.time}</span>
                  <button
                    className="invisible ml-1 group-hover:visible"
                    onClick={() => setNotes((v) => v.filter((_, j) => j !== i))}
                    aria-label="Dismiss"
                  >
                    <CloseIcon className="size-2.5" />
                  </button>
                </div>
                <p className="text-[13px] font-semibold">{n.title}</p>
                <p className="text-[12px] text-white/75">{n.text}</p>
              </div>
            ))}
          </>
        ) : (
          <p className="px-2 py-4 text-center text-[12px] text-white/45">
            No new notifications
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
        {tiles.map((t) => (
          <button
            key={t.id}
            className={`flex h-[74px] flex-col items-center justify-center gap-1.5 px-1 ${
              t.on ? 'bg-[#0078d7] hover:bg-[#1a86e0]' : 'bg-[#2e2e2e] hover:bg-[#3d3d3d]'
            }`}
            onClick={t.toggle}
          >
            <t.icon className="size-5" />
            <span className="w-full truncate text-center text-[10.5px]">
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
