import { useEffect, useMemo, useRef, useState } from 'react'
import { useT } from '../../core/i18n'
import { useWindowsStore } from '../../core/store/windows'
import { getApp } from '../../core/registry'
import type { IconType } from '../../core/types'
import {
  NotepadIcon,
  SettingsIcon,
  TaskMgrIcon,
  WindowsLogo,
} from '../../components/icons'

/* ------------------------------------------------------------------ */
/* Simulated system processes                                          */
/* ------------------------------------------------------------------ */

export interface SysProc {
  name: string
  icon: IconType
  cpu: [number, number] // base, jitter
  mem: number
}

export const SYSTEM_PROCS: SysProc[] = [
  { name: 'System', icon: WindowsLogo, cpu: [0.1, 0.4], mem: 0.1 },
  { name: 'Registry', icon: WindowsLogo, cpu: [0, 0.1], mem: 35 },
  { name: 'dwm.exe', icon: WindowsLogo, cpu: [0.3, 1.2], mem: 48 },
  { name: 'Windows Explorer', icon: NotepadIcon, cpu: [0.5, 1.6], mem: 72 },
  { name: 'Runtime Broker', icon: WindowsLogo, cpu: [0, 0.5], mem: 21 },
  { name: 'svchost.exe', icon: WindowsLogo, cpu: [0.2, 1.1], mem: 38 },
  { name: 'svchost.exe', icon: WindowsLogo, cpu: [0, 0.4], mem: 27 },
  { name: 'svchost.exe', icon: WindowsLogo, cpu: [0.1, 0.8], mem: 19 },
  {
    name: 'Service Host: Windows Update',
    icon: SettingsIcon,
    cpu: [0, 2.5],
    mem: 44,
  },
]

export interface Row {
  key: string
  name: string
  icon: IconType
  cpu: number
  mem: number
  windowId?: string
}

/** Rolling history for the performance graphs. */
export const useSeries = (len: number) => {
  const ref = useRef<number[]>(Array(len).fill(0))
  const push = (v: number) => {
    ref.current = [...ref.current.slice(1), v]
    return ref.current
  }
  return { ref, push }
}

/**
 * The live process model: open windows become app rows, SYSTEM_PROCS
 * become the Windows-processes group, and a 1s tick drives
 * deterministic jitter plus the CPU/memory totals.
 */
export function useProcesses() {
  const windows = useWindowsStore((s) => s.windows)
  const [tick, setTick] = useState(0)
  const t = useT()

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

  return { rows, cpu, totalMem, memPct, cpuSeries, memSeries }
}
