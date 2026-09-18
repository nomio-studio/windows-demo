import { useState } from 'react'
import { useT } from '../../core/i18n'
import type { MessageKey } from '../../core/i18n/en'
import { useSystemStore } from '../../core/store/system'
import { wallpapers } from '../../config/shell'
import { PageHead, Row, SubNav, ToggleRow } from './shared'

type PersPage = 'background' | 'lockscreen' | 'colors'

const PAGES: readonly { id: PersPage; name: MessageKey }[] = [
  { id: 'background', name: 'set.sub.background' },
  { id: 'lockscreen', name: 'set.sub.lockscreen' },
  { id: 'colors', name: 'set.sub.colors' },
]

const ACCENTS = [
  '#0078D7',
  '#1a86e0',
  '#0099BC',
  '#00B294',
  '#107C10',
  '#5C2E91',
  '#B4009E',
  '#E3008C',
  '#D83B01',
  '#EA4300',
  '#CA5010',
  '#6B6B6B',
]

/** Personalization > Background | Lock screen | Colors. */
export default function PersonalizationPage() {
  const [page, setPage] = useState<PersPage>('background')
  const t = useT()
  return (
    <div className="flex h-full">
      <SubNav
        items={PAGES.map((p) => ({ id: p.id, label: t(p.name) }))}
        active={page}
        onPick={setPage}
      />
      <div key={page} className="anim-fade min-w-0 flex-1 overflow-y-auto p-6">
        <div className="max-w-[560px]">
          {page === 'background' && <Background />}
          {page === 'lockscreen' && <LockScreen />}
          {page === 'colors' && <Colors />}
        </div>
      </div>
    </div>
  )
}

function WallpaperGrid({
  value,
  onPick,
}: {
  value: number
  onPick: (i: number) => void
}) {
  const accent = useSystemStore((s) => s.accent)
  const t = useT()
  return (
    <div className="grid grid-cols-3 gap-3">
      {wallpapers.map((w, i) => (
        <button
          key={w.name}
          className={`group border-2 p-0.5 ${
            value === i
              ? ''
              : 'border-transparent hover:border-[#99d1ff]'
          }`}
          style={value === i ? { borderColor: accent } : undefined}
          onClick={() => onPick(i)}
        >
          <div className="h-20 w-full" style={w.style} />
          <p className="mt-1 truncate text-center text-[11.5px]">
            {t(w.name)}
          </p>
        </button>
      ))}
    </div>
  )
}

function Background() {
  const t = useT()
  const wallpaper = useSystemStore((s) => s.wallpaper)
  const setWallpaper = useSystemStore((s) => s.setWallpaper)
  return (
    <>
      <PageHead title={t('set.background')} sub={t('set.background.desc')} />
      <WallpaperGrid value={wallpaper} onPick={setWallpaper} />
    </>
  )
}

function LockScreen() {
  const t = useT()
  const lockWallpaper = useSystemStore((s) => s.lockWallpaper)
  const setLockWallpaper = useSystemStore((s) => s.setLockWallpaper)
  return (
    <>
      <PageHead title={t('set.lock')} sub={t('set.lock.desc')} />
      <WallpaperGrid value={lockWallpaper} onPick={setLockWallpaper} />
      <p className="mt-3 text-[12px] text-[#777]">{t('set.lock.hint')}</p>
    </>
  )
}

function Colors() {
  const t = useT()
  const accent = useSystemStore((s) => s.accent)
  const setAccent = useSystemStore((s) => s.setAccent)
  const transparency = useSystemStore((s) => s.transparency)
  const setTransparency = useSystemStore((s) => s.setTransparency)

  return (
    <>
      <PageHead title={t('set.colors')} sub={t('set.colors.sub')} />
      <p className="mb-2 text-[13.5px]">{t('set.colors.accent')}</p>
      <div className="mb-6 grid grid-cols-6 gap-2">
        {ACCENTS.map((c) => (
          <button
            key={c}
            className={`h-9 border-2 ${
              accent === c ? 'border-black/70' : 'border-black/15 hover:border-black/40'
            }`}
            style={{ background: c }}
            onClick={() => setAccent(c)}
            aria-label={c}
          />
        ))}
      </div>
      <ToggleRow
        title={t('set.colors.transparency')}
        desc={t('set.colors.transparency.desc')}
        on={transparency}
        onToggle={() => setTransparency(!transparency)}
      />
      <Row title={t('set.colors.preview')} desc={t('set.colors.preview.desc')}>
        <span
          className="mt-0.5 inline-block size-6 border border-black/15"
          style={{ background: accent }}
        />
      </Row>
    </>
  )
}
