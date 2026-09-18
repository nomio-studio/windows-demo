import type { Menu } from './types'
import type { NotepadState } from './useNotepad'

/* The classic Notepad menu strip: File / Edit / Format / View / Help. */
export function buildMenus(np: NotepadState): Menu[] {
  const { wrap, setWrap, statusBar, setStatusBar, setAbout } = np
  return [
    {
      name: 'note.file',
      items: [
        { label: 'note.new', shortcut: 'Ctrl+N', onClick: np.doNew },
        { label: 'note.open', shortcut: 'Ctrl+O', onClick: np.doOpen },
        { label: 'note.save', shortcut: 'Ctrl+S', onClick: () => void np.doSave() },
        { label: 'note.saveAs', onClick: () => np.setDialog('save') },
        'sep',
        { label: 'note.pageSetup', disabled: true },
        { label: 'note.print', disabled: true },
        'sep',
        { label: 'note.exit', onClick: np.doExit },
      ],
    },
    {
      name: 'note.edit',
      items: [
        { label: 'note.undo', shortcut: 'Ctrl+Z', onClick: () => np.exec('undo') },
        'sep',
        { label: 'note.cut', shortcut: 'Ctrl+X', onClick: () => np.exec('cut') },
        { label: 'note.copy', shortcut: 'Ctrl+C', onClick: () => np.exec('copy') },
        { label: 'note.paste', shortcut: 'Ctrl+V', onClick: () => void np.paste() },
        { label: 'note.delete', onClick: np.del },
        'sep',
        {
          label: 'note.selectAll',
          shortcut: 'Ctrl+A',
          onClick: () => np.taRef.current?.select(),
        },
      ],
    },
    {
      name: 'note.format',
      items: [
        { label: 'note.wrap', checked: wrap, onClick: () => setWrap((v) => !v) },
        { label: 'note.font', disabled: true },
      ],
    },
    {
      name: 'note.view',
      items: [
        {
          label: 'note.statusBar',
          checked: statusBar,
          onClick: () => setStatusBar((v) => !v),
        },
      ],
    },
    {
      name: 'note.help',
      items: [
        { label: 'note.viewHelp', disabled: true },
        'sep',
        { label: 'note.about', onClick: () => setAbout(true) },
      ],
    },
  ]
}
