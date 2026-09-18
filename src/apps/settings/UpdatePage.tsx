import { useState } from 'react'
import { useLocale, useT } from '../../core/i18n'
import type { MessageKey } from '../../core/i18n/en'
import { usePwaStore } from '../../core/store/pwa'
import { useSystemStore } from '../../core/store/system'
import {
  CheckIcon,
  DownloadIcon,
  RefreshIcon,
  ShieldTaskIcon,
} from '../../components/icons'
import { PageHead, Row, SubNav, ToggleRow } from './shared'

type UpdPage = 'windowsupdate' | 'security' | 'recovery'

const PAGES: readonly { id: UpdPage; name: MessageKey }[] = [
  { id: 'windowsupdate', name: 'set.sub.windowsupdate' },
  { id: 'security', name: 'set.sub.security' },
  { id: 'recovery', name: 'set.sub.recovery' },
]

/** Update & Security > Windows Update | Windows Security | Recovery. */
export default function UpdatePage() {
  const [page, setPage] = useState<UpdPage>('windowsupdate')
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
          {page === 'windowsupdate' && <WindowsUpdate />}
          {page === 'security' && <Security />}
          {page === 'recovery' && <Recovery />}
        </div>
      </div>
    </div>
  )
}

const fmt = (ms: number, locale: string) =>
  new Date(ms).toLocaleString(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

function WindowsUpdate() {
  const t = useT()
  const updateReady = usePwaStore((s) => s.updateReady)
  const checking = usePwaStore((s) => s.checking)
  const setChecking = usePwaStore((s) => s.setChecking)
  const lastCheck = usePwaStore((s) => s.lastCheck)
  const setLastCheck = usePwaStore((s) => s.setLastCheck)
  const autoUpdate = useSystemStore((s) => s.autoUpdate)
  const setAutoUpdate = useSystemStore((s) => s.setAutoUpdate)
  const accent = useSystemStore((s) => s.accent)
  const locale = useLocale()

  const check = async () => {
    setChecking(true)
    try {
      const reg = await navigator.serviceWorker?.getRegistration()
      // Keep the spinner visible briefly so the click has feedback.
      await Promise.all([
        reg?.update(),
        new Promise((r) => setTimeout(r, 900)),
      ])
      // controllerchange marks updateReady if a new worker took over.
      setLastCheck({ at: Date.now(), result: 'latest' })
    } catch {
      setLastCheck({ at: Date.now(), result: 'error' })
    } finally {
      setChecking(false)
    }
  }

  return (
    <>
      <PageHead title={t('set.upd.title')} sub={t('set.upd.sub')} />

      {/* Status card */}
      {updateReady ? (
        <div className="mb-5 flex items-start gap-3 border border-[#e5a000] bg-[#fff4ce] px-4 py-3">
          <DownloadIcon className="mt-0.5 size-5 shrink-0 text-[#8a6d00]" />
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-medium">
              {t('set.upd.ready.title')}
            </p>
            <p className="mt-0.5 text-[12px] text-[#6b5a1e]">
              {autoUpdate
                ? t('set.upd.ready.auto')
                : t('set.upd.ready.manual')}
            </p>
          </div>
          <button
            className="shrink-0 border border-[#8a6d00] bg-white/60 px-3 py-1 text-[12.5px] hover:bg-white"
            onClick={() => window.location.reload()}
          >
            {t('set.upd.restart')}
          </button>
        </div>
      ) : (
        <div className="mb-5 flex items-start gap-3 border border-[#e0e0e0] px-4 py-3">
          <span
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-white"
            style={{ background: checking ? '#8a8a8a' : accent }}
          >
            {checking ? (
              <RefreshIcon className="size-3 animate-spin" />
            ) : (
              <CheckIcon className="size-3" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-medium">
              {checking
                ? t('set.upd.checking')
                : lastCheck?.result === 'error'
                  ? t('set.upd.error')
                  : t('set.upd.latest')}
            </p>
            <p className="mt-0.5 text-[12px] text-[#777]">
              {lastCheck
                ? t('set.upd.lastcheck', {
                    at: fmt(lastCheck.at, locale),
                  })
                : t('set.upd.never')}
            </p>
          </div>
        </div>
      )}

      <button
        className="mb-5 border border-[#adadad] px-4 py-1.5 text-[13px] enabled:hover:bg-[#e5f1fb] disabled:opacity-50"
        disabled={checking}
        onClick={() => void check()}
      >
        {checking ? t('set.upd.checking') : t('set.upd.check')}
      </button>

      <ToggleRow
        title={t('set.upd.auto')}
        desc={t('set.upd.auto.desc')}
        on={autoUpdate}
        onToggle={() => setAutoUpdate(!autoUpdate)}
      />
      <Row
        title={t('set.upd.channel')}
        desc={t('set.upd.channel.val', { v: __APP_VERSION__ })}
      />
    </>
  )
}

function Security() {
  const t = useT()
  const shields: { name: MessageKey; desc: MessageKey }[] = [
    { name: 'set.sec.virus', desc: 'set.sec.virus.desc' },
    { name: 'set.sec.firewall', desc: 'set.sec.firewall.desc' },
    { name: 'set.sec.app', desc: 'set.sec.app.desc' },
    { name: 'set.sec.device', desc: 'set.sec.device.desc' },
  ]
  return (
    <>
      <PageHead title={t('set.sec.title')} sub={t('set.sec.sub')} />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {shields.map((s) => (
          <div key={s.name} className="flex gap-3 border border-[#e0e0e0] p-3.5">
            <ShieldTaskIcon className="size-6 shrink-0 text-[#107c10]" />
            <div className="min-w-0">
              <p className="text-[13px] font-medium">{t(s.name)}</p>
              <p className="mt-0.5 text-[11.5px] text-[#777]">{t(s.desc)}</p>
              <p className="mt-1 flex items-center gap-1 text-[11.5px] text-[#107c10]">
                <CheckIcon className="size-3" />
                {t('set.sec.ok')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function Recovery() {
  const t = useT()
  const setPhase = useSystemStore((s) => s.setPhase)
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <>
      <PageHead title={t('set.rec.title')} sub={t('set.rec.sub')} />
      <div className="mb-5 border border-[#e0e0e0] p-4">
        <p className="text-[13.5px] font-medium">{t('set.rec.reset')}</p>
        <p className="mb-3 mt-1 text-[12px] text-[#777]">
          {t('set.rec.reset.desc')}
        </p>
        {confirmReset ? (
          <div className="flex items-center gap-2">
            <button
              className="border border-[#b02a2a] bg-[#d13438] px-4 py-1.5 text-[12.5px] text-white hover:bg-[#b02a2a]"
              onClick={() => {
                localStorage.removeItem('win10.prefs')
                window.location.reload()
              }}
            >
              {t('set.rec.reset.confirm')}
            </button>
            <button
              className="border border-[#adadad] px-4 py-1.5 text-[12.5px] hover:bg-[#e5f1fb]"
              onClick={() => setConfirmReset(false)}
            >
              {t('set.rec.cancel')}
            </button>
          </div>
        ) : (
          <button
            className="border border-[#adadad] px-4 py-1.5 text-[12.5px] hover:bg-[#e5f1fb]"
            onClick={() => setConfirmReset(true)}
          >
            {t('set.rec.reset.btn')}
          </button>
        )}
      </div>
      <div className="border border-[#e0e0e0] p-4">
        <p className="text-[13.5px] font-medium">{t('set.rec.advanced')}</p>
        <p className="mb-3 mt-1 text-[12px] text-[#777]">
          {t('set.rec.advanced.desc')}
        </p>
        <button
          className="border border-[#adadad] px-4 py-1.5 text-[12.5px] hover:bg-[#e5f1fb]"
          onClick={() => setPhase('restart')}
        >
          {t('set.rec.restart')}
        </button>
      </div>
    </>
  )
}
