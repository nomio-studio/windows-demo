import { LOCALES, useI18n, useT } from '../core/i18n'
import { useSystemStore, type Flyout } from '../core/store/system'
import type { IconType } from '../core/types'
import { useWindowsStore } from '../core/store/windows'
import { Slider, Toggle } from './ui'
import {
  BluetoothIcon,
  CheckIcon,
  CloudIcon,
  ShieldIcon,
  VolumeIcon,
  WifiIcon,
} from './icons'

const panel = (exiting?: boolean) =>
  `${
    exiting ? 'anim-flyout-down' : 'anim-flyout-up'
  } absolute bottom-10 z-[55000] border border-black/60 bg-[#1f1f1f]/95 text-white shadow-2xl backdrop-blur-xl`

const NETWORKS = [
  'HomeNet-5G',
  'CoffeeShop_Guest',
  'xfinitywifi',
  'Airport_Free_WiFi',
  'Neighbor-2.4G',
]

/** Small flyouts anchored to the system tray. */
export default function TrayFlyouts({
  kind,
  exiting,
}: {
  kind: Exclude<Flyout, null>
  exiting?: boolean
}) {
  if (kind === 'trayOverflow') return <Overflow exiting={exiting} />
  if (kind === 'volume') return <Volume exiting={exiting} />
  if (kind === 'network') return <Network exiting={exiting} />
  if (kind === 'language') return <Language exiting={exiting} />
  return null
}

function Overflow({ exiting }: { exiting?: boolean }) {
  const openApp = useWindowsStore((s) => s.openApp)
  const icons: [IconType, string][] = [
    [CloudIcon, 'app.onedrive'],
    [ShieldIcon, 'app.winsec'],
    [BluetoothIcon, 'app.bluetooth'],
  ]
  return (
    <div className={`${panel(exiting)} right-1.5 w-[170px] p-1`}>
      <div className="grid grid-cols-4">
        {icons.map(([Icon, title], i) => (
          <button
            key={i}
            className="flex aspect-square items-center justify-center hover:bg-white/10"
            onClick={() => openApp('modern', { title, icon: Icon })}
          >
            <Icon className="size-4" />
          </button>
        ))}
      </div>
    </div>
  )
}

/** Input-language flyout — the tray ENG/中 indicator's panel. */
function Language({ exiting }: { exiting?: boolean }) {
  const locale = useI18n((s) => s.locale)
  const setLocale = useI18n((s) => s.setLocale)
  const openApp = useWindowsStore((s) => s.openApp)
  const setFlyout = useSystemStore((s) => s.setFlyout)
  const t = useT()
  return (
    <div className={`${panel(exiting)} right-0 w-[300px] max-w-full py-1`}>
      {LOCALES.map((l) => (
        <button
          key={l.id}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-white/10"
          onClick={() => {
            setLocale(l.id)
            setFlyout(null)
          }}
        >
          <span className="w-5 shrink-0 text-center">
            {locale === l.id && <CheckIcon className="mx-auto size-3.5" />}
          </span>
          <span className="flex-1">
            <span className="block text-[13px]">{l.name}</span>
            <span className="block text-[11px] text-white/55">{l.sub}</span>
          </span>
        </button>
      ))}
      <button
        className="mt-1 w-full border-t border-white/10 px-4 py-2.5 text-left text-[13px] text-white/80 hover:bg-white/10"
        onClick={() => {
          openApp('settings', { launch: { page: 'time' } })
          setFlyout(null)
        }}
      >
        {t('lang.prefs')}
      </button>
    </div>
  )
}

function Volume({ exiting }: { exiting?: boolean }) {
  const volume = useSystemStore((s) => s.volume)
  const setVolume = useSystemStore((s) => s.setVolume)
  return (
    <div className={`${panel(exiting)} right-2 flex h-14 w-72 max-w-[calc(100vw-16px)] items-center gap-3 px-4 sm:right-24`}>
      <VolumeIcon className="size-5 shrink-0" />
      <Slider value={volume} onChange={setVolume} />
      <span className="w-8 text-right text-[13px]">{volume}</span>
    </div>
  )
}

function Network({ exiting }: { exiting?: boolean }) {
  const wifiOn = useSystemStore((s) => s.wifiOn)
  const toggleWifi = useSystemStore((s) => s.toggleWifi)
  const toggleFlyout = useSystemStore((s) => s.toggleFlyout)
  const t = useT()
  return (
    <div className={`${panel(exiting)} right-0 max-h-[420px] w-[340px] max-w-full overflow-y-auto`}>
      <div className="flex items-center justify-between px-4 pb-1 pt-3">
        <span className="text-[15px]">Wi-Fi</span>
        <Toggle checked={wifiOn} onChange={toggleWifi} />
      </div>
      <div className="py-1">
        {wifiOn ? (
          NETWORKS.map((n, i) => (
            <button
              key={n}
              className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-white/10"
            >
              <WifiIcon className={`size-4 ${i > 2 ? 'opacity-50' : ''}`} />
              <span className="flex-1">
                <span className="block text-[13px]">{n}</span>
                <span className="block text-[11px] text-white/60">
                  {i === 0 ? t('net.connected') : t('net.secured')}
                </span>
              </span>
            </button>
          ))
        ) : (
          <p className="px-4 py-3 text-[13px] text-white/60">
            {t('net.off')}
          </p>
        )}
      </div>
      <button
        className="w-full border-t border-white/10 px-4 py-2.5 text-left text-[13px] text-white/80 hover:bg-white/10"
        onClick={() => toggleFlyout('actionCenter')}
      >
        {t('net.settings')}
      </button>
    </div>
  )
}
