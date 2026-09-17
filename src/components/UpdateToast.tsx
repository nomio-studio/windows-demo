import { useEffect } from 'react'
import { usePwaStore } from '../core/store/pwa'
import { CloseIcon, UpdateIcon } from './icons'

/**
 * Windows 10-style toast notification shown when a new service worker
 * is waiting — mirrors the real "Restart required" update prompt.
 */
export default function UpdateToast() {
  const updateReady = usePwaStore((s) => s.updateReady)
  const applyUpdate = usePwaStore((s) => s.applyUpdate)
  const dismiss = usePwaStore((s) => s.dismissUpdate)

  useEffect(() => {
    if (!updateReady) return
    const t = setTimeout(dismiss, 12000)
    return () => clearTimeout(t)
  }, [updateReady, dismiss])

  if (!updateReady) return null

  return (
    <div className="anim-toast-in fixed right-2 bottom-[52px] z-[60000] w-[360px] overflow-hidden rounded-sm border border-black/50 bg-[#202020] shadow-2xl">
      <div className="flex items-center gap-2 px-3 pt-2.5">
        <UpdateIcon className="h-4 w-4 text-[#0078D7]" />
        <span className="text-[11px] text-white/60">Windows Update</span>
        <button
          className="ml-auto rounded-sm p-0.5 text-white/70 hover:bg-white/10"
          onClick={dismiss}
          aria-label="Dismiss"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="px-3 pt-1 pb-3">
        <div className="text-[13px] font-semibold text-white">
          Restart required
        </div>
        <p className="mt-0.5 text-[12px] leading-snug text-white/75">
          An update was installed in the background. Restart to finish
          applying it.
        </p>
      </div>
      <div className="flex border-t border-white/10">
        <button
          className="flex-1 py-2 text-[12px] text-white hover:bg-white/10"
          onClick={applyUpdate}
        >
          Restart now
        </button>
        <button
          className="flex-1 border-l border-white/10 py-2 text-[12px] text-white/80 hover:bg-white/10"
          onClick={dismiss}
        >
          Not now
        </button>
      </div>
    </div>
  )
}
