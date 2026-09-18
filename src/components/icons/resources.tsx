import { useId } from 'react'
import {
  Document24Color,
  DocumentText24Color,
  Image24Color,
} from '@fluentui/react-icons'
import type { IconType } from '../../core/types'

/* ---- Windows resource icons — flat Fluent-color style ----
 * Fluent's colour iconography is flat geometry with soft two-tone
 * gradients — no skeuomorphic detail (mesh, LEDs, sheen). Where Fluent
 * ships an authentic *Color glyph we use it; the rest are drawn here
 * on the same 20x20 grid with Fluent's own palettes. Gradient ids are
 * per-instance via useId so repeated mounts can't collide. */

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, '')

/** Yellow folder: Fluent flap silhouette + Microsoft's folder ramp. */
export const FolderIcon: IconType = ({ className }) => {
  const id = useUid()
  return (
    <svg viewBox="0 0 20 20" className={className}>
      <defs>
        <linearGradient
          id={`${id}b`}
          x1="10"
          x2="10"
          y1="3"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#F9C23E" />
          <stop offset="1" stopColor="#E09500" />
        </linearGradient>
        <linearGradient
          id={`${id}f`}
          x1="6"
          x2="6"
          y1="7"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".24" stopColor="#FFD638" />
          <stop offset=".64" stopColor="#FAB500" />
          <stop offset=".99" stopColor="#CA6407" />
        </linearGradient>
      </defs>
      <path
        d="M3 5a2 2 0 0 1 2-2h3.1l1.7 1.6H15a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        fill={`url(#${id}b)`}
      />
      <path
        d="M5 7a2 2 0 0 0-2 2v6.5A2.5 2.5 0 0 0 5.5 18h9a2.5 2.5 0 0 0 2.5-2.5V14a2 2 0 0 0-2-2h-1.88a1 1 0 0 1-.7-.3L8.28 7.6A2 2 0 0 0 6.88 7z"
        fill={`url(#${id}f)`}
      />
    </svg>
  )
}

/** This PC: flat blue screen on a simple stand. */
export const ThisPCIcon: IconType = ({ className }) => {
  const id = useUid()
  return (
    <svg viewBox="0 0 20 20" className={className}>
      <defs>
        <linearGradient
          id={`${id}s`}
          x1="10"
          x2="10"
          y1="3"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#6CE0FF" />
          <stop offset="1" stopColor="#2764E7" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="3" width="15" height="10.5" rx="1.6" fill={`url(#${id}s)`} />
      <path d="M8.6 15.8h2.8l.7 1.7H7.9z" fill="#9FB0C4" />
      <rect x="6.2" y="17.2" width="7.6" height="1" rx=".5" fill="#9FB0C4" />
    </svg>
  )
}

/** Recycle bin: flat tapered cup + lid; full adds a paper scrap. */
const BinSvg = ({
  className,
  full,
}: {
  className?: string
  full?: boolean
}) => {
  const id = useUid()
  return (
    <svg viewBox="0 0 20 20" className={className}>
      <defs>
        <linearGradient
          id={`${id}b`}
          x1="10"
          x2="10"
          y1="6"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#E2E9F1" />
          <stop offset="1" stopColor="#A9B8C9" />
        </linearGradient>
      </defs>
      {full && (
        <>
          <rect
            x="5.4"
            y="0.6"
            width="4.6"
            height="3.8"
            rx=".6"
            transform="rotate(-14 7.7 2.5)"
            fill="#EDF2F8"
            stroke="#B9C5D3"
            strokeWidth=".35"
          />
          <circle
            cx="12.9"
            cy="2.7"
            r="1.35"
            fill="#E4EBF3"
            stroke="#B4C0CE"
            strokeWidth=".35"
          />
        </>
      )}
      <path
        d="M5.6 5.4h8.8l-.9 10.4a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7z"
        fill={`url(#${id}b)`}
      />
      <g stroke="#F4F7FB" strokeWidth=".5" opacity=".7" fill="none">
        <path d="M8 6.4l.5 9.6M10 6.4v9.8M12 6.4l-.5 9.6" />
      </g>
      <rect x="4.4" y="3.6" width="11.2" height="1.9" rx=".95" fill="#8DA0B4" />
      <rect x="8.6" y="2.2" width="2.8" height="1.4" rx=".7" fill="#8DA0B4" />
    </svg>
  )
}
export const RecycleBinIcon: IconType = (p) => <BinSvg {...p} />
export const RecycleBinFullIcon: IconType = (p) => <BinSvg {...p} full />

/** Drive: flat metal slab, darker base band, blue accent slot. */
export const DriveIcon: IconType = ({ className }) => {
  const id = useUid()
  return (
    <svg viewBox="0 0 20 20" className={className}>
      <defs>
        <linearGradient
          id={`${id}d`}
          x1="10"
          x2="10"
          y1="5"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#EDF2F8" />
          <stop offset="1" stopColor="#B4C1D1" />
        </linearGradient>
      </defs>
      <rect x="2.6" y="5" width="14.8" height="10" rx="1.8" fill={`url(#${id}d)`} />
      <rect x="2.6" y="12.4" width="14.8" height="1.7" fill="#8FA1B6" opacity=".55" />
      <rect x="4.6" y="8.4" width="7.4" height="1.5" rx=".75" fill="#5CD1FF" />
      <rect x="13.4" y="8.4" width="1.9" height="1.5" rx=".6" fill="#8FA1B6" />
    </svg>
  )
}

/* File-type icons: Fluent's authentic colour glyphs. */
export const FileIcon: IconType = Document24Color
export const DocFileIcon: IconType = DocumentText24Color
export const ImageFileIcon: IconType = Image24Color
