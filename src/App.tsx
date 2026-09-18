import { useEffect } from 'react'
import { registerApps } from './apps'
import DesktopShell from './components/shell/DesktopShell'
import LockScreen from './components/screens/LockScreen'
import { BootScreen, PowerScreen } from './components/screens/SystemScreens'
import { useFsStore } from './core/fs/store'
import { useI18n } from './core/i18n'
import { useSystemStore } from './core/store/system'

registerApps()

/** Session phase router: boot -> lock -> signin -> desktop (+power). */
export default function App() {
  const phase = useSystemStore((s) => s.phase)
  const locale = useI18n((s) => s.locale)
  const fsInit = useFsStore((s) => s.init)
  const reduceMotion = useSystemStore((s) => s.reduceMotion)
  const transparency = useSystemStore((s) => s.transparency)

  // Mount the OPFS-backed filesystem once per session (boot).
  useEffect(() => {
    void fsInit()
  }, [fsInit])

  // Keep <html lang> in sync so CSS font fallback and a11y follow.
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  // Publish accessibility/appearance prefs for CSS (see index.css).
  useEffect(() => {
    const el = document.documentElement
    el.dataset.reduceMotion = String(reduceMotion)
    el.dataset.noBlur = String(!transparency)
  }, [reduceMotion, transparency])

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
