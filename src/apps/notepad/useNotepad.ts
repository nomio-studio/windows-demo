import { useEffect, useRef, useState } from 'react'
import { useT } from '../../core/i18n'
import { useFsStore } from '../../core/fs/store'
import { useWindowsStore } from '../../core/store/windows'
import type { Confirm, Dialog } from './types'

/**
 * Notepad document state: text, file path, dirty tracking, save/open/
 * close flow (including the unsaved-changes prompt and the window close
 * guard), cursor position and clipboard helpers. Returned as one state
 * object (`np`) so the menu model, menu bar and dialogs share it.
 */
export function useNotepad(windowId: string, launch: unknown) {
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
    setTitle(
      windowId,
      `${dirty ? '*' : ''}${t('app.notepadFile', { name: displayName })}`,
    )
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

  const openPicked = async (dir: string[], n: string | undefined) => {
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
  }

  const savePicked = async (dir: string[], n: string | undefined) => {
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
  }

  return {
    t,
    fs,
    taRef,
    path,
    name,
    text,
    setText,
    wrap,
    setWrap,
    statusBar,
    setStatusBar,
    openMenu,
    setOpenMenu,
    about,
    setAbout,
    confirm,
    setConfirm,
    dialog,
    setDialog,
    pos,
    dirty,
    displayName,
    updatePos,
    doSave,
    doNew,
    doOpen,
    doExit,
    afterConfirm,
    exec,
    paste,
    del,
    openPicked,
    savePicked,
  }
}

export type NotepadState = ReturnType<typeof useNotepad>
