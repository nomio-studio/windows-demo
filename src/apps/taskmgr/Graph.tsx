/* Performance-tab sparkline + labeled section. */

export function Graph({ data, color }: { data: number[]; color: string }) {
  const pts = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * 100},${30 - Math.min(100, v) * 0.28}`,
    )
    .join(' ')
  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className="h-full w-full"
    >
      <polyline
        points={`0,30 ${pts} 100,30`}
        fill={`${color}33`}
        stroke="none"
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function PerfSection({
  label,
  value,
  detail,
  data,
  color,
}: {
  label: string
  value: string
  detail: string
  data: number[]
  color: string
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline gap-3">
        <span className="text-[15px]">{label}</span>
        <span className="text-[12px] text-black/70">{value}</span>
      </div>
      <div className="h-[110px] border border-black/20 bg-[#f9f9f9] p-1">
        <Graph data={data} color={color} />
      </div>
      <div className="mt-1 flex gap-6 text-[11px] text-black/60">
        <span>
          {detail}: {value}
        </span>
      </div>
    </div>
  )
}
