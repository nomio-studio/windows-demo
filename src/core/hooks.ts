import { useEffect, useState } from 'react'
import type { Locale } from './i18n'

/** Live-updating clock. */
export function useClock(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs])
  return now
}

/** Run a handler when Escape is pressed. */
export function useEscape(handler: () => void, active = true): void {
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handler, active])
}

const two = (n: number) => String(n).padStart(2, '0')

/** Taskbar clock: '4:12 PM' in English, '16:12' in Chinese. */
export function formatTime(d: Date, locale: Locale): string {
  if (locale === 'zh-CN') return `${two(d.getHours())}:${two(d.getMinutes())}`
  let h = d.getHours()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${two(d.getMinutes())} ${ampm}`
}

/** Lock-screen clock: '4:12' in English, '16:12' in Chinese. */
export function formatTimeShort(d: Date, locale: Locale): string {
  const h =
    locale === 'zh-CN' ? d.getHours() : d.getHours() % 12 || 12
  return `${h}:${two(d.getMinutes())}`
}

/** Taskbar date: '9/10/2026' (en) / '2026/9/10' (zh). */
export function formatDate(d: Date, locale: Locale): string {
  return d.toLocaleDateString(locale, {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  })
}

/** 'Thursday, September 10, 2026' / '2026年9月10日星期四'. */
export function formatDateLong(d: Date, locale: Locale): string {
  return d.toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/** File-listing timestamp: '9/10/2026, 4:12 PM' / '2026/9/10 16:12'. */
export function formatDateTime(d: Date, locale: Locale): string {
  return d.toLocaleString(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}
