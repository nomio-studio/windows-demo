import { create } from 'zustand'

/** A file handed to the app by the OS via manifest `file_handlers`. */
export interface PendingFile {
  name: string
  read: () => Promise<string>
}

interface PwaStore {
  pendingFile: PendingFile | null
  setPendingFile: (f: PendingFile | null) => void
}

export const usePwaStore = create<PwaStore>()((set) => ({
  pendingFile: null,
  setPendingFile: (f) => set({ pendingFile: f }),
}))
