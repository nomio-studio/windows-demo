import { useRef, useState } from 'react'
import { useT } from '../core/i18n'
import type { AppProps } from '../core/types'
import { useWindowsStore } from '../core/store/windows'

interface MenuItem {
  label: string
  disabled?: boolean
  checked?: boolean
  onClick?: () => void
}
type Menu = { name: string; items: (MenuItem | 'sep')[] }

/** Notepad: menu bar, editable text, word wrap, Ln/Col status bar. */
export default function NotepadApp({ windowId, launch }: AppProps) {
  const closeWindow = useWindowsStore((s) => s.closeWindow)
  const file = launch as { name?: string; text?: string } | undefined
  const [text, setText] = useState(file?.text ?? '')
  const [wrap, setWrap] = useState(true)
  const [statusBar, setStatusBar] = useState(true)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [about, setAbout] = useState(false)
  const [pos, setPos] = useState({ ln: 1, col: 1 })
  const taRef = useRef<HTMLTextAreaElement>(null)
  const t = useT()

  const updatePos = () => {
    const ta = taRef.current
    if (!ta) return
    const upto = ta.value.slice(0, ta.selectionStart)
    const lines = upto.split('\n')
    setPos({ ln: lines.length, col: lines[lines.length - 1].length + 1 })
  }

  const menus: Menu[] = [
    {
      name: 'note.file',
      items: [
        { label: 'note.new', onClick: () => setText('') },
        { label: 'note.open', disabled: true },
        { label: 'note.save', disabled: true },
        { label: 'note.saveAs', disabled: true },
        'sep',
        { label: 'note.pageSetup', disabled: true },
        { label: 'note.print', disabled: true },
        'sep',
        { label: 'note.exit', onClick: () => closeWindow(windowId) },
      ],
    },
    {
      name: 'note.edit',
      items: [
        { label: 'note.undo', disabled: true },
        'sep',
        { label: 'note.cut', disabled: true },
        { label: 'note.copy', disabled: true },
        { label: 'note.paste', disabled: true },
        { label: 'note.delete', disabled: true },
        'sep',
        {
          label: 'note.selectAll',
          onClick: () => taRef.current?.select(),
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

  return (
    <div className="relative flex h-full flex-col bg-white text-black">
      {/* Menu bar */}
      <div className="flex shrink-0 items-center border-b border-[#e0e0e0] text-[12.5px]">
        {menus.map((m) => (
          <div key={m.name} className="relative z-20">
            <button
              className={`px-2.5 py-[3px] ${
                openMenu === m.name ? 'bg-[#cce8ff]' : 'hover:bg-[#e5f3ff]'
              }`}
              onClick={() => setOpenMenu(openMenu === m.name ? null : m.name)}
              onMouseEnter={() => openMenu && setOpenMenu(m.name)}
            >
              {t(m.name)}
            </button>
            {openMenu === m.name && (
              <div className="anim-menu absolute left-0 top-full z-20 w-44 border border-[#a0a0a0] bg-[#f2f2f2] py-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                {m.items.map((it, i) =>
                  it === 'sep' ? (
                    <div key={i} className="mx-2 my-[3px] h-px bg-black/15" />
                  ) : (
                    <button
                      key={i}
                      disabled={it.disabled}
                      className="flex h-[24px] w-full items-center px-6 text-left text-[12px] hover:bg-[#d4d4d4] disabled:text-[#a0a0a0] disabled:hover:bg-transparent"
                      onClick={() => {
                        it.onClick?.()
                        setOpenMenu(null)
                      }}
                    >
                      {it.checked ? '✓ ' : ''}
                      {t(it.label)}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
        {openMenu && (
          <div
            className="fixed inset-0 z-10"
            onPointerDown={() => setOpenMenu(null)}
          />
        )}
      </div>

      {/* Text area */}
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
          <span>
            {t('note.pos', { ln: pos.ln, col: pos.col })}
          </span>
          <span className="mx-4 h-4 w-px bg-[#d0d0d0]" />
          <span>100%</span>
          <span className="mx-4 h-4 w-px bg-[#d0d0d0]" />
          <span>Windows (CRLF)</span>
          <span className="mx-4 h-4 w-px bg-[#d0d0d0]" />
          <span>UTF-8</span>
        </div>
      )}

      {/* About dialog */}
      {about && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20">
          <div className="w-72 border border-[#888] bg-[#f0f0f0] p-4 shadow-xl">
            <p className="mb-1 text-[14px] font-semibold">Notepad</p>
            <p className="mb-3 text-[12px] text-[#444]">
              {t('note.aboutText')}
            </p>
            <button
              className="w-full border border-[#7a7a7a] bg-[#e1e1e1] py-1 text-[12px] hover:bg-[#e5f3ff]"
              onClick={() => setAbout(false)}
            >
              {t('note.ok')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
