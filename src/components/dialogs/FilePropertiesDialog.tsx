import { formatDateTime } from '../../core/hooks'
import { useLocale, useT } from '../../core/i18n'
import type { FsNode } from '../../core/fs/tree'
import { formatSize } from '../../core/fs/tree'

interface Props {
  node: FsNode
  /** UI path of the node's parent (shown as the location). */
  uiPath: string[]
  onClose: () => void
}

function winPath(uiPath: string[]): string {
  const segs = uiPath.filter(
    (s) => s !== 'This PC' && s !== 'Quick access' && s !== 'Local Disk (C:)',
  )
  return `C:\\${segs.join('\\')}`
}

/** Classic file Properties sheet: icon, type, location, size, dates. */
export default function FilePropertiesDialog({ node, uiPath, onClose }: Props) {
  const t = useT()
  const locale = useLocale()
  const rows: [string, string][] = [
    [t('prop.type'), t(node.type)],
    [
      t('prop.location'),
      node.bin
        ? node.bin.originalPath.length
          ? winPath(node.bin.originalPath.slice(0, -1))
          : '—'
        : winPath(uiPath),
    ],
    [
      t('prop.size'),
      node.kind === 'file'
        ? t('prop.sizeBytes', {
            size: formatSize(node.sizeBytes),
            bytes: node.sizeBytes.toLocaleString(locale),
          })
        : '—',
    ],
    [
      t('prop.modified'),
      node.modified ? formatDateTime(node.modified, locale) : '—',
    ],
  ]
  if (node.bin)
    rows.splice(1, 0, [
      t('prop.deleted'),
      node.bin.deletedAt ? formatDateTime(new Date(node.bin.deletedAt), locale) : '—',
    ])
  if (node.driveInfo)
    rows.push([
      t('prop.size'),
      `${formatSize(node.driveInfo.free)} / ${formatSize(node.driveInfo.total)}`,
    ])

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/20"
      onPointerDown={onClose}
    >
      <div
        className="anim-menu w-72 border border-[#888] bg-[#f0f0f0] shadow-xl"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="border-b border-[#d0d0d0] bg-[#f8f8f8] px-3 py-1.5 text-[12.5px]">
          {node.name} {t('prop.suffix')}
        </div>
        <div className="p-4">
          <div className="mb-4 flex items-center gap-3">
            <node.icon className="size-9 shrink-0" />
            <span className="break-all text-[13px] font-medium">
              {node.name}
            </span>
          </div>
          {rows.map(([k, v]) => (
            <div key={k} className="mb-2 flex text-[12px]">
              <span className="w-20 shrink-0 text-[#666]">{k}</span>
              <span className="min-w-0 break-all">{v}</span>
            </div>
          ))}
          <button
            className="mt-3 h-6 w-full border border-[#7a7a7a] bg-[#e1e1e1] text-[12px] hover:bg-[#e5f3ff]"
            onClick={onClose}
          >
            {t('prop.ok')}
          </button>
        </div>
      </div>
    </div>
  )
}
