import { useEffect, useMemo, useRef, useState } from 'react'
import { useT, useLocale } from '../core/i18n'
import { useWindowsStore } from '../core/store/windows'
import { getApp } from '../core/registry'
import type { IconType } from '../core/types'
import {
  NotepadIcon,
  SettingsIcon,
  TaskMgrIcon,
  WindowsLogo,
} from '../components/icons'
/* ------------------------------------------------------------------ */
/* Simulated system processes                                          */
/* ------------------------------------------------------------------ */

interface SysProc {
  name: string
  icon: IconType
  cpu: [number, number] // base, jitter
  mem: number
}

const SYSTEM_PROCS: SysProc[] = [
  { name: 'System', icon: WindowsLogo, cpu: [0.1, 0.4], mem: 0.1 },
  { name: 'Registry', icon: WindowsLogo, cpu: [0, 0.1], mem: 35 },
  { name: 'dwm.exe', icon: WindowsLogo, cpu: [0.3, 1.2], mem: 48 },
  { name: 'Windows Explorer', icon: NotepadIcon, cpu: [0.5, 1.6], mem: 72 },
  { name: 'Runtime Broker', icon: WindowsLogo, cpu: [0, 0.5], mem: 21 },
  { name: 'svchost.exe', icon: WindowsLogo, cpu: [0.2, 1.1], mem: 38 },
  { name: 'svchost.exe', icon: WindowsLogo, cpu: [0, 0.4], mem: 27 },
  { name: 'svchost.exe', icon: WindowsLogo, cpu: [0.1, 0.8], mem: 19 },
  { name: 'Service Host: Windows Update', icon: SettingsIcon, cpu: [0, 2.5], mem: 44 },
]

interface Row {
  key: string
  name: string
  icon: IconType
  cpu: number
  mem: number
  windowId?: string
}

/** Rolling history for the performance graphs. */
const useSeries = (len: number) => {
  const ref = useRef<number[]>(Array(len).fill(0))
  const push = (v: number) => {
    ref.current = [...ref.current.slice(1), v]
    return ref.current
  }
  return { ref, push }
}

function Graph({ data, color }: { data: number[]; color: string }) {
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

type Tab = 'processes' | 'performance'

/** Task Manager — live process list wired to the real window manager. */
export default function TaskManager() {
  const windows = useWindowsStore((s) => s.windows)
  const requestClose = useWindowsStore((s) => s.requestClose)
  const [tab, setTab] = useState<Tab>('processes')
  const [sel, setSel] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const t = useT()
  const locale = useLocale()

  useEffect(() => {
    const iv = setInterval(() => setTick((x) => x + 1), 1000)
    return () => clearInterval(iv)
  }, [])

  const cpuSeries = useSeries(60)
  const memSeries = useSeries(60)

  // Deterministic per-row jitter so values feel alive but not chaotic.
  const rows = useMemo<Row[]>(() => {
    const apps: Row[] = windows.map((w, i) => {
      const def = getApp(w.appId)
      const seed = [...w.id].reduce((a, c) => a + c.charCodeAt(0), 0) + tick
      const cpu = Math.max(0, (Math.sin(seed) * 4 + 2.2) % 8)
      return {
        key: w.id,
        name: t(w.title ?? def?.title ?? 'app.modern'),
        icon: def?.icon ?? TaskMgrIcon,
        cpu,
        mem: 60 + ((seed * 13) % 140) + i * 3,
        windowId: w.id,
      }
    })
    const sys: Row[] = SYSTEM_PROCS.map((p, i) => {
      const wobble = (Math.sin(tick * 1.7 + i * 5) + 1) / 2
      return {
        key: `sys-${i}`,
        name: p.name,
        icon: p.icon,
        cpu: p.cpu[0] + wobble * p.cpu[1],
        mem: p.mem,
      }
    })
    return [...apps, ...sys]
  }, [windows, tick, t])

  const totalCpu = rows.reduce((a, r) => a + r.cpu, 0)
  const totalMem = rows.reduce((a, r) => a + r.mem, 0)
  const cpu = Math.min(100, 12 + totalCpu)
  const memPct = Math.min(100, (totalMem / 8192) * 100)
  cpuSeries.push(cpu)
  memSeries.push(memPct)

  const selRow = rows.find((r) => r.key === sel)
  const canEnd = !!selRow?.windowId

  const endTask = () => {
    if (selRow?.windowId) requestClose(selRow.windowId)
    setSel(null)
  }

  const fmt = (n: number, digits = 1) =>
    n.toLocaleString(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })

  return (
    <div className="flex h-full flex-col bg-white text-[12px] text-black select-none">
      {/* Tabs */}
      <div className="flex border-b border-black/10">
        {(['processes', 'performance'] as Tab[]).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-3 py-1.5 text-[12px] ${
              tab === k
                ? 'border-b-2 border-[#0078d7] font-semibold'
                : 'hover:bg-black/5'
            }`}
          >
            {t(`taskmgr.tab.${k}`)}
          </button>
        ))}
      </div>

      {tab === 'processes' ? (
        <>
          {/* Column header */}
          <div className="flex items-center border-b border-black/10 bg-[#f5f5f5] px-1 text-[11px] text-black/70">
            <span className="w-6" />
            <span className="flex-1 px-1 py-1">{t('taskmgr.col.name')}</span>
            <span className="w-16 px-1 text-right">{t('taskmgr.col.cpu')}</span>
            <span className="w-20 px-1 text-right">{t('taskmgr.col.mem')}</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="px-1 py-0.5 text-[11px] font-semibold text-black/60">
              {t('taskmgr.group.apps')}
            </div>
            {rows
              .filter((r) => r.windowId)
              .map((r) => (
                <RowView
                  key={r.key}
                  r={r}
                  sel={sel === r.key}
                  onSel={() => setSel(r.key)}
                  fmt={fmt}
                />
              ))}
            <div className="mt-1 px-1 py-0.5 text-[11px] font-semibold text-black/60">
              {t('taskmgr.group.windows')}
            </div>
            {rows
              .filter((r) => !r.windowId)
              .map((r) => (
                <RowView
                  key={r.key}
                  r={r}
                  sel={sel === r.key}
                  onSel={() => setSel(r.key)}
                  fmt={fmt}
                />
              ))}
          </div>
          {/* Status bar */}
          <div className="flex items-center justify-between border-t border-black/10 px-2 py-1 text-[11px] text-black/70">
            <span>{t('taskmgr.count', { n: rows.length })}</span>
            <button
              disabled={!canEnd}
              onClick={endTask}
              className="rounded-[1px] border border-[#adadad] bg-[#e1e1e1] px-4 py-0.5 text-[12px] enabled:hover:bg-[#e5f1fb] enabled:hover:border-[#0078d7] disabled:opacity-40"
            >
              {t('taskmgr.end')}
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto p-3">
          <PerfSection
            label={t('taskmgr.perf.cpu')}
            value={`${fmt(cpu)}%`}
            detail={t('taskmgr.perf.util')}
            data={cpuSeries.ref.current}
            color="#0078d7"
          />
          <PerfSection
            label={t('taskmgr.perf.mem')}
            value={`${fmt(totalMem / 1024, 1)}/8.0 GB (${fmt(memPct, 0)}%)`}
            detail={t('taskmgr.perf.usage')}
            data={memSeries.ref.current}
            color="#8e6bc8"
          />
        </div>
      )}
    </div>
  )
}

function RowView({
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
      <span className="w-16 px-1 text-right tabular-nums">
        {fmt(r.cpu)}%
      </span>
      <span className="w-20 px-1 text-right tabular-nums">
        {fmt(r.mem, 0)} MB
      </span>
    </button>
  )
}

function PerfSection({
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
