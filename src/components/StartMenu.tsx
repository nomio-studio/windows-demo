import { useMemo, useState } from 'react'
import { useLocale, useT } from '../core/i18n'
import { listApps, getApp } from '../core/registry'
import { useSystemStore } from '../core/store/system'
import { useWindowsStore } from '../core/store/windows'
import type { IconType } from '../core/types'
import { railItems, startExtras, startTileGroups, type TileSize } from '../config/shell'
import { AvatarIcon, HamburgerIcon, PowerIcon } from './icons'

const TILE_SPAN: Record<TileSize, string> = {
  sm: 'col-span-1 row-span-1',
  md: 'col-span-2 row-span-2',
  wd: 'col-span-4 row-span-2',
  lg: 'col-span-4 row-span-4',
}
const TILE_ICON: Record<TileSize, string> = {
  sm: 'size-6',
  md: 'size-9',
  wd: 'size-10',
  lg: 'size-12',
}

interface AppEntry {
  key: string
  name: string
  icon: IconType
  color?: string
  open: () => void
}

/** Windows 10 start menu: rail + alphabetical app list + tile grid. */
export default function StartMenu({ exiting }: { exiting?: boolean }) {
  const openApp = useWindowsStore((s) => s.openApp)
  const setFlyout = useSystemStore((s) => s.setFlyout)
  const setPhase = useSystemStore((s) => s.setPhase)
  const accent = useSystemStore((s) => s.accent)
  const t = useT()
  const locale = useLocale()
  const [expanded, setExpanded] = useState(false)
  const [powerOpen, setPowerOpen] = useState(false)

  const groups = useMemo(() => {
    const entries: AppEntry[] = [
      ...listApps().map((a) => ({
        key: a.id,
        name: t(a.title),
        icon: a.icon,
        color: a.color,
        open: () => {
          openApp(a.id)
          setFlyout(null)
        },
      })),
      ...startExtras.map((x) => ({
        key: `x-${x.name}`,
        name: t(x.name),
        icon: x.icon,
        color: x.color,
        open: () => {
          openApp('modern', {
            title: x.name,
            icon: x.icon,
            launch: { color: x.color },
          })
          setFlyout(null)
        },
      })),
    ].sort((a, b) => a.name.localeCompare(b.name, locale))

    const map = new Map<string, AppEntry[]>()
    for (const e of entries) {
      const letter = /^[a-z]/i.test(e.name) ? e.name[0].toUpperCase() : '#'
      map.set(letter, [...(map.get(letter) ?? []), e])
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [openApp, setFlyout, t, locale])

  const railBtn = `flex h-11 items-center gap-3 px-3.5 text-left text-[13px] hover:bg-white/10`
  const railLabel = `whitespace-nowrap ${expanded ? '' : 'hidden'}`

  return (
    <div
      className={`${
        exiting ? 'anim-flyout-down' : 'anim-flyout-up'
      } absolute bottom-10 left-0 z-[55000] flex h-[640px] max-h-[calc(100%-40px)] max-w-[calc(100vw-6px)] overflow-hidden border border-black/60 bg-[#1f1f1f]/95 text-white shadow-2xl backdrop-blur-xl`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Side rail */}
      <div
        className={`flex shrink-0 flex-col justify-between overflow-hidden border-r border-white/5 transition-[width] duration-150 ${
          expanded ? 'w-48' : 'w-12'
        }`}
      >
        <button className={railBtn} onClick={() => setExpanded((v) => !v)}>
          <HamburgerIcon className="size-4 shrink-0" />
          <span className={railLabel}>{t('start.start')}</span>
        </button>
        <div className="flex flex-col pb-1.5">
          <button className={railBtn}>
            <AvatarIcon className="size-7 shrink-0 rounded-full" />
            <span className={railLabel}>{t('lock.user')}</span>
          </button>
          {railItems.map((r) => (
            <button
              key={r.id}
              className={railBtn}
              onClick={() => {
                openApp(r.appId, { launch: r.launch, title: r.title })
                setFlyout(null)
              }}
            >
              <r.icon className="size-5 shrink-0" />
              <span className={railLabel}>{t(r.label)}</span>
            </button>
          ))}
          <div className="relative">
            <button
              className={`${railBtn} w-full`}
              onClick={() => setPowerOpen((v) => !v)}
            >
              <PowerIcon className="size-5 shrink-0" />
              <span className={railLabel}>{t('power.power')}</span>
            </button>
            {powerOpen && (
              <div className="anim-menu absolute bottom-11 left-1 z-10 w-40 border border-black/60 bg-[#2b2b2b] py-1 shadow-xl">
                {[
                  { label: 'power.sleep', phase: 'lock' as const },
                  { label: 'power.shutdown', phase: 'shutdown' as const },
                  { label: 'power.restart', phase: 'restart' as const },
                ].map((p) => (
                  <button
                    key={p.label}
                    className="flex h-8 w-full items-center px-3 text-left text-[13px] hover:bg-white/10"
                    onClick={() => {
                      setPowerOpen(false)
                      setPhase(p.phase)
                    }}
                  >
                    {t(p.label)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* App list */}
      <div className="anim-fade w-[190px] shrink-0 overflow-y-auto py-1 sm:w-[236px]">
        {groups.map(([letter, entries]) => (
          <div key={letter}>
            <div className="px-4 pb-0.5 pt-2.5 text-[12px] font-semibold text-white/80">
              {letter}
            </div>
            {entries.map((e) => (
              <button
                key={e.key}
                className="flex w-full items-center gap-3 px-4 py-[5px] text-left hover:bg-white/10"
                onClick={e.open}
              >
                {e.color ? (
                  <span
                    className="flex size-6 shrink-0 items-center justify-center"
                    style={{ background: e.color }}
                  >
                    <e.icon className="size-4 text-white" />
                  </span>
                ) : (
                  <e.icon className="size-6 shrink-0" />
                )}
                <span className="truncate text-[13px]">{e.name}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Tiles (hidden on small screens — app list still works) */}
      <div className="hidden w-[272px] overflow-y-auto px-3 py-2 sm:block lg:w-[360px]">
        {startTileGroups.map((g) => (
          <div key={g.name} className="mb-4">
            <div className="mb-2 mt-1 px-0.5 text-[12px] text-white/70">
              {t(g.name)}
            </div>
            <div className="grid auto-rows-[54px] grid-cols-[repeat(4,54px)] gap-1.5 [grid-auto-flow:dense]">
              {g.tiles.map((tile, i) => {
                const app = getApp(tile.appId)
                const Icon = app.icon
                return (
                  <button
                    key={`${tile.appId}-${i}`}
                    className={`anim-tile-in group relative flex items-center justify-center ${TILE_SPAN[tile.size]} outline outline-1 outline-transparent transition-transform hover:outline-white/50 active:scale-95`}
                    style={{
                      background: tile.color ?? app.color ?? accent,
                      animationDelay: `${i * 30}ms`,
                    }}
                    onClick={() => {
                      openApp(tile.appId)
                      setFlyout(null)
                    }}
                  >
                    <Icon className={`${TILE_ICON[tile.size]} text-white`} />
                    <span className="absolute bottom-1 left-1.5 max-w-[90%] truncate text-[11px]">
                      {t(tile.label ?? app.title)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
