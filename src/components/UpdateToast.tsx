import { useEffect, useState } from 'react'
import { useT } from '../core/i18n'
import { usePwaStore } from '../core/store/pwa'
import { useSystemStore } from '../core/store/system'
import { useWindowsStore } from '../core/store/windows'
import { CloseIcon, UpdateIcon } from './icons'

const COUNTDOWN = 10

/**
 * Windows-style notification card for an installed app update. Shown
 * when a new service worker takes control (see core/pwa.ts): it
 * counts down to an automatic restart while the desktop is idle —
 * but never tears down open windows; with apps running it waits for
 * the user instead. "Not now" defers to the next visit (the new
 * worker already controls the page, so the update applies anyway).
 */
export default function UpdateToast() {
  const updateReady = usePwaStore((s) => s.updateReady)
  const dismissed = usePwaStore((s) => s.updateDismissed)
  const dismiss = usePwaStore((s) => s.dismissUpdateToast)
  const autoUpdate = useSystemStore((s) => s.autoUpdate)
  const windows = useWindowsStore((s) => s.windows)
  const t = useT()
  const [count, setCount] = useState<number | null>(null)

  const auto = autoUpdate && windows.length === 0

  useEffect(() => {
    if (!updateReady || dismissed || !auto) {
      setCount(null)
      return
    }
    setCount(COUNTDOWN)
    const iv = setInterval(
      () => setCount((c) => (c === null || c <= 0 ? c : c - 1)),
      1000,
    )
    return () => clearInterval(iv)
  }, [updateReady, dismissed, auto])

  useEffect(() => {
    if (count === 0) window.location.reload()
  }, [count])

  if (!updateReady || dismissed) return null

  return (
    <div className="anim-toast-in fixed bottom-12 right-3 z-[75000] w-[340px] max-w-[calc(100vw-24px)] border border-black/60 bg-[#2b2b2b] text-white shadow-2xl">
      <div className="flex items-start gap-3 p-3.5">
        <UpdateIcon className="mt-0.5 size-5 shrink-0 text-[#4da6e8]" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium">{t('upd.toast.title')}</p>
          <p className="mt-0.5 text-[12px] leading-snug text-white/70">
            {count !== null
              ? t('upd.toast.countdown', { s: count })
              : t('upd.toast.body')}
          </p>
        </div>
        <button
          className="-mr-1.5 -mt-1.5 flex size-6 shrink-0 items-center justify-center hover:bg-white/10"
          onClick={dismiss}
          aria-label={t('aria.close')}
        >
          <CloseIcon className="size-3" />
        </button>
      </div>
      <div className="flex border-t border-white/10">
        <button
          className="flex-1 py-2 text-[12px] font-medium hover:bg-white/10"
          onClick={() => window.location.reload()}
        >
          {t('upd.toast.restart')}
        </button>
        <button
          className="flex-1 border-l border-white/10 py-2 text-[12px] text-white/80 hover:bg-white/10"
          onClick={dismiss}
        >
          {t('upd.toast.later')}
        </button>
      </div>
    </div>
  )
}
