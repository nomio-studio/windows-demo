import FileDialog from '../../components/dialogs/FileDialog'
import type { NotepadState } from './useNotepad'

/* Modal dialogs layered over the editor: unsaved-changes prompt,
 * open/save file pickers and About. All rendered from NotepadState. */
export default function NotepadDialogs({ np }: { np: NotepadState }) {
  const {
    t,
    confirm,
    setConfirm,
    dialog,
    setDialog,
    about,
    setAbout,
    displayName,
    path,
    name,
  } = np

  return (
    <>
      {/* Unsaved-changes dialog */}
      {confirm && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20">
          <div className="w-80 border border-[#888] bg-[#f0f0f0] p-4 shadow-xl">
            <p className="mb-4 text-[12.5px]">
              {t('note.unsaved', { name: displayName })}
            </p>
            <div className="flex gap-2">
              <button
                className="h-7 flex-1 border border-[#7a7a7a] bg-[#e1e1e1] text-[12px] hover:bg-[#e5f3ff]"
                onClick={() => void np.afterConfirm(true)}
              >
                {t('note.unsaved.save')}
              </button>
              <button
                className="h-7 flex-1 border border-[#7a7a7a] bg-[#e1e1e1] text-[12px] hover:bg-[#e5f3ff]"
                onClick={() => void np.afterConfirm(false)}
              >
                {t('note.unsaved.dont')}
              </button>
              <button
                className="h-7 flex-1 border border-[#7a7a7a] bg-[#e1e1e1] text-[12px] hover:bg-[#e5f3ff]"
                onClick={() => setConfirm(null)}
              >
                {t('dlg.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File dialogs */}
      {dialog === 'open' && (
        <FileDialog
          mode="open"
          title={t('dlg.open')}
          actionLabel={t('dlg.open')}
          filter={['.txt', '.md', '.log', '.json', '.csv']}
          initialDir={path?.slice(0, -1)}
          onPick={({ dir, name: n }) => void np.openPicked(dir, n)}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'save' && (
        <FileDialog
          mode="save"
          title={t('dlg.saveAs')}
          actionLabel={t('dlg.save')}
          initialDir={path?.slice(0, -1) ?? ['Quick access', 'Documents']}
          initialName={name || `${t('note.untitled')}.txt`}
          onPick={({ dir, name: n }) => void np.savePicked(dir, n)}
          onClose={() => setDialog(null)}
        />
      )}

      {/* About dialog */}
      {about && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20">
          <div className="w-72 border border-[#888] bg-[#f0f0f0] p-4 shadow-xl">
            <p className="mb-1 text-[14px] font-semibold">Notepad</p>
            <p className="mb-3 text-[12px] text-[#444]">{t('note.aboutText')}</p>
            <button
              className="w-full border border-[#7a7a7a] bg-[#e1e1e1] py-1 text-[12px] hover:bg-[#e5f3ff]"
              onClick={() => setAbout(false)}
            >
              {t('note.ok')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
