import { useEffect } from 'react'
import { useT } from '../core/i18n'
import { useSystemStore } from '../core/store/system'
import { WindowsLogo } from './icons'

/** Rotating circle-of-dots used by boot / power screens. */
export function DotsSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`anim-dot-orbit relative size-10 ${className}`}>
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <span
          key={deg}
          className="absolute left-1/2 top-1/2 size-[5px] rounded-full bg-white"
          style={{
            transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-16px)`,
            opacity: 0.25 + (i / 6) * 0.75,
          }}
        />
      ))}
    </div>
  )
}

/** Black POST-style boot screen: logo + spinner, then lock. */
export function BootScreen() {
  const setPhase = useSystemStore((s) => s.setPhase)
  useEffect(() => {
    const t = setTimeout(() => setPhase('lock'), 2400)
    return () => clearTimeout(t)
  }, [setPhase])
  return (
    <div className="flex h-full flex-col items-center justify-center bg-black">
      <WindowsLogo className="anim-boot-glow mb-20 w-[130px] text-white" />
      <DotsSpinner />
    </div>
  )
}

/** Shutting down / Restarting / powered-off screens. */
export function PowerScreen() {
  const phase = useSystemStore((s) => s.phase)
  const setPhase = useSystemStore((s) => s.setPhase)
  const t = useT()

  useEffect(() => {
    if (phase !== 'shutdown' && phase !== 'restart') return
    const next = phase === 'shutdown' ? 'off' : 'boot'
    const t = setTimeout(() => setPhase(next), 2400)
    return () => clearTimeout(t)
  }, [phase, setPhase])

  if (phase === 'off') {
    return (
      <div
        className="h-full w-full cursor-pointer bg-black"
        onClick={() => setPhase('boot')}
        title={t('boot.powerOn')}
      />
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#0067b8]">
      <DotsSpinner className="mb-5" />
      <p className="text-[26px] font-light text-white">
        {phase === 'restart' ? t('boot.restarting') : t('boot.shuttingDown')}
      </p>
    </div>
  )
}
