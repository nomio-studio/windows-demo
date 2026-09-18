import type { PointerEvent as ReactPointerEvent } from 'react'
import { shellSize, useWindowsStore } from '../../core/store/windows'
import type { Size, WindowState } from '../../core/types'

/* Pointer gestures: title-bar drag (with un-maximize + top-edge snap)
 * and edge/corner resizing. */

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))

export function useWindowGestures(win: WindowState, min: Size) {
  const focusWindow = useWindowsStore((s) => s.focusWindow)
  const setBounds = useWindowsStore((s) => s.setBounds)
  const toggleMaximize = useWindowsStore((s) => s.toggleMaximize)

  const onTitlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('[data-winbtn]')) return
    focusWindow(win.id)
    const st = {
      mx: e.clientX,
      my: e.clientY,
      rect: { ...win.bounds },
      prev: win.prevBounds,
      max: win.maximized,
    }
    const onMove = (ev: PointerEvent) => {
      if (st.max) {
        // Dragging a maximized title bar restores the window under the cursor.
        const pb = st.prev ?? { x: 40, y: 40, width: 800, height: 560 }
        const nx = ev.clientX - pb.width / 2
        const ny = Math.max(0, ev.clientY - 16)
        st.max = false
        st.mx = ev.clientX
        st.my = ev.clientY
        st.rect = { ...pb, x: nx, y: ny }
        useWindowsStore.setState((s) => ({
          windows: s.windows.map((w) =>
            w.id === win.id
              ? { ...w, maximized: false, prevBounds: null, bounds: st.rect }
              : w,
          ),
        }))
        return
      }
      const sh = shellSize()
      const nx = clamp(
        st.rect.x + ev.clientX - st.mx,
        80 - st.rect.width,
        sh.width - 60,
      )
      const ny = clamp(st.rect.y + ev.clientY - st.my, 0, sh.height - 80)
      setBounds(win.id, { ...st.rect, x: nx, y: ny })
    }
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', onMove)
      // Released at the very top edge -> snap to maximized.
      if (ev.clientY <= 0 && !st.max) toggleMaximize(win.id)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp, { once: true })
  }

  const startResize =
    (dir: string) => (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return
      e.preventDefault()
      e.stopPropagation()
      focusWindow(win.id)
      const s = { mx: e.clientX, my: e.clientY, ...win.bounds }
      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - s.mx
        const dy = ev.clientY - s.my
        let { x, y, width, height } = s
        if (dir.includes('e')) width = s.width + dx
        if (dir.includes('s')) height = s.height + dy
        if (dir.includes('w')) {
          width = s.width - dx
          x = s.x + dx
        }
        if (dir.includes('n')) {
          height = s.height - dy
          y = s.y + dy
        }
        if (width < min.width) {
          if (dir.includes('w')) x += width - min.width
          width = min.width
        }
        if (height < min.height) {
          if (dir.includes('n')) y += height - min.height
          height = min.height
        }
        setBounds(win.id, { x, y, width, height })
      }
      const onUp = () => window.removeEventListener('pointermove', onMove)
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp, { once: true })
    }

  return { onTitlePointerDown, startResize }
}
