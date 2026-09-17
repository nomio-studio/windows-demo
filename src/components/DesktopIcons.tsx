import { useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { desktopIcons, type DesktopIconEntry } from '../config/shell'
import { useT } from '../core/i18n'
import { useWindowsStore } from '../core/store/windows'
import { useSystemStore } from '../core/store/system'

const SIZES = {
  small: { box: 'w-[62px] py-0.5', icon: 'size-5', text: 'text-[10px]' },
  medium: { box: 'w-[74px] py-1', icon: 'size-7', text: 'text-[11px]' },
  large: { box: 'w-[86px] py-1.5', icon: 'size-10', text: 'text-[11px]' },
} as const

interface Props {
  onMenu: (e: ReactMouseEvent, entry: DesktopIconEntry | null) => void
}

/** Desktop icon grid: columns fill top-down then wrap right. */
export default function DesktopIcons({ onMenu }: Props) {
  const iconSize = useSystemStore((s) => s.desktopIconSize)
  const openApp = useWindowsStore((s) => s.openApp)
  const [selected, setSelected] = useState<string | null>(null)
  // Detect double-press manually: `dblclick` can be suppressed when the
  // element's animated state changes between presses, and is unreliable
  // on touch — two rapid `click`s on the same icon always arrive.
  const lastTap = useRef<{ id: string; t: number }>({ id: '', t: 0 })
  const sz = SIZES[iconSize]
  const t = useT()

  return (
    <div
      className="absolute inset-0 bottom-10 flex flex-col flex-wrap content-start gap-0.5 overflow-hidden p-1.5"
      onPointerDown={() => setSelected(null)}
      onContextMenu={(e) => onMenu(e, null)}
    >
      {desktopIcons.map((d, i) => (
        <button
          key={d.id}
          className={`anim-icon-in flex ${sz.box} shrink-0 flex-col items-center gap-1 rounded-[2px] border transition-transform active:scale-95 ${
            selected === d.id
              ? 'border-[#7ab8ec]/70 bg-[#0078d7]/30'
              : 'border-transparent hover:border-white/25 hover:bg-white/10'
          }`}
          style={{ animationDelay: `${i * 45}ms` }}
          onPointerDown={(e) => {
            e.stopPropagation()
            setSelected(d.id)
          }}
          onClick={() => {
            const now = performance.now()
            const last = lastTap.current
            lastTap.current = { id: d.id, t: now }
            if (last.id === d.id && now - last.t < 500) {
              openApp(d.appId, { launch: d.launch, title: d.title })
            }
          }}
          onContextMenu={(e) => {
            e.stopPropagation()
            setSelected(d.id)
            onMenu(e, d)
          }}
        >
          <d.icon className={`${sz.icon} shrink-0`} />
          <span
            className={`${sz.text} w-full break-words px-0.5 text-center leading-[1.15] text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]`}
          >
            {t(d.label)}
          </span>
        </button>
      ))}
    </div>
  )
}
