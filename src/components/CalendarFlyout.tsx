import { useMemo } from 'react'
import { formatDateLong, useClock } from '../core/hooks'
import { useLocale, useT } from '../core/i18n'
import { useSystemStore } from '../core/store/system'

/** Clock flyout: digital time + mini month calendar. */
export default function CalendarFlyout({ exiting }: { exiting?: boolean }) {
  const now = useClock()
  const t = useT()
  const locale = useLocale()
  const accent = useSystemStore((s) => s.accent)
  const dow = t('cal.dow').split(' ')

  const { label, weeks, today } = useMemo(() => {
    const y = now.getFullYear()
    const m = now.getMonth()
    const label = now.toLocaleDateString(locale, {
      month: 'long',
      year: 'numeric',
    })
    const first = new Date(y, m, 1).getDay()
    const days = new Date(y, m + 1, 0).getDate()
    const cells: (number | null)[] = [
      ...Array(first).fill(null),
      ...Array.from({ length: days }, (_, i) => i + 1),
    ]
    while (cells.length % 7) cells.push(null)
    const weeks: (number | null)[][] = []
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
    return { label, weeks, today: now.getDate() }
  }, [now, locale])

  return (
    <div
      className={`${
        exiting ? 'anim-flyout-down' : 'anim-flyout-up'
      } absolute bottom-10 right-0 z-[55000] max-h-[calc(100%-40px)] w-[340px] max-w-full overflow-y-auto border-l border-black/60 bg-[#1f1f1f]/95 p-4 text-white shadow-2xl backdrop-blur-xl`}
    >
      <p className="text-[40px] font-extralight leading-none">
        {now.toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </p>
      <p className="mb-3 mt-1 text-[13px] text-white/70">
        {formatDateLong(now, locale)}
      </p>

      <div className="border-t border-white/15 pt-3">
        <p className="mb-2 px-1 text-[13px]">{label}</p>
        <div className="grid grid-cols-7 text-center">
          {dow.map((d) => (
            <span key={d} className="py-1 text-[11px] text-white/55">
              {d}
            </span>
          ))}
          {weeks.flat().map((d, i) => (
            <span
              key={i}
              className={`mx-auto flex size-8 items-center justify-center text-[12px] ${
                d === null
                  ? ''
                  : d === today
                    ? 'rounded-full font-semibold'
                    : 'rounded-full hover:bg-white/15'
              }`}
              style={d === today ? { background: accent } : undefined}
            >
              {d ?? ''}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 border-t border-white/15 pt-2.5 text-[12px] text-white/50">
        {t('cal.noEvents')}
      </div>
    </div>
  )
}
