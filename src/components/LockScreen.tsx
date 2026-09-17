import { useEffect, useState } from 'react'
import { formatDateLong, formatTimeShort, useClock } from '../core/hooks'
import { useSystemStore } from '../core/store/system'
import { wallpapers } from '../config/shell'
import { AvatarIcon, ChevronRight, WifiIcon } from './icons'

/**
 * Lock screen (big clock, click/keypress to continue) followed by the
 * sign-in screen (avatar + PIN box, any input unlocks).
 */
export default function LockScreen() {
  const phase = useSystemStore((s) => s.phase)
  const setPhase = useSystemStore((s) => s.setPhase)
  const now = useClock()
  const [pin, setPin] = useState('')

  useEffect(() => {
    if (phase !== 'lock') return
    const onKey = () => setPhase('signin')
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, setPhase])

  const unlock = () => {
    setPin('')
    setPhase('desktop')
  }

  return (
    <div
      className="anim-fade relative h-full w-full overflow-hidden"
      style={wallpapers[1].style}
      onClick={phase === 'lock' ? () => setPhase('signin') : undefined}
    >
      {/* soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.45))]" />

      {phase === 'lock' && (
        <>
          <div className="absolute bottom-[15%] left-[7%] text-white">
            <div className="text-[92px] font-extralight leading-none tracking-tight">
              {formatTimeShort(now)}
            </div>
            <div className="mt-3 text-[32px] font-light">
              {formatDateLong(now)}
            </div>
          </div>
          <div className="absolute bottom-7 right-8 flex items-center gap-4 text-white/85">
            <WifiIcon className="size-5" />
          </div>
        </>
      )}

      {phase === 'signin' && (
        <div
          className="anim-lock-up absolute inset-0 flex flex-col items-center justify-center bg-black/30"
          onClick={(e) => e.stopPropagation()}
        >
          <AvatarIcon className="size-[170px] rounded-full" />
          <div className="mt-5 text-[30px] font-light text-white">User</div>
          <form
            className="mt-6 flex"
            onSubmit={(e) => {
              e.preventDefault()
              unlock()
            }}
          >
            <input
              autoFocus
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              className="h-9 w-60 bg-white/90 px-3 text-[14px] text-black outline-none placeholder:text-black/50"
            />
            <button
              type="submit"
              className="flex h-9 w-10 items-center justify-center border-l border-black/20 bg-white/90 hover:bg-white"
              aria-label="Sign in"
            >
              <ChevronRight className="size-4 text-black" />
            </button>
          </form>
          <button
            className="mt-4 text-[13px] text-white/80 hover:text-white"
            onClick={unlock}
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  )
}
