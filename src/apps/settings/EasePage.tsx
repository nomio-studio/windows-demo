import { useState } from 'react'
import { useT } from '../../core/i18n'
import type { MessageKey } from '../../core/i18n/en'
import { useSystemStore } from '../../core/store/system'
import { Slider } from '../../components/ui'
import { PageHead, Row, SubNav, ToggleRow } from './shared'

type EasePage_ = 'display' | 'mouse'

const PAGES: readonly { id: EasePage_; name: MessageKey }[] = [
  { id: 'display', name: 'set.sub.easedisplay' },
  { id: 'mouse', name: 'set.sub.easemouse' },
]

/** Ease of Access > Display | Mouse. */
export default function EasePage() {
  const [page, setPage] = useState<EasePage_>('display')
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
          {page === 'display' && <Display />}
          {page === 'mouse' && <Mouse />}
        </div>
      </div>
    </div>
  )
}

function Display() {
  const t = useT()
  const reduceMotion = useSystemStore((s) => s.reduceMotion)
  const setReduceMotion = useSystemStore((s) => s.setReduceMotion)
  const transparency = useSystemStore((s) => s.transparency)
  const setTransparency = useSystemStore((s) => s.setTransparency)
  const iconSize = useSystemStore((s) => s.desktopIconSize)
  const setIconSize = useSystemStore((s) => s.setDesktopIconSize)

  return (
    <>
      <PageHead title={t('set.ease.display')} sub={t('set.ease.display.sub')} />
      <ToggleRow
        title={t('set.ease.animations')}
        desc={t('set.ease.animations.desc')}
        on={!reduceMotion}
        onToggle={() => setReduceMotion(!reduceMotion)}
      />
      <ToggleRow
        title={t('set.ease.transparency')}
        desc={t('set.ease.transparency.desc')}
        on={transparency}
        onToggle={() => setTransparency(!transparency)}
      />
      <Row title={t('set.ease.bigger')} desc={t('set.ease.bigger.desc')}>
        <select
          value={iconSize}
          onChange={(e) =>
            setIconSize(e.target.value as 'small' | 'medium' | 'large')
          }
          className="h-7 border border-[#adadad] bg-white px-1.5 text-[12.5px]"
        >
          <option value="small">{t('set.scale.small')}</option>
          <option value="medium">{t('set.scale.medium')}</option>
          <option value="large">{t('set.scale.large')}</option>
        </select>
      </Row>
      <p className="mt-4 text-[12px] text-[#777]">{t('set.ease.note')}</p>
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
      <PageHead title={t('set.ease.mouse')} sub={t('set.ease.mouse.sub')} />
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
      </div>
      <ToggleRow
        title={t('set.ease.keys')}
        desc={t('set.ease.keys.desc')}
        on={!!quick.mouseKeys}
        onToggle={() => toggleQuick('mouseKeys')}
      />
    </>
  )
}
