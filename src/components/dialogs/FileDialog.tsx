import { useMemo, useState } from 'react'
import { useT } from '../../core/i18n'
import { useFsStore } from '../../core/fs/store'
import { extOf, resolve, type FsNode } from '../../core/fs/tree'
import {
  BackIcon,
  ChevronRight,
  FolderIcon,
  UpIcon,
} from '../icons'

export interface FileDialogResult {
  /** UI path of the chosen directory. */
  dir: string[]
  /** File name (open/save modes). */
  name?: string
}

interface Props {
  mode: 'open' | 'save' | 'folder'
  title: string
  /** Extensions like '.txt' — only matching files show in open mode. */
  filter?: string[]
  /** UI path to start in. */
  initialDir?: string[]
  initialName?: string
  /** Action button label. */
  actionLabel: string
  onPick: (r: FileDialogResult) => void
  onClose: () => void
}

const PLACES: { labelKey: string; path: string[] }[] = [
  { labelKey: 'fs.desktop', path: ['Quick access', 'Desktop'] },
  { labelKey: 'fs.documents', path: ['Quick access', 'Documents'] },
  { labelKey: 'fs.downloads', path: ['Quick access', 'Downloads'] },
  { labelKey: 'fs.pictures', path: ['Quick access', 'Pictures'] },
  { labelKey: 'fs.thisPC', path: ['This PC'] },
]

/**
 * Classic Windows common-file dialog, rendered as an overlay inside an
 * app window. `open` picks an existing file, `save` picks a directory +
 * file name, `folder` picks a destination directory.
 */
export default function FileDialog({
  mode,
  title,
  filter,
  initialDir,
  initialName,
  actionLabel,
  onPick,
  onClose,
}: Props) {
  const roots = useFsStore((s) => s.roots)
  const t = useT()
  const [hist, setHist] = useState<string[][]>([
    initialDir ?? ['Quick access', 'Documents'],
  ])
  const [hi, setHi] = useState(0)
  const [sel, setSel] = useState<string | null>(null)
  const [name, setName] = useState(initialName ?? '')
  const dir = hist[hi]
  const node = resolve(roots, dir)

  const items = useMemo(() => {
    const kids = node.children ?? []
    const dirs = kids.filter((n) => n.kind !== 'file')
    const files =
      mode === 'folder'
        ? []
        : kids.filter(
            (n) =>
              n.kind === 'file' &&
              (!filter?.length || filter.includes(`.${extOf(n.name)}`)),
          )
    return [...dirs, ...files]
  }, [node, mode, filter])

  const navigate = (p: string[]) => {
    const nh = [...hist.slice(0, hi + 1), p]
    setHist(nh)
    setHi(nh.length - 1)
    setSel(null)
  }

  const openItem = (n: FsNode) => {
    if (n.kind === 'file') {
      if (mode !== 'folder') {
        setSel(n.name)
        setName(n.name)
        if (mode === 'open') onPick({ dir, name: n.name })
      }
      return
    }
    navigate([...dir, n.name])
  }

  const canAct = mode === 'folder' || name.trim().length > 0
  const nameOf = (n: FsNode) => t(n.labelKey ?? n.name)

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-[#f0f0f0] text-black">
      {/* Title + address row */}
      <div className="flex h-8 shrink-0 items-center gap-1 border-b border-[#d0d0d0] bg-[#f8f8f8] px-2">
        <span className="mr-1 truncate text-[12.5px] font-medium">{title}</span>
        <div className="ml-auto flex items-center gap-0.5">
          <button
            className="flex size-6 items-center justify-center text-[#333] hover:bg-[#e0e0e0] disabled:text-[#b8b8b8]"
            onClick={() => hi > 0 && setHi(hi - 1)}
            disabled={hi === 0}
            aria-label={t('aria.back')}
          >
            <BackIcon className="size-3.5" />
          </button>
          <button
            className="flex size-6 items-center justify-center text-[#333] hover:bg-[#e0e0e0] disabled:text-[#b8b8b8]"
            onClick={() => dir.length > 1 && navigate(dir.slice(0, -1))}
            disabled={dir.length <= 1}
            aria-label={t('aria.up')}
          >
            <UpIcon className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="flex h-7 shrink-0 items-center gap-0.5 border-b border-[#e0e0e0] bg-white px-2 text-[12px]">
        {dir.map((seg, i) => (
          <span key={i} className="flex items-center">
            {i > 0 && <ChevronRight className="mx-0.5 size-2.5 text-[#999]" />}
            <button
              className="px-1 hover:bg-[#e5f3ff]"
              onClick={() => navigate(dir.slice(0, i + 1))}
            >
              {seg}
            </button>
          </span>
        ))}
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        <div className="w-32 shrink-0 overflow-y-auto border-r border-[#e0e0e0] bg-[#f5f6f7] py-1">
          {PLACES.map((p) => (
            <button
              key={p.labelKey}
              className={`flex w-full items-center gap-1.5 px-2 py-[3px] text-left text-[12px] ${
                dir.join('/') === p.path.join('/')
                  ? 'bg-[#cce8ff]'
                  : 'hover:bg-[#e5f3ff]'
              }`}
              onClick={() => navigate(p.path)}
            >
              <FolderIcon className="size-3.5 shrink-0" />
              <span className="truncate">{t(p.labelKey)}</span>
            </button>
          ))}
        </div>
        <div className="min-w-0 flex-1 overflow-y-auto bg-white p-1">
          {items.length === 0 ? (
            <p className="p-4 text-center text-[12px] text-[#888]">
              {t('dlg.empty')}
            </p>
          ) : (
            items.map((n) => (
              <button
                key={n.name}
                className={`flex w-full items-center gap-1.5 px-2 py-[3px] text-left text-[12.5px] ${
                  sel === n.name ? 'bg-[#cce8ff]' : 'hover:bg-[#e5f3ff]'
                }`}
                onClick={() => {
                  setSel(n.name)
                  if (n.kind === 'file') setName(n.name)
                }}
                onDoubleClick={() => openItem(n)}
              >
                <n.icon className="size-4 shrink-0" />
                <span className="truncate">{nameOf(n)}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center gap-2 border-t border-[#d0d0d0] bg-[#f0f0f0] px-3 py-2.5">
        {mode !== 'folder' && (
          <>
            <span className="shrink-0 text-[12px]">{t('dlg.name')}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-6 min-w-0 flex-1 border border-[#a0a0a0] bg-white px-1.5 text-[12px] outline-none focus:border-[#0078d7]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && canAct)
                  onPick({ dir, name: name.trim() })
              }}
            />
          </>
        )}
        <div className="ml-auto flex gap-2">
          <button
            disabled={!canAct}
            className="h-6 border border-[#7a7a7a] bg-[#e1e1e1] px-4 text-[12px] hover:bg-[#e5f3ff] disabled:text-[#a0a0a0] disabled:hover:bg-[#e1e1e1]"
            onClick={() =>
              onPick(mode === 'folder' ? { dir } : { dir, name: name.trim() })
            }
          >
            {actionLabel}
          </button>
          <button
            className="h-6 border border-[#7a7a7a] bg-[#e1e1e1] px-4 text-[12px] hover:bg-[#e5f3ff]"
            onClick={onClose}
          >
            {t('dlg.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
