import type { Row } from './data'

export default function ProcessRow({
  r,
  sel,
  onSel,
  fmt,
}: {
  r: Row
  sel: boolean
  onSel: () => void
  fmt: (n: number, d?: number) => string
}) {
  return (
    <button
      onClick={onSel}
      className={`flex w-full items-center px-1 py-[3px] text-left ${
        sel ? 'bg-[#cce8ff]' : 'hover:bg-black/5'
      }`}
    >
      <r.icon className="mx-1 size-4 shrink-0" />
      <span className="flex-1 truncate px-1">{r.name}</span>
      <span className="w-16 px-1 text-right tabular-nums">{fmt(r.cpu)}%</span>
      <span className="w-20 px-1 text-right tabular-nums">
        {fmt(r.mem, 0)} MB
      </span>
    </button>
  )
}
