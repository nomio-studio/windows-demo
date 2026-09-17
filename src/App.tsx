import { registerApps } from './apps'
import DesktopShell from './components/DesktopShell'
import LockScreen from './components/LockScreen'
import { BootScreen, PowerScreen } from './components/SystemScreens'
import { useSystemStore } from './core/store/system'

registerApps()

/** Session phase router: boot -> lock -> signin -> desktop (+power). */
export default function App() {
  const phase = useSystemStore((s) => s.phase)

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
