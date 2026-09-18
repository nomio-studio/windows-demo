import { formatDateTime } from '../../core/hooks'
import { formatSize } from '../../core/fs/tree'
import { FolderIcon, RecycleBinIcon } from '../../components/icons'
import RenameInput from './RenameInput'
import { bgMenu, itemMenu } from './menus'
import type { ExplorerState } from './useExplorer'
import type { SortKey } from './types'

/* The listing pane: details table / icon grid / empty states, plus
 * the background context menu. */

export function FileList({ ex }: { ex: ExplorerState }) {
  const { t, ready, items, path, view, setSel, openMenu } = ex

  return (
    <div
      key={path.join('/')}
      className="anim-fade min-w-0 flex-1 overflow-y-auto"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) setSel(null)
      }}
      onContextMenu={(e) => openMenu(e, bgMenu(ex))}
    >
      {!ready ? (
        <div className="flex h-full items-center justify-center text-[13px] text-[#888]">
          {t('exp.loading')}
        </div>
      ) : items.length === 0 ? (
        <EmptyState ex={ex} />
      ) : view === 'icons' ? (
        <IconsView ex={ex} />
      ) : (
        <DetailsView ex={ex} />
      )}
    </div>
  )
}

function EmptyState({ ex }: { ex: ExplorerState }) {
  const { t, inBin, openMenu } = ex
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-3 text-[#888]"
      onContextMenu={(e) => openMenu(e, bgMenu(ex))}
    >
      {inBin ? (
        <>
          <RecycleBinIcon className="size-16 opacity-60" />
          <p className="text-[14px]">{t('exp.binEmpty')}</p>
        </>
      ) : (
        <>
          <FolderIcon className="size-16 opacity-50" />
          <p className="text-[14px]">{t('exp.empty')}</p>
        </>
      )}
    </div>
  )
}

function IconsView({ ex }: { ex: ExplorerState }) {
  const { items, sel, setSel, open, openMenu, renaming, commitRename, nameOf } = ex
  return (
    <div className="flex flex-wrap content-start gap-1 p-2">
      {items.map((n) => (
        <button
          key={n.name}
          className={`flex w-[88px] flex-col items-center gap-1 rounded-[2px] border px-1 py-2 ${
            sel === n.name
              ? 'border-[#99d1ff] bg-[#cce8ff]'
              : 'border-transparent hover:bg-[#e5f3ff]'
          }`}
          onClick={() => setSel(n.name)}
          onDoubleClick={() => open(n)}
          onContextMenu={(e) => {
            setSel(n.name)
            openMenu(e, itemMenu(ex, n))
          }}
        >
          <n.icon className="size-10 shrink-0" />
          {renaming === n.name ? (
            <RenameInput
              initial={n.name}
              dir={n.kind !== 'file'}
              onDone={(v) => commitRename(n.name, v)}
            />
          ) : (
            <span className="w-full break-words text-center text-[11px] leading-[1.2] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
              {nameOf(n)}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

function DetailsView({ ex }: { ex: ExplorerState }) {
  const {
    t,
    locale,
    items,
    inBin,
    sel,
    setSel,
    renaming,
    commitRename,
    open,
    openMenu,
    nameOf,
    sortKey,
    sortAsc,
    setSort,
  } = ex

  const colHeader = (key: SortKey, label: string, cls = '') => (
    <th
      className={`cursor-pointer select-none border-b border-l border-[#dcdcdc] px-2 py-0.5 font-normal hover:bg-[#e5f3ff] ${cls}`}
      onClick={() => setSort(key)}
    >
      {label}
      {sortKey === key && (
        <span className="ml-1 text-[9px]">{sortAsc ? '▲' : '▼'}</span>
      )}
    </th>
  )

  return (
    <table className="w-full border-collapse">
      <thead className="sticky top-0 bg-white">
        <tr className="text-left text-[12px] text-[#6d6d6d]">
          {colHeader('name', t('exp.col.name'), 'border-l-0')}
          {colHeader('modified', inBin ? t('exp.col.deleted') : t('exp.col.modified'), 'w-36')}
          {colHeader('type', t('exp.col.type'), 'w-32')}
          {colHeader('size', t('exp.col.size'), 'w-32')}
        </tr>
      </thead>
      <tbody>
        {items.map((n) => (
          <tr
            key={n.name}
            className={`cursor-default text-[12.5px] ${
              sel === n.name ? 'bg-[#cce8ff]' : 'hover:bg-[#e5f3ff]'
            }`}
            onClick={() => setSel(n.name)}
            onDoubleClick={() => open(n)}
            onContextMenu={(e) => {
              setSel(n.name)
              openMenu(e, itemMenu(ex, n))
            }}
          >
            <td className="flex items-center gap-1.5 px-2 py-[2.5px]">
              <n.icon className="size-4 shrink-0" />
              {renaming === n.name ? (
                <RenameInput
                  initial={n.name}
                  dir={n.kind !== 'file'}
                  onDone={(v) => commitRename(n.name, v)}
                />
              ) : (
                <span className="truncate">{nameOf(n)}</span>
              )}
            </td>
            <td className="px-2 py-[2.5px] text-[#555]">
              {n.modified ? formatDateTime(n.modified, locale) : ''}
            </td>
            <td className="px-2 py-[2.5px] text-[#555]">{t(n.type)}</td>
            <td className="px-2 py-[2.5px] text-[#555]">
              {n.driveInfo
                ? t('fs.freeOf', {
                    free: formatSize(n.driveInfo.free),
                    total: formatSize(n.driveInfo.total),
                  })
                : n.size}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
