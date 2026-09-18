import type { AppProps } from '../../core/types'
import { useNotepad } from './useNotepad'
import MenuBar from './MenuBar'
import NotepadDialogs from './dialogs'

/** Notepad: real file open/save against the OPFS filesystem. */
export default function NotepadApp({ windowId, launch }: AppProps) {
  const np = useNotepad(windowId, launch)
  const { t, taRef, text, setText, wrap, statusBar, pos, updatePos } = np

  return (
    <div
      className="relative flex h-full flex-col bg-white text-black"
      onKeyDown={(e) => {
        if (!e.ctrlKey) return
        const k = e.key.toLowerCase()
        if (k === 's') {
          e.preventDefault()
          void np.doSave()
        } else if (k === 'o') {
          e.preventDefault()
          np.doOpen()
        } else if (k === 'n') {
          e.preventDefault()
          np.doNew()
        }
      }}
    >
      <MenuBar np={np} />

      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          updatePos()
        }}
        onSelect={updatePos}
        onKeyUp={updatePos}
        onClick={updatePos}
        wrap={wrap ? 'soft' : 'off'}
        spellCheck={false}
        className="min-h-0 flex-1 resize-none whitespace-pre-wrap break-all p-[3px] font-['Consolas','Lucida_Console',monospace] text-[13.5px] outline-none"
        style={{ whiteSpace: wrap ? 'pre-wrap' : 'pre' }}
      />

      {statusBar && (
        <div className="flex h-6 shrink-0 items-center justify-end border-t border-[#e0e0e0] px-4 text-[11.5px] text-[#555]">
          <span>{t('note.pos', { ln: pos.ln, col: pos.col })}</span>
          <span className="mx-4 h-4 w-px bg-[#d0d0d0]" />
          <span>100%</span>
          <span className="mx-4 h-4 w-px bg-[#d0d0d0]" />
          <span>Windows (CRLF)</span>
          <span className="mx-4 h-4 w-px bg-[#d0d0d0]" />
          <span>UTF-8</span>
        </div>
      )}

      <NotepadDialogs np={np} />
    </div>
  )
}
