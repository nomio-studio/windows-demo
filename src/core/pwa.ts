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
 * PWA events — OS file launches — into the stores. Updates apply
 * themselves: the worker self-activates on install and the
 * controllerchange handler below reloads into the new version.
 * Call once at startup; a no-op in dev or unsupported browsers.
 */
export function initPwa(): void {
  registerSW({ immediate: true })

  // The worker ships skipWaiting + clientsClaim, so each deploy's worker
  // takes control as soon as it installs — even for clients stuck on an
  // old precache (a waiting worker is never activated by a plain reload,
  // so prompt-style flows can strand users on stale builds). A new
  // controller means an update is ready — surface it via the store and
  // let UpdateToast / Settings > Update own the restart UX. The
  // first-ever claim (no prior controller) is not an update.
  const sw = navigator.serviceWorker
  if (sw) {
    let hadController = sw.controller != null
    sw.addEventListener('controllerchange', () => {
      if (!hadController) {
        hadController = true
        return
      }
      usePwaStore.getState().setUpdateReady(true)
    })
  }

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
