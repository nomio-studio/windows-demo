import { useEffect } from 'react'
import { registerApps } from './apps'
import DesktopShell from './components/DesktopShell'
import LockScreen from './components/LockScreen'
import { BootScreen, PowerScreen } from './components/SystemScreens'
import { useFsStore } from './core/fs/store'
import { useI18n } from './core/i18n'
import { useSystemStore } from './core/store/system'

registerApps()

/** Session phase router: boot -> lock -> signin -> desktop (+power). */
export default function App() {
  const phase = useSystemStore((s) => s.phase)
  const locale = useI18n((s) => s.locale)
  const fsInit = useFsStore((s) => s.init)

  // Mount the OPFS-backed filesystem once per session (boot).
  useEffect(() => {
    void fsInit()
  }, [fsInit])

  // Keep <html lang> in sync so CSS font fallback and a11y follow.
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <div className="h-full w-full overflow-hidden bg-black">
      {phase === 'boot' && <BootScreen />}
      {(phase === 'lock' || phase === 'signin') && <LockScreen />}
      {phase === 'desktop' && <DesktopShell />}
      {(phase === 'shutdown' || phase === 'restart' || phase === 'off') && (
        <PowerScreen />
      )}
    </div>
  )
}
