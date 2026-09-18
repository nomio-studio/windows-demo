import { useState } from 'react'
import { useT } from '../../core/i18n'
import type { MessageKey } from '../../core/i18n/en'
import { useSystemStore } from '../../core/store/system'
import { wifiNetworks } from '../../config/network'
import { CheckIcon, LockIcon, WifiIcon } from '../../components/icons'
import { PageHead, Row, SubNav, ToggleRow } from './shared'

type NetPage = 'wifi' | 'airplane' | 'vpn'

const PAGES: readonly { id: NetPage; name: MessageKey }[] = [
  { id: 'wifi', name: 'set.sub.wifi' },
  { id: 'airplane', name: 'set.sub.airplane' },
  { id: 'vpn', name: 'set.sub.vpn' },
]

/** Network & Internet > Wi-Fi | Airplane mode | VPN. */
export default function NetworkPage() {
  const [page, setPage] = useState<NetPage>('wifi')
  const t = useT()
  return (
    <div className="flex h-full">
      <SubNav
        items={PAGES.map((p) => ({ id: p.id, label: t(p.name) }))}
        active={page}
        onPick={setPage}
      />
      <div key={page} className="anim-fade min-w-0 flex-1 overflow-y-auto p-6">
        <div className="max-w-[540px]">
          {page === 'wifi' && <Wifi />}
          {page === 'airplane' && <Airplane />}
          {page === 'vpn' && <Vpn />}
        </div>
      </div>
    </div>
  )
}

function Wifi() {
  const t = useT()
  const wifiOn = useSystemStore((s) => s.wifiOn)
  const toggleWifi = useSystemStore((s) => s.toggleWifi)
  const wifiNetwork = useSystemStore((s) => s.wifiNetwork)
  const setWifiNetwork = useSystemStore((s) => s.setWifiNetwork)
  const airplane = useSystemStore((s) => s.quickActions.airplane)

  return (
    <>
      <PageHead title="Wi-Fi" sub={t('set.net.sub')} />
      {airplane && (
        <p className="mb-4 border border-[#e5c100] bg-[#fff4ce] px-3 py-2 text-[12.5px]">
          {t('set.net.airplaneWarn')}
        </p>
      )}
      <ToggleRow title="Wi-Fi" on={wifiOn && !airplane} onToggle={toggleWifi} />
      {wifiOn && !airplane ? (
        <>
          <p className="mb-2 mt-6 text-[13px] font-medium text-[#444]">
            {t('set.net.available')}
          </p>
          <div className="divide-y divide-[#eee] border border-[#e0e0e0]">
            {wifiNetworks.map((n) => {
              const connected = n.ssid === wifiNetwork
              return (
                <button
                  key={n.ssid}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-[#e5f3ff] ${
                    connected ? 'bg-[#cce8ff]' : ''
                  }`}
                  onClick={() => setWifiNetwork(n.ssid)}
                >
                  <WifiIcon
                    className={`size-4 shrink-0 ${
                      n.signal < 2 ? 'opacity-50' : ''
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px]">
                      {n.ssid}
                    </span>
                    <span className="block text-[11.5px] text-[#777]">
                      {connected
                        ? t('net.connected')
                        : n.secured
                          ? t('net.secured')
                          : t('net.open')}
                    </span>
                  </span>
                  {connected && <CheckIcon className="size-3.5 shrink-0" />}
                  {!connected && n.secured && (
                    <LockIcon className="size-3 shrink-0 opacity-50" />
                  )}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-[12px] text-[#777]">{t('set.net.hint')}</p>
        </>
      ) : (
        <p className="mt-6 text-[13px] text-[#888]">{t('net.off')}</p>
      )}
    </>
  )
}

function Airplane() {
  const t = useT()
  const quick = useSystemStore((s) => s.quickActions)
  const toggleQuick = useSystemStore((s) => s.toggleQuickAction)
  return (
    <>
      <PageHead title={t('set.net.airplane')} sub={t('set.net.airplane.sub')} />
      <ToggleRow
        title={t('set.net.airplane.mode')}
        desc={t('set.net.airplane.mode.desc')}
        on={!!quick.airplane}
        onToggle={() => toggleQuick('airplane')}
      />
      <Row title={t('set.net.airplane.radios')} desc={t('set.net.airplane.radios.desc')} />
    </>
  )
}

function Vpn() {
  const t = useT()
  const quick = useSystemStore((s) => s.quickActions)
  const toggleQuick = useSystemStore((s) => s.toggleQuickAction)
  const on = !!quick.vpn
  return (
    <>
      <PageHead title="VPN" sub={t('set.net.vpn.sub')} />
      <ToggleRow
        title={t('set.net.vpn.toggle')}
        desc="Contoso VPN — vpn.contoso.com"
        on={on}
        onToggle={() => toggleQuick('vpn')}
      />
      <Row
        title={t('set.net.vpn.status')}
        desc={on ? t('set.net.vpn.connected') : t('set.net.vpn.disconnected')}
      />
    </>
  )
}
