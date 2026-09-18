/** Inline rename field — selects the basename like Explorer does. */
export default function RenameInput({
  initial,
  dir,
  onDone,
}: {
  initial: string
  dir: boolean
  onDone: (v: string) => void
}) {
  return (
    <input
      autoFocus
      defaultValue={initial}
      className="min-w-0 flex-1 border border-[#0078d7] px-0.5 text-[12px] outline-none"
      onFocus={(e) => {
        const dot = dir ? -1 : initial.lastIndexOf('.')
        e.target.setSelectionRange(0, dot > 0 ? dot : initial.length)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onDone(e.currentTarget.value)
        if (e.key === 'Escape') onDone(initial)
        e.stopPropagation()
      }}
      onBlur={(e) => onDone(e.target.value)}
      onClick={(e) => e.stopPropagation()}
    />
  )
}
