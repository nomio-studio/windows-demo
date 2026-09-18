import { create } from 'zustand'

/** A file handed to the app by the OS via manifest `file_handlers`. */
export interface PendingFile {
  name: string
  read: () => Promise<string>
}

/** Result of a manual "Check for updates" (Settings > Update). */
export interface UpdateCheck {
  at: number
  result: 'latest' | 'installed' | 'error'
}

interface PwaStore {
  pendingFile: PendingFile | null
  setPendingFile: (f: PendingFile | null) => void

  /** A new service worker took control — a restart applies it. */
  updateReady: boolean
  setUpdateReady: (v: boolean) => void
  /** The update toast was dismissed this session — don't re-show it. */
  updateDismissed: boolean
  dismissUpdateToast: () => void
  /** Manual update check in flight (Settings page spinner). */
  checking: boolean
  setChecking: (v: boolean) => void
  lastCheck: UpdateCheck | null
  setLastCheck: (c: UpdateCheck) => void
}

export const usePwaStore = create<PwaStore>()((set) => ({
  pendingFile: null,
  setPendingFile: (f) => set({ pendingFile: f }),

  updateReady: false,
  // A newly-installed update re-arms the toast even if the user
  // dismissed the previous one.
  setUpdateReady: (v) =>
    set(v ? { updateReady: true, updateDismissed: false } : { updateReady: v }),
  updateDismissed: false,
  dismissUpdateToast: () => set({ updateDismissed: true }),
  checking: false,
  setChecking: (v) => set({ checking: v }),
  lastCheck: null,
  setLastCheck: (c) => set({ lastCheck: c }),
}))
