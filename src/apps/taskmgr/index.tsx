import { useState } from 'react'
import { useT, useLocale } from '../../core/i18n'
import { useWindowsStore } from '../../core/store/windows'
import { useProcesses } from './data'
import { PerfSection } from './Graph'
import ProcessRow from './ProcessRow'

type Tab = 'processes' | 'performance'

/** Task Manager — live process list wired to the real window manager. */
export default function TaskManager() {
  const requestClose = useWindowsStore((s) => s.requestClose)
  const [tab, setTab] = useState<Tab>('processes')
  const [sel, setSel] = useState<string | null>(null)
  const { rows, cpu, totalMem, memPct, cpuSeries, memSeries } = useProcesses()
  const t = useT()
  const locale = useLocale()

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
                <ProcessRow
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
                <ProcessRow
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
