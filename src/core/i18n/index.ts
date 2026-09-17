import { useCallback } from 'react'
import { create } from 'zustand'
import { en, type MessageKey } from './en'
import { zh } from './zh'

/**
 * Display-language system. Strings live in `en.ts` / `zh.ts` as flat
 * key tables; components resolve them through `useT()`. Static config
 * (app titles, icon labels, fs type names, …) stores message *keys* —
 * `t()` resolves keys and passes non-key text through untouched, so a
 * window title can be either a key or a literal like "notes.txt - Notepad".
 *
 * To add a language: append an entry to LOCALES, add a `Messages`
 * table, and the compiler enforces completeness.
 */
export const LOCALES = [
  {
    id: 'en',
    name: 'English (United States)',
    short: 'ENG',
    sub: 'US keyboard',
  },
  { id: 'zh-CN', name: '中文 (简体)', short: '中', sub: '微软拼音' },
] as const

export type Locale = (typeof LOCALES)[number]['id']

const dicts: Record<Locale, Record<string, string>> = { en, 'zh-CN': zh }

const STORAGE_KEY = 'win10.locale'

function detect(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'zh-CN') return saved
  } catch {
    // localStorage unavailable — fall through to navigator detection.
  }
  return navigator.language?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en'
}

interface I18nStore {
  locale: Locale
  setLocale: (l: Locale) => void
}

export const useI18n = create<I18nStore>()((set) => ({
  locale: detect(),
  setLocale: (locale) => {
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // Private mode etc. — session-only locale is fine.
    }
    set({ locale })
  },
}))

/** Current display language, for date/number formatting. */
export function useLocale(): Locale {
  return useI18n((s) => s.locale)
}

/** Short tray label for the active locale ('ENG' / '中'). */
export function localeShort(locale: Locale): string {
  return LOCALES.find((l) => l.id === locale)?.short ?? 'ENG'
}

type Vars = Record<string, string | number>

/**
 * Translate a message key, substituting `{var}` placeholders.
 * Non-key input passes through unchanged so mixed key/literal fields
 * (e.g. window titles) resolve uniformly.
 */
export function useT() {
  const dict = dicts[useI18n((s) => s.locale)]
  return useCallback(
    (key: MessageKey | (string & {}), vars?: Vars): string => {
      let s: string = dict[key] ?? en[key as MessageKey] ?? key
      if (vars)
        for (const [k, v] of Object.entries(vars))
          s = s.replaceAll(`{${k}}`, String(v))
      return s
    },
    [dict],
  )
}
