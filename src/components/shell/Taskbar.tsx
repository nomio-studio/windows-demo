import type { MouseEvent as ReactMouseEvent } from 'react'
import { getApp } from '../../core/registry'
import { localeShort, useLocale, useT } from '../../core/i18n'
import { useSystemStore } from '../../core/store/system'
import { useWindowsStore } from '../../core/store/windows'
import { taskbarPins } from '../../config/shell'
import { formatDate, formatTime, useClock } from '../../core/hooks'
import {
  ActionCenterIcon,
  ChevronUp,
  SearchIcon,
  TaskViewIcon,
  VolumeIcon,
  WifiIcon,
  WindowsLogo,
} from '../icons'

interface Props {
  onMenu: (e: ReactMouseEvent, kind: 'taskbar' | 'winx') => void
}

const hover = 'transition-colors hover:bg-white/10'

/** The taskbar: start, search, task view, app buttons, tray, clock. */
export default function Taskbar({ onMenu }: Props) {
  const windows = useWindowsStore((s) => s.windows)
  const activeId = useWindowsStore((s) => s.activeId)
  const openApp = useWindowsStore((s) => s.openApp)
  const toggleTaskbar = useWindowsStore((s) => s.toggleTaskbar)
  const minimizeAll = useWindowsStore((s) => s.minimizeAll)
  const flyout = useSystemStore((s) => s.flyout)
  const toggleFlyout = useSystemStore((s) => s.toggleFlyout)
  const wifiOn = useSystemStore((s) => s.wifiOn)
  const accent = useSystemStore((s) => s.accent)
  const now = useClock()
  const t = useT()
  const locale = useLocale()

  const runningIds = [...new Set(windows.map((w) => w.appId))]
  const items = [
    ...taskbarPins,
    ...runningIds.filter((id) => !taskbarPins.includes(id)),
  ]

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-[60000] flex h-10 items-stretch bg-[#101010]/95 text-white backdrop-blur-md"
      onContextMenu={(e) => onMenu(e, 'taskbar')}
    >
      {/* Start button — the logo lights blue on hover, like Win10. */}
      <button
        className={`group flex w-12 items-center justify-center ${hover} ${
          flyout === 'start' ? 'bg-white/10' : ''
        }`}
        onClick={() => toggleFlyout('start')}
        onContextMenu={(e) => {
          e.stopPropagation()
          onMenu(e, 'winx')
        }}
        aria-label={t('aria.start')}
      >
        <WindowsLogo className="size-5 text-white transition-colors group-hover:text-[#4da6e8]" />
      </button>

      {/* Search: icon on small screens, expanding box on larger */}
      <button
        className={`flex w-11 items-center justify-center sm:hidden ${hover}`}
        onClick={() => toggleFlyout('search')}
        aria-label={t('aria.search')}
      >
        <SearchIcon className="size-5" />
      </button>
      <button
        className={`m-1.5 hidden w-36 items-center gap-2 rounded-[2px] bg-[#f2f2f2] px-2.5 text-left text-[13px] text-[#3c3c3c] hover:bg-white sm:flex md:w-56 lg:w-80 ${
          flyout === 'search' ? 'bg-white' : ''
        }`}
        onClick={() => toggleFlyout('search')}
        onContextMenu={(e) => e.stopPropagation()}
      >
        <SearchIcon className="size-4 shrink-0 text-[#3c3c3c]" />
        <span className="truncate">{t('shell.search')}</span>
      </button>

      {/* Task view */}
      <button
        className={`hidden w-11 items-center justify-center sm:flex ${hover}`}
        onClick={() => toggleFlyout('search')}
        aria-label={t('aria.taskview')}
      >
        <TaskViewIcon className="size-5" />
      </button>

      {/* App buttons (scrolls instead of clipping when crowded) */}
      <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((appId) => {
          const app = getApp(appId)
          const appWins = windows.filter((w) => w.appId === appId)
          const open = appWins.length > 0
          const focused =
            open && appWins.some((w) => w.id === activeId && !w.minimized)
          const Icon = appWins[0]?.icon ?? app.icon
          return (
            <button
              key={appId}
              className={`relative flex w-12 shrink-0 items-center justify-center transition-transform active:scale-90 ${hover} ${
                focused ? 'bg-white/10' : ''
              }`}
              onClick={() =>
                open ? toggleTaskbar(appWins[0].id) : openApp(appId)
              }
              title={t(app.title)}
            >
              <Icon className="size-6" />
              <span
                className={`absolute inset-x-1.5 bottom-0 h-[2px] transition-colors duration-150 ${
                  focused ? '' : open ? 'bg-white/40' : ''
                }`}
                style={focused ? { background: accent } : undefined}
              />
            </button>
          )
        })}
      </div>

      {/* System tray (status icons collapse on small screens) */}
      <div className="flex items-stretch">
        <button
          className={`hidden w-6 items-center justify-center sm:flex ${hover} ${
            flyout === 'trayOverflow' ? 'bg-white/10' : ''
          }`}
          onClick={() => toggleFlyout('trayOverflow')}
          aria-label={t('aria.showHidden')}
        >
          <ChevronUp className="size-3.5" />
        </button>
        <button
          className={`hidden w-7 items-center justify-center sm:flex ${hover} ${
            wifiOn ? '' : 'opacity-40'
          } ${flyout === 'network' ? 'bg-white/10' : ''}`}
          onClick={() => toggleFlyout('network')}
          aria-label={t('aria.network')}
        >
          <WifiIcon className="size-4" />
        </button>
        <button
          className={`hidden w-7 items-center justify-center sm:flex ${hover} ${
            flyout === 'volume' ? 'bg-white/10' : ''
          }`}
          onClick={() => toggleFlyout('volume')}
          aria-label={t('aria.volume')}
        >
          <VolumeIcon className="size-4" />
        </button>
        <button
          className={`hidden w-8 items-center justify-center text-[11px] sm:flex ${hover} ${
            flyout === 'language' ? 'bg-white/10' : ''
          }`}
          onClick={() => toggleFlyout('language')}
          aria-label={t('aria.language')}
        >
          {localeShort(locale)}
        </button>
        <button
          className={`flex w-auto flex-col items-center justify-center px-2 text-[11.5px] leading-[1.2] sm:w-[76px] sm:px-0 ${hover} ${
            flyout === 'calendar' ? 'bg-white/10' : ''
          }`}
          onClick={() => toggleFlyout('calendar')}
        >
          <span>{formatTime(now, locale)}</span>
          <span className="hidden sm:block">{formatDate(now, locale)}</span>
        </button>
        <button
          className={`flex w-9 items-center justify-center border-r border-white/25 ${hover} ${
            flyout === 'actionCenter' ? 'bg-white/10' : ''
          }`}
          onClick={() => toggleFlyout('actionCenter')}
          aria-label={t('aria.actionCenter')}
        >
          <ActionCenterIcon className="size-[18px]" />
        </button>
        {/* Show desktop sliver */}
        <button
          className="w-[6px] transition-colors hover:bg-white/20"
          onClick={minimizeAll}
          aria-label={t('aria.showDesktop')}
          title={t('aria.showDesktop')}
        />
      </div>
    </div>
  )
}
