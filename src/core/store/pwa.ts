import { create } from 'zustand'

/** A file handed to the app by the OS via manifest `file_handlers`. */
export interface PendingFile {
  name: string
  read: () => Promise<string>
}

interface PwaStore {
  /** A new service worker is installed and waiting to activate. */
  updateReady: boolean
  /** Activates the waiting worker — reloads into the new version. */
  applyUpdate: () => void
  dismissUpdate: () => void
  pendingFile: PendingFile | null
  setPendingFile: (f: PendingFile | null) => void
  /** Wired by `core/pwa.ts` — marks an update as available. */
  _needsRefresh: (apply: () => void) => void
}

export const usePwaStore = create<PwaStore>()((set) => ({
  updateReady: false,
  applyUpdate: () => {},
  dismissUpdate: () => set({ updateReady: false }),
  pendingFile: null,
  setPendingFile: (f) => set({ pendingFile: f }),
  _needsRefresh: (apply) => set({ updateReady: true, applyUpdate: apply }),
}))
