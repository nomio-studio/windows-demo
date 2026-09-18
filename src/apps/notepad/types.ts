export interface MenuItem {
  label: string
  shortcut?: string
  disabled?: boolean
  checked?: boolean
  onClick?: () => void
}
export type Menu = { name: string; items: (MenuItem | 'sep')[] }

/** Unsaved-changes prompt: which action is gated behind the dialog. */
export type Confirm = 'new' | 'open' | 'close' | null
export type Dialog = 'open' | 'save' | null
