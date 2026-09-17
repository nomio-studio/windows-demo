import { useEffect, useRef, useState } from 'react'
import { useT } from '../core/i18n'
import type { AppProps } from '../core/types'
import { useFsStore } from '../core/fs/store'
import { useWindowsStore } from '../core/store/windows'
import FileDialog from '../components/FileDialog'

interface MenuItem {
  label: string
  shortcut?: string
  disabled?: boolean
  checked?: boolean
  onClick?: () => void
}
type Menu = { name: string; items: (MenuItem | 'sep')[] }

type Confirm = 'new' | 'open' | 'close' | null
type Dialog = 'open' | 'save' | null

/** Notepad: real file open/save against the OPFS filesystem. */
export default function NotepadApp({ windowId, launch }: AppProps) {
  const closeWindow = useWindowsStore((s) => s.closeWindow)
  const requestClose = useWindowsStore((s) => s.requestClose)
  const setTitle = useWindowsStore((s) => s.setTitle)
  const setCloseGuard = useWindowsStore((s) => s.setCloseGuard)
  const fs = useFsStore()
  const file = launch as
    | { name?: string; text?: string; path?: string[] }
    | undefined
  const [path, setPath] = useState<string[] | undefined>(file?.path)
  const [name, setName] = useState(file?.name ?? file?.path?.at(-1) ?? '')
  const [text, setText] = useState(file?.text ?? '')
  const [saved, setSaved] = useState(file?.text ?? '')
  const [wrap, setWrap] = useState(true)
  const [statusBar, setStatusBar] = useState(true)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [about, setAbout] = useState(false)
  const [confirm, setConfirm] = useState<Confirm>(null)
  const [dialog, setDialog] = useState<Dialog>(null)
  /** Action waiting for a Save As pick to finish. */
  const [pending, setPending] = useState<Exclude<Confirm, null> | null>(null)
  const [pos, setPos] = useState({ ln: 1, col: 1 })
  const taRef = useRef<HTMLTextAreaElement>(null)
  const t = useT()

  const dirty = text !== saved
  const displayName = name || t('note.untitled')

  // Load file content when launched with an fs path.
  useEffect(() => {
    if (!file?.path) return
    fs.readText(file.path)
      .then((content) => {
        setText(content)
        setSaved(content)
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Title reflects file name + modified marker, like real Notepad.
  useEffect(() => {
    setTitle(windowId, `${dirty ? '*' : ''}${t('app.notepadFile', { name: displayName })}`)
  }, [dirty, displayName, windowId, setTitle, t])

  // Veto window closes while unsaved changes exist.
  useEffect(() => {
    setCloseGuard(windowId, () => {
      if (!dirty) return true
      setConfirm('close')
      return false
    })
    return () => setCloseGuard(windowId, undefined)
  }, [dirty, windowId, setCloseGuard])

  const updatePos = () => {
    const ta = taRef.current
    if (!ta) return
    const upto = ta.value.slice(0, ta.selectionStart)
    const lines = upto.split('\n')
    setPos({ ln: lines.length, col: lines[lines.length - 1].length + 1 })
  }

  const doSave = async (): Promise<boolean> => {
    if (!path) {
      setDialog('save')
      return false
    }
    await fs.writeText(path, text)
    setSaved(text)
    return true
  }

  const reset = () => {
    setPath(undefined)
    setName('')
    setText('')
    setSaved('')
  }

  const askThen = (what: Exclude<Confirm, null>, next: () => void) => {
    if (dirty) setConfirm(what)
    else next()
  }

  const doNew = () => askThen('new', reset)
  const doOpen = () => askThen('open', () => setDialog('open'))
  const doExit = () => requestClose(windowId)

  const proceed = (what: Exclude<Confirm, null>) => {
    if (what === 'new') reset()
    else if (what === 'open') setDialog('open')
    else {
      setCloseGuard(windowId, undefined)
      closeWindow(windowId)
    }
  }

  const afterConfirm = async (save: boolean) => {
    const what = confirm
    setConfirm(null)
    if (!what) return
    if (!save) {
      proceed(what)
      return
    }
    if (path) {
      await doSave()
      proceed(what)
    } else {
      // Needs a name first — continue the action after Save As.
      setPending(what)
      setDialog('save')
    }
  }

  const exec = (cmd: string) => {
    taRef.current?.focus()
    document.execCommand(cmd)
  }

  const paste = async () => {
    try {
      const clip = await navigator.clipboard.readText()
      const ta = taRef.current
      if (!ta) return
      const s = ta.selectionStart
      const e = ta.selectionEnd
      setText(ta.value.slice(0, s) + clip + ta.value.slice(e))
    } catch {
      /* clipboard permission denied */
    }
  }

  const del = () => {
    const ta = taRef.current
    if (!ta) return
    const s = ta.selectionStart
    const e = ta.selectionEnd
    setText(ta.value.slice(0, s) + ta.value.slice(e === s ? s + 1 : e))
  }

  const menus: Menu[] = [
    {
      name: 'note.file',
      items: [
        { label: 'note.new', shortcut: 'Ctrl+N', onClick: doNew },
        { label: 'note.open', shortcut: 'Ctrl+O', onClick: doOpen },
        { label: 'note.save', shortcut: 'Ctrl+S', onClick: () => void doSave() },
        { label: 'note.saveAs', onClick: () => setDialog('save') },
        'sep',
        { label: 'note.pageSetup', disabled: true },
        { label: 'note.print', disabled: true },
        'sep',
        { label: 'note.exit', onClick: doExit },
      ],
    },
    {
      name: 'note.edit',
      items: [
        { label: 'note.undo', shortcut: 'Ctrl+Z', onClick: () => exec('undo') },
        'sep',
        { label: 'note.cut', shortcut: 'Ctrl+X', onClick: () => exec('cut') },
        { label: 'note.copy', shortcut: 'Ctrl+C', onClick: () => exec('copy') },
        { label: 'note.paste', shortcut: 'Ctrl+V', onClick: () => void paste() },
        { label: 'note.delete', onClick: del },
        'sep',
        {
          label: 'note.selectAll',
          shortcut: 'Ctrl+A',
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
    <div
      className="relative flex h-full flex-col bg-white text-black"
      onKeyDown={(e) => {
        if (!e.ctrlKey) return
        const k = e.key.toLowerCase()
        if (k === 's') {
          e.preventDefault()
          void doSave()
        } else if (k === 'o') {
          e.preventDefault()
          doOpen()
        } else if (k === 'n') {
          e.preventDefault()
          doNew()
        }
      }}
    >
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
              <div className="anim-menu absolute left-0 top-full z-20 w-52 border border-[#a0a0a0] bg-[#f2f2f2] py-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
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
                      <span className="flex-1">
                        {it.checked ? '✓ ' : ''}
                        {t(it.label)}
                      </span>
                      {it.shortcut && (
                        <span className="text-[11px] text-black/50">
                          {it.shortcut}
                        </span>
                      )}
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
          <span>{t('note.pos', { ln: pos.ln, col: pos.col })}</span>
          <span className="mx-4 h-4 w-px bg-[#d0d0d0]" />
          <span>100%</span>
          <span className="mx-4 h-4 w-px bg-[#d0d0d0]" />
          <span>Windows (CRLF)</span>
          <span className="mx-4 h-4 w-px bg-[#d0d0d0]" />
          <span>UTF-8</span>
        </div>
      )}

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
                onClick={() => void afterConfirm(true)}
              >
                {t('note.unsaved.save')}
              </button>
              <button
                className="h-7 flex-1 border border-[#7a7a7a] bg-[#e1e1e1] text-[12px] hover:bg-[#e5f3ff]"
                onClick={() => void afterConfirm(false)}
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
          onPick={async ({ dir, name: n }) => {
            setDialog(null)
            if (!n) return
            const p = [...dir, n]
            try {
              const content = await fs.readText(p)
              setPath(p)
              setName(n)
              setText(content)
              setSaved(content)
            } catch {
              /* file vanished */
            }
          }}
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
          onPick={async ({ dir, name: n }) => {
            setDialog(null)
            if (!n) return
            const p = [...dir, n]
            await fs.writeText(p, text)
            setPath(p)
            setName(n)
            setSaved(text)
            // A queued action (new/open/close) continues after saving.
            if (pending) {
              setPending(null)
              proceed(pending)
            }
          }}
          onClose={() => setDialog(null)}
        />
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
