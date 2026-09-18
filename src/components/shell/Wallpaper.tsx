import { useSystemStore } from '../../core/store/system'
import { wallpapers } from '../../config/wallpapers'
import { WindowsLogo } from '../icons'

/**
 * Desktop wallpaper. The default "hero" wallpaper gets the glowing
 * Windows logo treatment; other wallpapers render their CSS backdrop.
 */
export default function Wallpaper() {
  const index = useSystemStore((s) => s.wallpaper)
  const wp = wallpapers[index] ?? wallpapers[0]
  return (
    <div key={index} className="anim-fade absolute inset-0" style={wp.style}>
      {index === 0 && (
        <div
          className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2"
          style={{ transform: 'perspective(700px) rotateY(-14deg)' }}
        >
          <WindowsLogo className="w-[190px] text-[#cfe7ff] [filter:drop-shadow(0_0_70px_rgba(120,190,255,0.95))_drop-shadow(0_0_140px_rgba(80,150,255,0.7))]" />
        </div>
      )}
    </div>
  )
}
