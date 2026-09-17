/* Small shared controls used across flyouts and apps. */

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-5 w-11 shrink-0 rounded-full border transition-colors ${
        checked
          ? 'border-[#0078d7] bg-[#0078d7]'
          : 'border-current bg-transparent opacity-80'
      }`}
    >
      <span
        className={`absolute top-1/2 size-3 -translate-y-1/2 rounded-full transition-all ${
          checked ? 'right-[3px] bg-white' : 'left-[3px] bg-current'
        }`}
      />
    </button>
  )
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
}: {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
      style={{
        background: `linear-gradient(to right, #0078d7 ${pct}%, #6a6a6a ${pct}%)`,
      }}
    />
  )
}
