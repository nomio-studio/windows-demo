import { useState } from 'react'
import { useT } from '../../core/i18n'
import type { MessageKey } from '../../core/i18n/en'
import { useSystemStore } from '../../core/store/system'
import {
  CameraIcon,
  LocationIcon,
  MicIcon,
} from '../../components/icons'
import type { IconType } from '../../core/types'
import { PageHead, SubNav, ToggleRow } from './shared'

type PrivPage = 'general' | 'location' | 'camera' | 'microphone'

const PAGES: readonly { id: PrivPage; name: MessageKey }[] = [
  { id: 'general', name: 'set.sub.general' },
  { id: 'location', name: 'set.sub.location' },
  { id: 'camera', name: 'set.sub.camera' },
  { id: 'microphone', name: 'set.sub.microphone' },
]

/** Privacy > General | Location | Camera | Microphone. */
export default function PrivacyPage() {
  const [page, setPage] = useState<PrivPage>('general')
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
          {page === 'general' && <General />}
          {page === 'location' && (
            <DeviceAccess
              title={t('set.priv.location')}
              sub={t('set.priv.location.sub')}
              storeKey="location"
              icon={LocationIcon}
              apps={['app.maps', 'app.weather']}
            />
          )}
          {page === 'camera' && (
            <DeviceAccess
              title={t('set.priv.camera')}
              sub={t('set.priv.camera.sub')}
              storeKey="camera"
              icon={CameraIcon}
              apps={['app.camera']}
            />
          )}
          {page === 'microphone' && (
            <DeviceAccess
              title={t('set.priv.mic')}
              sub={t('set.priv.mic.sub')}
              storeKey="microphone"
              icon={MicIcon}
              apps={['app.voicerec']}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function General() {
  const t = useT()
  const quick = useSystemStore((s) => s.quickActions)
  const toggleQuick = useSystemStore((s) => s.toggleQuickAction)
  return (
    <>
      <PageHead title={t('set.priv.general')} sub={t('set.priv.general.sub')} />
      <ToggleRow
        title={t('set.priv.ads')}
        desc={t('set.priv.ads.desc')}
        on={!!quick.advertisingId}
        onToggle={() => toggleQuick('advertisingId')}
      />
      <ToggleRow
        title={t('set.priv.speech')}
        desc={t('set.priv.speech.desc')}
        on={!!quick.speechServices}
        onToggle={() => toggleQuick('speechServices')}
      />
      <ToggleRow
        title={t('set.priv.ink')}
        desc={t('set.priv.ink.desc')}
        on={!!quick.inkPersonal}
        onToggle={() => toggleQuick('inkPersonal')}
      />
      <ToggleRow
        title={t('set.priv.diag')}
        desc={t('set.priv.diag.desc')}
        on={!!quick.diagnostics}
        onToggle={() => toggleQuick('diagnostics')}
      />
    </>
  )
}

function DeviceAccess({
  title,
  sub,
  storeKey,
  icon: Icon,
  apps,
}: {
  title: string
  sub: string
  storeKey: string
  icon: IconType
  apps: MessageKey[]
}) {
  const t = useT()
  const quick = useSystemStore((s) => s.quickActions)
  const toggleQuick = useSystemStore((s) => s.toggleQuickAction)
  const on = !!quick[storeKey]
  return (
    <>
      <PageHead title={title} sub={sub} />
      <div className="mb-5 flex items-center gap-3 border border-[#e0e0e0] p-4">
        <Icon className="size-10 shrink-0 text-[#0078d7]" />
        <p className="text-[12.5px] text-[#555]">
          {on ? t('set.priv.access.on') : t('set.priv.access.off')}
        </p>
      </div>
      <ToggleRow
        title={t('set.priv.access')}
        desc={t('set.priv.access.desc')}
        on={on}
        onToggle={() => toggleQuick(storeKey)}
      />
      {on && (
        <>
          <p className="mb-2 mt-5 text-[13px] font-medium text-[#444]">
            {t('set.priv.apps')}
          </p>
          <div className="divide-y divide-[#eee] border border-[#e0e0e0]">
            {apps.map((a) => (
              <div key={a} className="flex items-center px-3 py-2">
                <span className="text-[13px]">{t(a)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
