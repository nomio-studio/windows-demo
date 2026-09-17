import { registerSW } from 'virtual:pwa-register'
import { usePwaStore } from './store/pwa'

interface LaunchParams {
  files?: FileSystemFileHandle[]
}
interface LaunchQueue {
  setConsumer: (consumer: (params: LaunchParams) => void) => void
}

/**
 * PWA runtime: registers the service worker and bridges browser-level
 * PWA events — updates and OS file launches — into the stores.
 * Call once at startup; a no-op in dev or unsupported browsers.
 */
export function initPwa(): void {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh: () =>
      usePwaStore.getState()._needsRefresh(() => updateSW(true)),
    onOfflineReady: () => {},
  })

  // File Handling API: fires when the installed app is launched via
  // "Open with" on a registered file type (see manifest file_handlers).
  const lq = (window as unknown as { launchQueue?: LaunchQueue }).launchQueue
  lq?.setConsumer((params) => {
    const handle = params.files?.[0]
    if (handle) {
      usePwaStore.getState().setPendingFile({
        name: handle.name,
        read: async () => (await handle.getFile()).text(),
      })
    }
  })
}
