import type { ContextMenuItem } from '../core/store/system'
import { CheckIcon, ChevronRight } from './icons'

interface Props {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
}

const ROW_H = 26
const MENU_W = 230

function MenuList({
  items,
  onClose,
  flipX,
}: {
  items: ContextMenuItem[]
  onClose: () => void
  flipX: boolean
}) {
  return (
    <div className="w-[230px] border border-[#9a9a9a]/60 bg-[#f2f2f2]/95 py-[3px] text-black shadow-[0_4px_16px_rgba(0,0,0,0.35)] backdrop-blur-md">
      {items.map((item, i) =>
        item.type === 'separator' ? (
          <div key={i} className="mx-2 my-[3px] h-px bg-black/15" />
        ) : (
          <div key={i} className="group relative">
            <button
              disabled={item.disabled}
              onClick={() => {
                if (item.submenu) return
                item.onClick?.()
                onClose()
              }}
              className={`flex h-[26px] w-full items-center gap-2 px-2 text-left text-[12px] ${
                item.disabled ? 'text-black/40' : 'group-hover:bg-[#d4d4d4]'
              }`}
            >
              <span className="w-5 shrink-0 text-center">
                {item.checked && <CheckIcon className="mx-auto size-3" />}
                {!item.checked && item.icon && <item.icon className="mx-auto size-3.5" />}
              </span>
              <span className="flex-1 truncate">{item.label}</span>
              {item.shortcut && (
                <span className="text-[11px] text-black/50">{item.shortcut}</span>
              )}
              {item.submenu && <ChevronRight className="size-3 text-black/60" />}
            </button>
            {item.submenu && !item.disabled && (
              <div
                className={`invisible absolute top-[-4px] z-10 group-hover:visible ${
                  flipX ? 'right-full' : 'left-full'
                }`}
              >
                <MenuList items={item.submenu} onClose={onClose} flipX={flipX} />
              </div>
            )}
          </div>
        ),
      )}
    </div>
  )
}

/**
 * Classic Windows context menu. Rendered fixed at the cursor with
 * viewport clamping; an invisible backdrop swallows outside clicks.
 */
export default function ContextMenu({ x, y, items, onClose }: Props) {
  const estH = items.length * (ROW_H + 1) + 8
  const cx = Math.max(0, Math.min(x, window.innerWidth - MENU_W - 8))
  const cy = Math.max(0, Math.min(y, window.innerHeight - estH - 8))
  // No room for a submenu to the right — open them leftwards instead.
  const flipX = cx + MENU_W * 2 + 8 > window.innerWidth
  return (
    <>
      <div
        className="fixed inset-0 z-[69000]"
        onPointerDown={onClose}
        onContextMenu={(e) => {
          e.preventDefault()
          onClose()
        }}
      />
      <div className="anim-menu fixed z-[70000]" style={{ left: cx, top: cy }}>
        <MenuList items={items} onClose={onClose} flipX={flipX} />
      </div>
    </>
  )
}
