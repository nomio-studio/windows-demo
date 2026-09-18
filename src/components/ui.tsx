/* Small shared controls used across flyouts and apps. */

import { useEffect, useState, type ReactNode } from 'react'
import { useSystemStore } from '../core/store/system'

/**
 * Keeps `value` mounted briefly after it goes null so an outro
 * animation can finish. Children render with the last non-null value
 * plus an `exiting` flag so they can swap their enter class for an
 * exit one. Switching between two non-null values swaps instantly.
 */
export function Presence<T>({
  value,
  ms = 140,
  children,
}: {
  value: T | null | undefined
  ms?: number
  children: (value: NonNullable<T>, exiting: boolean) => ReactNode
}) {
  const [last, setLast] = useState<NonNullable<T> | null>(null)
  useEffect(() => {
    if (value) {
      setLast(value as NonNullable<T>)
      return
    }
    if (!last) return
    const t = setTimeout(() => setLast(null), ms)
    return () => clearTimeout(t)
  }, [value, last, ms])
  const shown = (value ?? last) as NonNullable<T> | null
  return shown ? children(shown, !value) : null
}

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  const accent = useSystemStore((s) => s.accent)
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-5 w-11 shrink-0 rounded-full border transition-colors ${
        checked ? '' : 'border-current bg-transparent opacity-80'
      }`}
      style={
        checked
          ? { borderColor: accent, backgroundColor: accent }
          : undefined
      }
    >
      <span
        className={`absolute top-1/2 size-3 -translate-y-1/2 rounded-full transition-all ${
          checked ? 'right-[3px] bg-white' : 'left-[3px] bg-current'
        }`}
      />
    </button>
  )
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
}: {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
}) {
  const accent = useSystemStore((s) => s.accent)
  const pct = ((value - min) / (max - min)) * 100
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
      style={{
        background: `linear-gradient(to right, ${accent} ${pct}%, #6a6a6a ${pct}%)`,
      }}
    />
  )
}
