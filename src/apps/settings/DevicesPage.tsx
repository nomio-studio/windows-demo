import { useState } from 'react'
import { useT } from '../../core/i18n'
import type { MessageKey } from '../../core/i18n/en'
import { useSystemStore } from '../../core/store/system'
import { Slider } from '../../components/ui'
import {
  BluetoothIcon,
  KeyboardIcon,
  MouseIcon,
  PrinterIcon,
} from '../../components/icons'
import type { IconType } from '../../core/types'
import { PageHead, Row, SubNav, ToggleRow } from './shared'

type DevPage = 'bluetooth' | 'mouse'

const PAGES: readonly { id: DevPage; name: MessageKey }[] = [
  { id: 'bluetooth', name: 'set.sub.bluetooth' },
  { id: 'mouse', name: 'set.sub.mouse' },
]

/** Devices > Bluetooth & other devices | Mouse. */
export default function DevicesPage() {
  const [page, setPage] = useState<DevPage>('bluetooth')
  const t = useT()
  return (
    <div className="flex h-full">
      <SubNav
        items={PAGES.map((p) => ({ id: p.id, label: t(p.name) }))}
        active={page}
        onPick={setPage}
      />
      <div key={page} className="anim-fade min-w-0 flex-1 overflow-y-auto p-6">
        <div className="max-w-[540px]">
          {page === 'bluetooth' && <Bluetooth />}
          {page === 'mouse' && <Mouse />}
        </div>
      </div>
    </div>
  )
}

interface PairedDevice {
  name: string
  kind: MessageKey
  icon: IconType
}

const PAIRED: PairedDevice[] = [
  { name: 'Surface Mouse', kind: 'set.dev.mouse', icon: MouseIcon },
  { name: 'Wireless Keyboard', kind: 'set.dev.keyboard', icon: KeyboardIcon },
  { name: 'Office Printer', kind: 'set.dev.printer', icon: PrinterIcon },
]

function Bluetooth() {
  const t = useT()
  const quick = useSystemStore((s) => s.quickActions)
  const toggleQuick = useSystemStore((s) => s.toggleQuickAction)
  const on = !!quick.bluetooth
  const [removed, setRemoved] = useState<string[]>([])

  return (
    <>
      <PageHead title={t('set.dev.bt')} sub={t('set.dev.bt.sub')} />
      <ToggleRow
        title="Bluetooth"
        on={on}
        onToggle={() => toggleQuick('bluetooth')}
      />
      {on ? (
        <>
          <p className="mb-2 mt-6 text-[13px] font-medium text-[#444]">
            {t('set.dev.paired')}
          </p>
          <div className="divide-y divide-[#eee] border border-[#e0e0e0]">
            {PAIRED.filter((d) => !removed.includes(d.name)).map((d) => (
              <div
                key={d.name}
                className="flex items-center gap-3 px-3 py-2.5"
              >
                <d.icon className="size-5 shrink-0 text-[#555]" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px]">{d.name}</span>
                  <span className="block text-[11.5px] text-[#777]">
                    {t(d.kind)} · {t('set.dev.connected')}
                  </span>
                </span>
                <button
                  className="shrink-0 border border-[#adadad] px-2.5 py-1 text-[11.5px] hover:bg-[#e5f1fb]"
                  onClick={() => setRemoved((r) => [...r, d.name])}
                >
                  {t('set.dev.remove')}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8 flex flex-col items-center text-[#888]">
          <BluetoothIcon className="mb-2 size-10 opacity-40" />
          <p className="text-[13px]">{t('set.dev.off')}</p>
        </div>
      )}
    </>
  )
}

function Mouse() {
  const t = useT()
  const speed = useSystemStore((s) => s.pointerSpeed)
  const setSpeed = useSystemStore((s) => s.setPointerSpeed)
  const quick = useSystemStore((s) => s.quickActions)
  const toggleQuick = useSystemStore((s) => s.toggleQuickAction)
  const leftHanded = !!quick.leftHanded

  return (
    <>
      <PageHead title={t('set.dev.mouse.title')} sub={t('set.dev.mouse.sub')} />
      <Row title={t('set.dev.primary')} desc={t('set.dev.primary.desc')}>
        <select
          value={leftHanded ? 'right' : 'left'}
          onChange={(e) => {
            const wantRight = e.target.value === 'right'
            if (wantRight !== leftHanded) toggleQuick('leftHanded')
          }}
          className="h-7 border border-[#adadad] bg-white px-1.5 text-[12.5px]"
        >
          <option value="left">{t('set.dev.left')}</option>
          <option value="right">{t('set.dev.right')}</option>
        </select>
      </Row>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13.5px]">{t('set.dev.speed')}</span>
          <span className="text-[12px] text-[#777]">{speed}</span>
        </div>
        <Slider value={speed} onChange={setSpeed} min={1} max={20} />
        <p className="mt-1.5 text-[12px] text-[#777]">{t('set.dev.speed.desc')}</p>
      </div>
      <ToggleRow
        title={t('set.dev.scroll')}
        desc={t('set.dev.scroll.desc')}
        on={!!quick.invertScroll}
        onToggle={() => toggleQuick('invertScroll')}
      />
    </>
  )
}
