import { buildMenus } from './menus'
import type { NotepadState } from './useNotepad'

/* The drop-down menu strip. One menu opens at a time; hover switches
 * while open, like classic Win32 menus. */
export default function MenuBar({ np }: { np: NotepadState }) {
  const { t, openMenu, setOpenMenu } = np
  return (
    <div className="flex shrink-0 items-center border-b border-[#e0e0e0] text-[12.5px]">
      {buildMenus(np).map((m) => (
        <div key={m.name} className="relative z-20">
          <button
            className={`px-2.5 py-[3px] ${
              openMenu === m.name ? 'bg-[#cce8ff]' : 'hover:bg-[#e5f3ff]'
            }`}
            onClick={() => setOpenMenu(openMenu === m.name ? null : m.name)}
            onMouseEnter={() => openMenu && setOpenMenu(m.name)}
          >
            {t(m.name)}
          </button>
          {openMenu === m.name && (
            <div className="anim-menu absolute left-0 top-full z-20 w-52 border border-[#a0a0a0] bg-[#f2f2f2] py-[3px] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
              {m.items.map((it, i) =>
                it === 'sep' ? (
                  <div key={i} className="mx-2 my-[3px] h-px bg-black/15" />
                ) : (
                  <button
                    key={i}
                    disabled={it.disabled}
                    className="flex h-[24px] w-full items-center px-6 text-left text-[12px] hover:bg-[#d4d4d4] disabled:text-[#a0a0a0] disabled:hover:bg-transparent"
                    onClick={() => {
                      it.onClick?.()
                      setOpenMenu(null)
                    }}
                  >
                    <span className="flex-1">
                      {it.checked ? '✓ ' : ''}
                      {t(it.label)}
                    </span>
                    {it.shortcut && (
                      <span className="text-[11px] text-black/50">
                        {it.shortcut}
                      </span>
                    )}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      ))}
      {openMenu && (
        <div
          className="fixed inset-0 z-10"
          onPointerDown={() => setOpenMenu(null)}
        />
      )}
    </div>
  )
}
