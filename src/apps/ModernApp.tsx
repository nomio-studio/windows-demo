import { useT } from '../core/i18n'
import { getApp } from '../core/registry'
import { useWindowsStore } from '../core/store/windows'
import type { AppProps } from '../core/types'

/**
 * Generic modern-app placeholder. Reads its own window's identity
 * (title/icon/color overrides via `openApp` options) so one component
 * can stand in for any store app.
 */
export default function ModernApp({ windowId, launch }: AppProps) {
  const win = useWindowsStore((s) => s.windows.find((w) => w.id === windowId))
  const app = win ? getApp(win.appId) : undefined
  const launchColor = (launch as { color?: string } | undefined)?.color
  const color = launchColor ?? app?.color ?? '#0078D7'
  const Icon = win?.icon ?? app?.icon
  const t = useT()
  const name = t(win?.title ?? app?.title ?? 'app.modern')

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 bg-[#fafafa] text-black">
      <div
        className="flex size-24 items-center justify-center shadow-md"
        style={{ background: color }}
      >
        {Icon && <Icon className="size-12 text-white" />}
      </div>
      <p className="text-[22px] font-light">{name}</p>
      <div className="h-px w-40" style={{ background: color }} />
      <p className="text-[13px] text-[#888]">
        {t('modern.placeholder')}
      </p>
    </div>
  )
}
