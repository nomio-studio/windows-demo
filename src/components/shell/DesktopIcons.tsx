import { useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { desktopIcons, type DesktopIconEntry } from '../../config/shell'
import { useT } from '../../core/i18n'
import { useFsStore } from '../../core/fs/store'
import { DESKTOP_UI, TEXT_EXTS, extOf, resolve } from '../../core/fs/tree'
import { useWindowsStore } from '../../core/store/windows'
import { useSystemStore } from '../../core/store/system'
import { RecycleBinFullIcon } from '../icons'

const SIZES = {
  small: { box: 'w-[68px] py-0.5', icon: 'size-8', text: 'text-[10px]' },
  medium: { box: 'w-[80px] py-1', icon: 'size-12', text: 'text-[11px]' },
  large: { box: 'w-[96px] py-1.5', icon: 'size-16', text: 'text-xs' },
} as const

export interface IconActions {
  startRename: (id: string) => void
}

interface Props {
  onMenu: (
    e: ReactMouseEvent,
    entry: DesktopIconEntry | null,
    actions: IconActions,
  ) => void
}

/** Desktop icon grid: static icons + real files from the Desktop folder. */
export default function DesktopIcons({ onMenu }: Props) {
  const iconSize = useSystemStore((s) => s.desktopIconSize)
  const openApp = useWindowsStore((s) => s.openApp)
  const roots = useFsStore((s) => s.roots)
  const [selected, setSelected] = useState<string | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const rename = useFsStore((s) => s.rename)
  // Detect double-press manually: `dblclick` can be suppressed when the
  // element's animated state changes between presses, and is unreliable
  // on touch — two rapid `click`s on the same icon always arrive.
  const lastTap = useRef<{ id: string; t: number }>({ id: '', t: 0 })
  const sz = SIZES[iconSize]
  const t = useT()

  // Files/folders stored under Users/User/Desktop become desktop icons.
  const desktopNode = resolve(roots, DESKTOP_UI)
  const fileEntries: DesktopIconEntry[] = (desktopNode.children ?? []).map(
    (n) => {
      const text = n.kind === 'file' && TEXT_EXTS.has(extOf(n.name))
      return {
        id: `fs-${n.name}`,
        label: n.name,
        icon: n.icon,
        appId: n.kind === 'file' ? (text ? 'notepad' : 'explorer') : 'explorer',
        launch:
          n.kind === 'file' && text
            ? { path: [...DESKTOP_UI, n.name] }
            : { path: n.kind === 'file' ? DESKTOP_UI : [...DESKTOP_UI, n.name] },
        fs: n,
      }
    },
  )

  const binCount = roots['Recycle Bin']?.children?.length ?? 0
  const icons = [
    ...desktopIcons.map((d) =>
      d.id === 'bin' && binCount > 0 ? { ...d, icon: RecycleBinFullIcon } : d,
    ),
    ...fileEntries,
  ]

  const open = (d: DesktopIconEntry) => {
    if (d.fs?.kind === 'file' && !TEXT_EXTS.has(extOf(d.fs.name))) return
    openApp(d.appId, { launch: d.launch, title: d.title })
  }

  const commitRename = async (d: DesktopIconEntry, next: string) => {
    setRenaming(null)
    const name = next.trim()
    if (!d.fs || !name || name === d.fs.name) return
    await rename([...DESKTOP_UI, d.fs.name], name)
  }

  return (
    <div
      className="absolute inset-0 bottom-10 flex flex-col flex-wrap content-start gap-0.5 overflow-hidden p-1.5"
      onPointerDown={() => setSelected(null)}
      onContextMenu={(e) =>
        onMenu(e, null, { startRename: setRenaming })
      }
    >
      {icons.map((d, i) => (
        <button
          key={d.id}
          className={`anim-icon-in flex ${sz.box} shrink-0 flex-col items-center gap-1 rounded-[2px] border transition-[transform,background-color,border-color] duration-100 active:scale-95 ${
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
            if (last.id === d.id && now - last.t < 500) open(d)
          }}
          onContextMenu={(e) => {
            e.stopPropagation()
            setSelected(d.id)
            onMenu(e, d, { startRename: setRenaming })
          }}
        >
          <d.icon
            className={`${sz.icon} shrink-0 [filter:drop-shadow(0_1.5px_2px_rgba(0,0,0,0.35))]`}
          />
          {renaming === d.id && d.fs ? (
            <input
              autoFocus
              defaultValue={d.fs.name}
              className="w-full border border-[#0078d7] bg-white px-0.5 text-center text-[10px] text-black outline-none"
              onFocus={(e) => {
                const dot = d.fs!.name.lastIndexOf('.')
                e.target.setSelectionRange(0, dot > 0 ? dot : d.fs!.name.length)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void commitRename(d, e.currentTarget.value)
                if (e.key === 'Escape') setRenaming(null)
                e.stopPropagation()
              }}
              onBlur={(e) => void commitRename(d, e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className={`${sz.text} w-full break-words px-0.5 text-center leading-[1.15] text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]`}
            >
              {t(d.label)}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
