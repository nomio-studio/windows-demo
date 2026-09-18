import ContextMenu from '../../components/dialogs/ContextMenu'
import FileDialog from '../../components/dialogs/FileDialog'
import FilePropertiesDialog from '../../components/dialogs/FilePropertiesDialog'
import { DetailsIcon, FileIcon, GridIcon } from '../../components/icons'
import type { AppProps } from '../../core/types'
import { useExplorer, type ExplorerState } from './useExplorer'
import { AddressBar, NavPane, Ribbon } from './panes'
import { FileList } from './FileList'

/** Files app: nav pane, ribbon, breadcrumb, sortable view, Recycle Bin. */
export default function ExplorerApp({ launch }: AppProps) {
  const ex = useExplorer(launch)

  return (
    <div className="relative flex h-full flex-col bg-white text-black">
      <Ribbon ex={ex} />
      <AddressBar ex={ex} />

      <div className="flex min-h-0 flex-1">
        <NavPane ex={ex} />
        <FileList ex={ex} />
      </div>

      <StatusBar ex={ex} />

      {ex.menu && (
        <ContextMenu
          x={ex.menu.x}
          y={ex.menu.y}
          items={ex.menu.items}
          onClose={() => ex.setMenu(null)}
        />
      )}
      {ex.dialog?.kind === 'props' && (
        <FilePropertiesDialog
          node={ex.dialog.node}
          uiPath={ex.path}
          onClose={() => ex.setDialog(null)}
        />
      )}
      {ex.dialog?.kind === 'move' && (
        <FileDialog
          mode="folder"
          title={ex.t('exp.moveTo', { name: ex.dialog.node.name })}
          actionLabel={ex.t('exp.move')}
          onPick={({ dir }) => {
            ex.fs.moveTo([...ex.path, ex.dialog!.node.name], dir)
            ex.setDialog(null)
          }}
          onClose={() => ex.setDialog(null)}
        />
      )}
    </div>
  )
}

function StatusBar({ ex }: { ex: ExplorerState }) {
  const { t, items, sel, node, view, setView } = ex
  return (
    <div className="flex h-6 shrink-0 items-center gap-5 border-t border-[#dcdcdc] px-3 text-[11.5px] text-[#333]">
      <span>
        {t(items.length === 1 ? 'exp.item' : 'exp.items', { n: items.length })}
      </span>
      {sel && <span>{t('exp.selected')}</span>}
      <span className="flex items-center gap-1">
        <FileIcon className="size-3" /> {t(node.type)}
      </span>
      <span className="ml-auto flex items-center gap-0.5">
        <button
          className={`p-0.5 ${view === 'details' ? 'bg-[#cce8ff]' : 'hover:bg-[#e5f3ff]'}`}
          onClick={() => setView('details')}
          aria-label={t('exp.view.details')}
        >
          <DetailsIcon className="size-3.5" />
        </button>
        <button
          className={`p-0.5 ${view === 'icons' ? 'bg-[#cce8ff]' : 'hover:bg-[#e5f3ff]'}`}
          onClick={() => setView('icons')}
          aria-label={t('exp.view.icons')}
        >
          <GridIcon className="size-3.5" />
        </button>
      </span>
    </div>
  )
}
