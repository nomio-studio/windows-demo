import { useRef, useState } from 'react'
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
export default function NotepadApp({ windowId }: AppProps) {
  const closeWindow = useWindowsStore((s) => s.closeWindow)
  const [text, setText] = useState('')
  const [wrap, setWrap] = useState(true)
  const [statusBar, setStatusBar] = useState(true)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [about, setAbout] = useState(false)
  const [pos, setPos] = useState({ ln: 1, col: 1 })
  const taRef = useRef<HTMLTextAreaElement>(null)

  const updatePos = () => {
    const ta = taRef.current
    if (!ta) return
    const upto = ta.value.slice(0, ta.selectionStart)
    const lines = upto.split('\n')
    setPos({ ln: lines.length, col: lines[lines.length - 1].length + 1 })
  }

  const menus: Menu[] = [
    {
      name: 'File',
      items: [
        { label: 'New', onClick: () => setText('') },
        { label: 'Open…', disabled: true },
        { label: 'Save', disabled: true },
        { label: 'Save As…', disabled: true },
        'sep',
        { label: 'Page Setup…', disabled: true },
        { label: 'Print…', disabled: true },
        'sep',
        { label: 'Exit', onClick: () => closeWindow(windowId) },
      ],
    },
    {
      name: 'Edit',
      items: [
        { label: 'Undo', disabled: true },
        'sep',
        { label: 'Cut', disabled: true },
        { label: 'Copy', disabled: true },
        { label: 'Paste', disabled: true },
        { label: 'Delete', disabled: true },
        'sep',
        {
          label: 'Select All',
          onClick: () => taRef.current?.select(),
        },
      ],
    },
    {
      name: 'Format',
      items: [
        { label: 'Word Wrap', checked: wrap, onClick: () => setWrap((v) => !v) },
        { label: 'Font…', disabled: true },
      ],
    },
    {
      name: 'View',
      items: [
        {
          label: 'Status Bar',
          checked: statusBar,
          onClick: () => setStatusBar((v) => !v),
        },
      ],
    },
    {
      name: 'Help',
      items: [
        { label: 'View Help', disabled: true },
        'sep',
        { label: 'About Notepad', onClick: () => setAbout(true) },
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
              {m.name}
            </button>
            {openMenu === m.name && (
              <div className="absolute left-0 top-full z-20 w-44 border border-[#a0a0a0] bg-[#f2f2f2] py-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
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
                      {it.label}
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
            Ln {pos.ln}, Col {pos.col}
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
              Windows 10 web demo — a faithful recreation built with React.
            </p>
            <button
              className="w-full border border-[#7a7a7a] bg-[#e1e1e1] py-1 text-[12px] hover:bg-[#e5f3ff]"
              onClick={() => setAbout(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
