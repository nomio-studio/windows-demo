/* Shared building blocks for Settings category pages — a left sub-nav
   like Win10's section pages plus heading/row primitives so every page
   reads the same. */

import type { ReactNode } from 'react'
import { useT } from '../../core/i18n'
import { useSystemStore } from '../../core/store/system'
import { Toggle } from '../../components/ui'

/** Win10-style vertical sub-navigation inside a category page. */
export function SubNav<T extends string>({
  items,
  active,
  onPick,
}: {
  items: readonly { id: T; label: string }[]
  active: T
  onPick: (id: T) => void
}) {
  const accent = useSystemStore((s) => s.accent)
  return (
    <div className="w-40 shrink-0 border-r border-[#e8e8e8] py-2">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => onPick(it.id)}
          className={`relative block w-full px-4 py-1.5 text-left text-[12.5px] ${
            active === it.id ? 'font-semibold' : 'hover:bg-[#e5f3ff]'
          }`}
        >
          {active === it.id && (
            <span
              className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2"
              style={{ background: accent }}
            />
          )}
          {it.label}
        </button>
      ))}
    </div>
  )
}

/** Page heading + optional description. */
export function PageHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-[20px] font-light">{title}</h2>
      {sub && <p className="mt-1 text-[12.5px] text-[#777]">{sub}</p>}
    </div>
  )
}

/** A settings row: label (+ optional hint) on the left, control right. */
export function Row({
  title,
  desc,
  children,
}: {
  title: string
  desc?: string
  children?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-t border-[#eee] py-3.5 first:border-t-0">
      <div className="min-w-0">
        <p className="text-[13.5px]">{title}</p>
        {desc && <p className="mt-0.5 text-[12px] text-[#777]">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

/** Row whose control is an on/off switch bound to a boolean. */
export function ToggleRow({
  title,
  desc,
  on,
  onToggle,
}: {
  title: string
  desc?: string
  on: boolean
  onToggle: () => void
}) {
  const t = useT()
  return (
    <Row title={title} desc={desc}>
      <div className="flex items-center gap-2.5 pt-0.5">
        <span className="w-8 text-right text-[12px] text-[#777]">
          {on ? t('set.on') : t('set.off')}
        </span>
        <Toggle checked={on} onChange={onToggle} />
      </div>
    </Row>
  )
}
