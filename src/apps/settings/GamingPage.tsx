import { useState } from 'react'
import { useT } from '../../core/i18n'
import type { MessageKey } from '../../core/i18n/en'
import { useSystemStore } from '../../core/store/system'
import { GamepadIcon, RecordIcon } from '../../components/icons'
import { PageHead, Row, SubNav, ToggleRow } from './shared'

type GamePage_ = 'gamebar' | 'captures' | 'gamemode'

const PAGES: readonly { id: GamePage_; name: MessageKey }[] = [
  { id: 'gamebar', name: 'set.sub.gamebar' },
  { id: 'captures', name: 'set.sub.captures' },
  { id: 'gamemode', name: 'set.sub.gamemode' },
]

/** Gaming > Game bar | Captures | Game Mode. */
export default function GamingPage() {
  const [page, setPage] = useState<GamePage_>('gamebar')
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
          {page === 'gamebar' && <GameBar />}
          {page === 'captures' && <Captures />}
          {page === 'gamemode' && <GameMode />}
        </div>
      </div>
    </div>
  )
}

function GameBar() {
  const t = useT()
  const quick = useSystemStore((s) => s.quickActions)
  const toggleQuick = useSystemStore((s) => s.toggleQuickAction)
  const on = !!quick.gamebar
  return (
    <>
      <PageHead title={t('set.game.bar')} sub={t('set.game.bar.sub')} />
      <div className="mb-5 flex items-center gap-3 border border-[#e0e0e0] p-4">
        <GamepadIcon className="size-10 shrink-0 text-[#107c10]" />
        <div>
          <p className="text-[13.5px] font-medium">Xbox Game Bar</p>
          <p className="text-[12px] text-[#777]">Win + G</p>
        </div>
      </div>
      <ToggleRow
        title={t('set.game.bar.toggle')}
        desc={t('set.game.bar.toggle.desc')}
        on={on}
        onToggle={() => toggleQuick('gamebar')}
      />
      <ToggleRow
        title={t('set.game.tips')}
        desc={t('set.game.tips.desc')}
        on={!!quick.gameTips}
        onToggle={() => toggleQuick('gameTips')}
      />
      {on && (
        <div className="mt-5 border border-[#e0e0e0]">
          <p className="border-b border-[#e0e0e0] bg-[#f5f5f5] px-3 py-2 text-[12.5px] font-medium">
            {t('set.game.shortcuts')}
          </p>
          {(
            [
              ['set.game.k.open', 'Win + G'],
              ['set.game.k.record', 'Win + Alt + R'],
              ['set.game.k.shot', 'Win + Alt + PrtScn'],
              ['set.game.k.mic', 'Win + Alt + M'],
            ] as [MessageKey, string][]
          ).map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between px-3 py-2 text-[12.5px]"
            >
              <span>{t(k)}</span>
              <kbd className="border border-[#ccc] bg-[#f7f7f7] px-1.5 py-0.5 text-[11px]">
                {v}
              </kbd>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function Captures() {
  const t = useT()
  const quick = useSystemStore((s) => s.quickActions)
  const toggleQuick = useSystemStore((s) => s.toggleQuickAction)
  return (
    <>
      <PageHead title={t('set.game.captures')} sub={t('set.game.captures.sub')} />
      <div className="mb-5 flex items-center gap-3 border border-[#e0e0e0] p-4">
        <RecordIcon className="size-10 shrink-0 text-[#d83b01]" />
        <div>
          <p className="text-[13.5px] font-medium">
            {t('set.game.captures.folder')}
          </p>
          <p className="text-[12px] text-[#777]">
            Videos/Captures · {t('set.game.captures.empty')}
          </p>
        </div>
      </div>
      <ToggleRow
        title={t('set.game.bg')}
        desc={t('set.game.bg.desc')}
        on={!!quick.bgRecording}
        onToggle={() => toggleQuick('bgRecording')}
      />
      <ToggleRow
        title={t('set.game.audio')}
        desc={t('set.game.audio.desc')}
        on={!!quick.captureAudio}
        onToggle={() => toggleQuick('captureAudio')}
      />
      <Row title={t('set.game.quality')} desc={t('set.game.quality.desc')}>
        <select
          className="h-7 border border-[#adadad] bg-white px-1.5 text-[12.5px]"
          value={quick.hdCapture ? 'hd' : 'sd'}
          onChange={(e) => {
            const wantHd = e.target.value === 'hd'
            if (wantHd !== !!quick.hdCapture) toggleQuick('hdCapture')
          }}
        >
          <option value="sd">{t('set.game.quality.sd')}</option>
          <option value="hd">{t('set.game.quality.hd')}</option>
        </select>
      </Row>
    </>
  )
}

function GameMode() {
  const t = useT()
  const quick = useSystemStore((s) => s.quickActions)
  const setQuick = useSystemStore((s) => s.setQuickAction)
  const on = quick.gamemode ?? true
  return (
    <>
      <PageHead title={t('set.game.mode')} sub={t('set.game.mode.sub')} />
      <ToggleRow
        title={t('set.game.mode.toggle')}
        desc={t('set.game.mode.desc')}
        on={on}
        onToggle={() => setQuick('gamemode', !on)}
      />
      <p className="mt-4 border border-[#e0e0e0] bg-[#f7f7f7] px-4 py-3 text-[12.5px] text-[#555]">
        {t('set.game.mode.note')}
      </p>
    </>
  )
}
