import { useLayoutEffect, useRef, type RefObject } from 'react'
import { useSystemStore } from '../../core/store/system'
import type { WindowState } from '../../core/types'

/* Window animations — FLIP maximize, minimize swoop, close shrink —
 * all via the Web Animations API and all gated on reduced-motion. */

export const reducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
  useSystemStore.getState().reduceMotion

/**
 * FLIP animation on maximize/restore and the minimize/restore swoop.
 * `onMinimized` hides the window once its outro finishes.
 */
export function useWindowAnims(
  win: WindowState,
  rootRef: RefObject<HTMLDivElement | null>,
  onMinimized: (hidden: boolean) => void,
) {
  const wasMin = useRef(win.minimized)
  const prevMax = useRef(win.maximized)
  const prevBounds = useRef(win.bounds)

  // Maximize/restore: FLIP — scale from the previous frame to the new
  // one, like Windows' snap animation.
  useLayoutEffect(() => {
    const el = rootRef.current
    if (el && !reducedMotion() && prevMax.current !== win.maximized && !win.minimized) {
      const f = prevBounds.current
      const t = win.bounds
      el.animate(
        [
          {
            transform: `translate(${f.x - t.x}px, ${f.y - t.y}px) scale(${f.width / t.width}, ${f.height / t.height})`,
            transformOrigin: 'top left',
          },
          { transform: 'none', transformOrigin: 'top left' },
        ],
        { duration: 180, easing: 'cubic-bezier(0.2, 0, 0, 1)' },
      )
    }
    prevMax.current = win.maximized
    prevBounds.current = win.bounds
  }, [win.maximized, win.bounds, win.minimized, rootRef, onMinimized])

  // Minimize swoops down toward the taskbar; restore rises back up.
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el || wasMin.current === win.minimized) return
    wasMin.current = win.minimized
    if (win.minimized && reducedMotion()) {
      onMinimized(true)
      return
    }
    if (win.minimized) {
      el.animate(
        [
          { transform: 'none', opacity: 1 },
          { transform: 'translateY(70px) scale(0.72)', opacity: 0 },
        ],
        { duration: 150, easing: 'ease-in', fill: 'forwards' },
      ).finished.finally(() => onMinimized(true))
    } else {
      onMinimized(false)
      if (!reducedMotion())
        el.animate(
          [
            { transform: 'translateY(70px) scale(0.72)', opacity: 0 },
            { transform: 'none', opacity: 1 },
          ],
          { duration: 180, easing: 'cubic-bezier(0.2, 0, 0, 1)' },
        )
    }
  }, [win.minimized, rootRef, onMinimized])
}

/** Quick shrink-fade, then `done()` — skipped under reduced motion. */
export function animateClose(
  el: HTMLDivElement | null,
  done: () => void,
): void {
  if (!el || reducedMotion()) return done()
  el.animate(
    [
      { transform: 'none', opacity: 1 },
      { transform: 'scale(0.94)', opacity: 0 },
    ],
    { duration: 110, easing: 'ease-in', fill: 'forwards' },
  ).finished.finally(done)
}
