import type { IconType } from '../../core/types'

/* ---- Brand marks (hand-drawn, Fluent-flat style) ---- */

/** The authentic Windows logo quad — standard brand geometry. */
export const WindowsLogo: IconType = ({ className }) => (
  <svg viewBox="0 0 448 512" className={className} fill="currentColor">
    <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
  </svg>
)

export const EdgeIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path d="M8.4 1C4.2 1 1.4 4.3 1.4 8.4c0 .3 0 .7.1 1C2.7 6.6 5.3 5 8.2 5c2.4 0 4.1 1.2 4.8 1.2 1 0 1.5-.8 1.5-1.7C14.5 2.4 11.7 1 8.4 1z" fill="#38B2CE" />
    <path d="M15 7.6c0 4.5-3.2 7.4-7.4 7.4-3.9 0-6.6-2.3-6.6-5.5 0-2.6 2-4.4 4.6-4.4 2 0 3.4 1 3.4 2.7 0 1.3-1 2.2-2.4 2.2-.6 0-1.1-.2-1.5-.5.5 1.9 2.2 3 4.4 3 3.2 0 5.5-2 5.5-4.9z" fill="#2E7FC7" />
    <path d="M5.6 5.1c-2.6 0-4.6 1.8-4.6 4.4C1 12.7 3.7 15 7.6 15c2.4 0 4.5-1 5.8-2.6-1.2.4-2.5.6-3.8.6-3 0-5.3-1.6-5.3-4.3 0-.6.1-1.1.3-1.6-.5.5-.9 1.2-1.1 2 0-2 1-3.4 2.1-4z" fill="#41C8B0" />
  </svg>
)

/* Notepad: two-tone paper so it reads on a white title bar, the dark
 * desktop and a blue tile alike. */
export const NotepadIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <rect x="4" y="3" width="16" height="18" rx="1.5" fill="#F5F7FA" />
    <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3h13A1.5 1.5 0 0 1 20 4.5V8H4z" fill="#2B88D8" />
    <rect x="7" y="11" width="10" height="1.4" rx="0.7" fill="#9BC4EE" />
    <rect x="7" y="14" width="10" height="1.4" rx="0.7" fill="#9BC4EE" />
    <rect x="7" y="17" width="6.5" height="1.4" rx="0.7" fill="#9BC4EE" />
  </svg>
)

/* Tiny solid dot used by the boot spinner. */
export const SpinnerDot: IconType = ({ className }) => (
  <svg viewBox="0 0 8 8" className={className} fill="currentColor">
    <circle cx="4" cy="4" r="3.4" />
  </svg>
)
