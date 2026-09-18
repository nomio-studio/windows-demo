import { useState } from 'react'
import { formatDateLong, useClock } from '../../core/hooks'
import { LOCALES, useI18n, useLocale, useT } from '../../core/i18n'
import type { MessageKey } from '../../core/i18n/en'
import { useSystemStore } from '../../core/store/system'
import { PageHead, Row, SubNav, ToggleRow } from './shared'

type TimePage_ = 'datetime' | 'language'

const PAGES: readonly { id: TimePage_; name: MessageKey }[] = [
  { id: 'datetime', name: 'set.sub.datetime' },
  { id: 'language', name: 'set.sub.language' },
]

/** Time & Language > Date & time | Region & language. */
export default function TimePage() {
  const [page, setPage] = useState<TimePage_>('datetime')
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
          {page === 'datetime' && <DateTime />}
          {page === 'language' && <Language />}
        </div>
      </div>
    </div>
  )
}

function DateTime() {
  const t = useT()
  const locale = useLocale()
  const now = useClock()
  const quick = useSystemStore((s) => s.quickActions)
  const setQuick = useSystemStore((s) => s.setQuickAction)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const autoTime = quick.autoTime ?? true

  return (
    <>
      <PageHead title={t('set.time.datetime')} sub={t('set.time.datetime.sub')} />
      <div className="mb-5 border border-[#e0e0e0] px-4 py-5 text-center">
        <p className="text-[34px] font-extralight leading-none">
          {now.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })}
        </p>
        <p className="mt-1.5 text-[13px] text-[#777]">
          {formatDateLong(now, locale)}
        </p>
      </div>
      <ToggleRow
        title={t('set.time.auto')}
        desc={t('set.time.auto.desc')}
        on={autoTime}
        onToggle={() => setQuick('autoTime', !autoTime)}
      />
      <Row title={t('set.time.zone')} desc={tz ?? undefined} />
      <Row
        title={t('set.time.format')}
        desc={now.toLocaleDateString(locale, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
      />
    </>
  )
}

function Language() {
  const t = useT()
  const locale = useI18n((s) => s.locale)
  const setLocale = useI18n((s) => s.setLocale)
  const accent = useSystemStore((s) => s.accent)
  return (
    <>
      <PageHead title={t('set.time.region')} sub={t('set.time.displayLang')} />
      <div className="border border-[#e0e0e0]">
        {LOCALES.map((l) => (
          <button
            key={l.id}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#e5f3ff] ${
              locale === l.id ? 'bg-[#cce8ff]' : ''
            }`}
            onClick={() => setLocale(l.id)}
          >
            <span
              className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                locale === l.id ? '' : 'border-[#999]'
              }`}
              style={locale === l.id ? { borderColor: accent } : undefined}
            >
              {locale === l.id && (
                <span
                  className="size-2 rounded-full"
                  style={{ background: accent }}
                />
              )}
            </span>
            <span>
              <span className="block text-[13.5px]">{l.name}</span>
              <span className="block text-[11.5px] text-[#777]">{l.sub}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-[#777]">{t('set.time.note')}</p>
    </>
  )
}
