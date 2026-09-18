import { useEffect, useState } from 'react'
import { useT } from '../../core/i18n'
import type { MessageKey } from '../../core/i18n/en'
import { formatSize } from '../../core/fs/tree'
import { useFsStore } from '../../core/fs/store'
import { useSystemStore } from '../../core/store/system'
import { Slider } from '../../components/ui'
import { VolumeIcon } from '../../components/icons'
import { PageHead, Row, SubNav, ToggleRow } from './shared'

type SysPage = 'display' | 'sound' | 'storage' | 'about'

const PAGES: readonly { id: SysPage; name: MessageKey }[] = [
  { id: 'display', name: 'set.sub.display' },
  { id: 'sound', name: 'set.sub.sound' },
  { id: 'storage', name: 'set.sub.storage' },
  { id: 'about', name: 'set.sub.about' },
]

/** System > Display | Sound | Storage | About. */
export default function SystemPage() {
  const [page, setPage] = useState<SysPage>('display')
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
          {page === 'display' && <Display />}
          {page === 'sound' && <Sound />}
          {page === 'storage' && <Storage />}
          {page === 'about' && <About />}
        </div>
      </div>
    </div>
  )
}

function Display() {
  const t = useT()
  const brightness = useSystemStore((s) => s.brightness)
  const setBrightness = useSystemStore((s) => s.setBrightness)
  const quick = useSystemStore((s) => s.quickActions)
  const toggleQuick = useSystemStore((s) => s.toggleQuickAction)
  const iconSize = useSystemStore((s) => s.desktopIconSize)
  const setIconSize = useSystemStore((s) => s.setDesktopIconSize)

  return (
    <>
      <PageHead title={t('set.display')} sub={t('set.display.sub')} />
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13.5px]">{t('set.brightness')}</span>
          <span className="text-[12px] text-[#777]">{brightness}%</span>
        </div>
        <Slider value={brightness} onChange={setBrightness} />
        <p className="mt-1.5 text-[12px] text-[#777]">
          {t('set.brightness.desc')}
        </p>
      </div>
      <ToggleRow
        title={t('set.nightlight')}
        desc={t('set.nightlight.desc')}
        on={!!quick.nightlight}
        onToggle={() => toggleQuick('nightlight')}
      />
      <Row title={t('set.scale')} desc={t('set.scale.desc')}>
        <select
          value={iconSize}
          onChange={(e) =>
            setIconSize(e.target.value as 'small' | 'medium' | 'large')
          }
          className="h-7 border border-[#adadad] bg-white px-1.5 text-[12.5px]"
        >
          <option value="small">{t('set.scale.small')}</option>
          <option value="medium">{t('set.scale.medium')}</option>
          <option value="large">{t('set.scale.large')}</option>
        </select>
      </Row>
    </>
  )
}

function Sound() {
  const t = useT()
  const volume = useSystemStore((s) => s.volume)
  const setVolume = useSystemStore((s) => s.setVolume)
  return (
    <>
      <PageHead title={t('set.sound')} sub={t('set.sound.sub')} />
      <Row title={t('set.sound.output')} desc={t('set.sound.outputName')}>
        <VolumeIcon className="mt-0.5 size-5 text-[#555]" />
      </Row>
      <div className="mt-2">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13.5px]">{t('set.sound.volume')}</span>
          <span className="text-[12px] text-[#777]">{volume}</span>
        </div>
        <div className="flex items-center gap-3">
          <Slider
            value={volume}
            onChange={setVolume}
          />
          <button
            className="shrink-0 border border-[#adadad] px-3 py-1 text-[12px] hover:bg-[#e5f1fb]"
            onClick={() => setVolume(volume === 0 ? 60 : 0)}
          >
            {volume === 0 ? t('set.sound.unmute') : t('set.sound.mute')}
          </button>
        </div>
      </div>
    </>
  )
}

function Storage() {
  const t = useT()
  const roots = useFsStore((s) => s.roots)
  const [quota, setQuota] = useState<{ used: number; total: number } | null>(
    null,
  )

  useEffect(() => {
    let live = true
    void navigator.storage?.estimate?.().then((e) => {
      if (live && e) setQuota({ used: e.usage ?? 0, total: e.quota ?? 0 })
    })
    return () => {
      live = false
    }
  }, [])

  const drives = (roots['This PC']?.children ?? []).filter(
    (n) => n.kind === 'drive' && n.driveInfo,
  )

  return (
    <>
      <PageHead title={t('set.storage')} sub={t('set.storage.sub')} />
      {drives.map((d) => {
        const info = d.driveInfo!
        const used = info.total - info.free
        const pct = info.total ? Math.min(100, (used / info.total) * 100) : 0
        return (
          <div key={d.name} className="mb-5">
            <p className="mb-1 text-[13.5px]">
              {d.labelKey ? t(d.labelKey) : d.name}
            </p>
            <div className="h-4 w-full border border-[#adadad] bg-white p-[2px]">
              <div className="h-full bg-[#26a0da]" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1 text-[12px] text-[#777]">
              {t('set.storage.free', {
                free: formatSize(info.free),
                total: formatSize(info.total),
              })}
            </p>
          </div>
        )
      })}
      {quota && quota.total > 0 && (
        <p className="mt-6 border-t border-[#eee] pt-3 text-[12px] text-[#777]">
          {t('set.storage.browser', {
            used: formatSize(quota.used),
            total: formatSize(quota.total),
          })}
        </p>
      )}
    </>
  )
}

function About() {
  const t = useT()
  const cores = navigator.hardwareConcurrency
  const rows: [MessageKey, string][] = [
    ['set.about.device', 'DESKTOP-WIN10'],
    ['set.about.edition', 'Windows 10 Pro (Web)'],
    ['set.about.version', '22H2'],
    [
      'set.about.build',
      `${__APP_VERSION__} · React 19`,
    ],
    [
      'set.about.cpu',
      cores
        ? t('set.about.cpu.val', { n: cores })
        : 'Web Engine',
    ],
    ['set.about.ram', '8.0 GB'],
  ]
  return (
    <>
      <PageHead title={t('set.about')} />
      <dl className="space-y-2 text-[13px]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <dt className="w-32 shrink-0 text-[#777]">{t(k)}</dt>
            <dd className="min-w-0 flex-1">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 text-[12px] text-[#777]">{t('set.about.note')}</p>
    </>
  )
}
