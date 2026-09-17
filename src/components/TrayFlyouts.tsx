import { useSystemStore } from '../core/store/system'
import { useWindowsStore } from '../core/store/windows'
import { Slider, Toggle } from './ui'
import {
  BluetoothIcon,
  CloudIcon,
  ShieldIcon,
  VolumeIcon,
  WifiIcon,
} from './icons'

const PANEL =
  'anim-flyout-up absolute bottom-10 z-[55000] border border-black/60 bg-[#1f1f1f]/95 text-white shadow-2xl backdrop-blur-xl'

const NETWORKS = [
  'HomeNet-5G',
  'CoffeeShop_Guest',
  'xfinitywifi',
  'Airport_Free_WiFi',
  'Neighbor-2.4G',
]

/** Small flyouts anchored to the system tray. */
export default function TrayFlyouts() {
  const flyout = useSystemStore((s) => s.flyout)

  if (flyout === 'trayOverflow') return <Overflow />
  if (flyout === 'volume') return <Volume />
  if (flyout === 'network') return <Network />
  return null
}

function Overflow() {
  const openApp = useWindowsStore((s) => s.openApp)
  const icons = [CloudIcon, ShieldIcon, BluetoothIcon]
  return (
    <div className={`${PANEL} right-1.5 w-[170px] p-1`}>
      <div className="grid grid-cols-4">
        {icons.map((Icon, i) => (
          <button
            key={i}
            className="flex aspect-square items-center justify-center hover:bg-white/10"
            onClick={() =>
              openApp('modern', {
                title: ['OneDrive', 'Windows Security', 'Bluetooth'][i],
                icon: Icon,
              })
            }
          >
            <Icon className="size-4" />
          </button>
        ))}
      </div>
    </div>
  )
}

function Volume() {
  const volume = useSystemStore((s) => s.volume)
  const setVolume = useSystemStore((s) => s.setVolume)
  return (
    <div className={`${PANEL} right-24 flex h-14 w-72 items-center gap-3 px-4`}>
      <VolumeIcon className="size-5 shrink-0" />
      <Slider value={volume} onChange={setVolume} />
      <span className="w-8 text-right text-[13px]">{volume}</span>
    </div>
  )
}

function Network() {
  const wifiOn = useSystemStore((s) => s.wifiOn)
  const toggleWifi = useSystemStore((s) => s.toggleWifi)
  const toggleFlyout = useSystemStore((s) => s.toggleFlyout)
  return (
    <div className={`${PANEL} right-0 max-h-[420px] w-[340px] overflow-y-auto`}>
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
                  {i === 0 ? 'Connected, secured' : 'Secured'}
                </span>
              </span>
            </button>
          ))
        ) : (
          <p className="px-4 py-3 text-[13px] text-white/60">
            Wi-Fi is turned off.
          </p>
        )}
      </div>
      <button
        className="w-full border-t border-white/10 px-4 py-2.5 text-left text-[13px] text-white/80 hover:bg-white/10"
        onClick={() => toggleFlyout('actionCenter')}
      >
        Network & Internet settings
      </button>
    </div>
  )
}
