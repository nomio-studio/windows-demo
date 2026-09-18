import { useId, type ComponentType, type ReactNode } from 'react'
import {
  Accessibility24Regular,
  Airplane24Regular,
  Apps24Regular,
  AppsListDetailRegular,
  ArrowClockwise16Regular,
  ArrowLeft16Regular,
  ArrowRight16Regular,
  ArrowSync24Regular,
  ArrowUndo16Regular,
  ArrowUp16Regular,
  Battery924Regular,
  Bluetooth24Regular,
  BrightnessHigh24Regular,
  Calculator24Filled,
  Calendar24Filled,
  Camera24Filled,
  Checkmark16Regular,
  ChevronDown16Regular,
  ChevronRight16Regular,
  ChevronUp16Regular,
  ClipboardPaste16Regular,
  Clock24Regular,
  Cloud24Color,
  CommentText24Regular,
  Copy16Regular,
  Cut16Regular,
  Delete16Regular,
  Desktop24Regular,
  Dismiss16Regular,
  DocumentAdd16Regular,
  FolderAdd16Regular,
  Games24Regular,
  Globe24Regular,
  Grid16Regular,
  Home16Regular,
  Image24Filled,
  Info16Regular,
  LineHorizontal116Regular,
  Location24Regular,
  LockClosed16Regular,
  Mail24Filled,
  Map24Filled,
  Maximize16Regular,
  Mic24Color,
  MoreHorizontal20Regular,
  MusicNote224Filled,
  Navigation24Regular,
  PaintBrush24Color,
  Person24Regular,
  PersonCircleFilled,
  PhoneDesktop24Regular,
  Pin16Regular,
  PinOff16Regular,
  Power24Regular,
  Rename16Regular,
  Search24Regular,
  Settings24Color,
  Shield24Color,
  ShieldGlobe24Regular,
  ShieldKeyhole24Regular,
  ShoppingBag24Filled,
  SlideMultiple24Regular,
  Speaker224Regular,
  SquareMultiple16Regular,
  Star16Color,
  Sticker24Filled,
  Tablet24Regular,
  TaskListLtr24Regular,
  TextAddRegular,
  VideoClip24Filled,
  WeatherMoon24Regular,
  WeatherPartlyCloudyDay24Filled,
  Wifi124Regular,
  XboxController24Filled,
  type FluentIconsProps,
} from '@fluentui/react-icons'
import type { IconType } from '../core/types'

/*
 * Icon system backed by Microsoft's Fluent UI System Icons
 * (@fluentui/react-icons). Conventions:
 *
 *  - UI glyphs (taskbar, menus, settings nav): *Regular variants —
 *    thin monochrome outlines via currentColor, matching Windows 10's
 *    Segoe MDL2 glyph weight.
 *  - Win32-style app icons: *Color variants, or *Filled + primaryFill —
 *    intrinsic colour like real desktop icons.
 *  - Modern-app icons (tiles/splash headers): *Filled monochrome —
 *    they inherit white text and render as white glyphs on the app's
 *    accent tile, exactly like Windows 10.
 *  - Brand marks Fluent can't express (Windows logo, Edge swirl) are
 *    drawn below in the same flat style.
 */

/** Build an app icon with an intrinsic fill colour. */
const F =
  (Icon: ComponentType<FluentIconsProps>, primaryFill: string): IconType =>
  ({ className }) => <Icon className={className} primaryFill={primaryFill} />

/* ---- Brand marks (hand-drawn, Fluent-flat style) ---- */

/** The authentic Windows logo quad — standard brand geometry. */
export const WindowsLogo: IconType = ({ className }) => (
  <svg viewBox="0 0 448 512" className={className} fill="currentColor">
    <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
  </svg>
)

export const EdgeIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path d="M8.4 1C4.2 1 1.4 4.3 1.4 8.4c0 .3 0 .7.1 1C2.7 6.6 5.3 5 8.2 5c2.4 0 4.1 1.2 4.8 1.2 1 0 1.5-.8 1.5-1.7C14.5 2.4 11.7 1 8.4 1z" fill="#38B2CE" />
    <path d="M15 7.6c0 4.5-3.2 7.4-7.4 7.4-3.9 0-6.6-2.3-6.6-5.5 0-2.6 2-4.4 4.6-4.4 2 0 3.4 1 3.4 2.7 0 1.3-1 2.2-2.4 2.2-.6 0-1.1-.2-1.5-.5.5 1.9 2.2 3 4.4 3 3.2 0 5.5-2 5.5-4.9z" fill="#2E7FC7" />
    <path d="M5.6 5.1c-2.6 0-4.6 1.8-4.6 4.4C1 12.7 3.7 15 7.6 15c2.4 0 4.5-1 5.8-2.6-1.2.4-2.5.6-3.8.6-3 0-5.3-1.6-5.3-4.3 0-.6.1-1.1.3-1.6-.5.5-.9 1.2-1.1 2 0-2 1-3.4 2.1-4z" fill="#41C8B0" />
  </svg>
)

/* Notepad: two-tone paper so it reads on a white title bar, the dark
 * desktop and a blue tile alike. */
export const NotepadIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <rect x="4" y="3" width="16" height="18" rx="1.5" fill="#F5F7FA" />
    <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3h13A1.5 1.5 0 0 1 20 4.5V8H4z" fill="#2B88D8" />
    <rect x="7" y="11" width="10" height="1.4" rx="0.7" fill="#9BC4EE" />
    <rect x="7" y="14" width="10" height="1.4" rx="0.7" fill="#9BC4EE" />
    <rect x="7" y="17" width="6.5" height="1.4" rx="0.7" fill="#9BC4EE" />
  </svg>
)

/* Tiny solid dot used by the boot spinner. */
export const SpinnerDot: IconType = ({ className }) => (
  <svg viewBox="0 0 8 8" className={className} fill="currentColor">
    <circle cx="4" cy="4" r="3.4" />
  </svg>
)

/* ---- Monochrome UI glyphs (Regular, currentColor) ---- */

export const SearchIcon: IconType = Search24Regular
export const TaskViewIcon: IconType = SlideMultiple24Regular
export const ChevronUp: IconType = ChevronUp16Regular
export const ChevronDown: IconType = ChevronDown16Regular
export const ChevronRight: IconType = ChevronRight16Regular
export const WifiIcon: IconType = Wifi124Regular
export const VolumeIcon: IconType = Speaker224Regular
export const ActionCenterIcon: IconType = CommentText24Regular
export const HamburgerIcon: IconType = Navigation24Regular
export const UserIcon: IconType = Person24Regular
export const AvatarIcon: IconType = PersonCircleFilled
export const PowerIcon: IconType = Power24Regular
export const MinimizeIcon: IconType = LineHorizontal116Regular
export const MaximizeIcon: IconType = Maximize16Regular
export const RestoreIcon: IconType = SquareMultiple16Regular
export const CloseIcon: IconType = Dismiss16Regular
export const BackIcon: IconType = ArrowLeft16Regular
export const ForwardIcon: IconType = ArrowRight16Regular
export const UpIcon: IconType = ArrowUp16Regular
export const RefreshIcon: IconType = ArrowClockwise16Regular
export const SunIcon: IconType = BrightnessHigh24Regular
export const MoonIcon: IconType = WeatherMoon24Regular
export const TabletIcon: IconType = Tablet24Regular
export const BluetoothIcon: IconType = Bluetooth24Regular
export const AirplaneIcon: IconType = Airplane24Regular
export const LocationIcon: IconType = Location24Regular
export const BatteryIcon: IconType = Battery924Regular
export const VpnIcon: IconType = ShieldGlobe24Regular
export const MonitorIcon: IconType = Desktop24Regular
export const LockIcon: IconType = LockClosed16Regular
export const GlobeIcon: IconType = Globe24Regular
export const DotsIcon: IconType = MoreHorizontal20Regular
export const CheckIcon: IconType = Checkmark16Regular
export const HomeIcon: IconType = Home16Regular
export const PinIcon: IconType = Pin16Regular
export const DevicesIcon: IconType = PhoneDesktop24Regular
export const AppsIcon: IconType = Apps24Regular
export const TimeIcon: IconType = Clock24Regular
export const UpdateIcon: IconType = ArrowSync24Regular
export const GamepadIcon: IconType = Games24Regular
export const NetworkIcon: IconType = Globe24Regular
export const EaseIcon: IconType = Accessibility24Regular
export const PrivacyIcon: IconType = ShieldKeyhole24Regular

/* ---- File-operation glyphs (Explorer / dialogs / desktop menus) ---- */

export const CutIcon: IconType = Cut16Regular
export const CopyIcon: IconType = Copy16Regular
export const PasteIcon: IconType = ClipboardPaste16Regular
export const DeleteIcon: IconType = Delete16Regular
export const RenameIcon: IconType = Rename16Regular
export const InfoIcon: IconType = Info16Regular
export const PinOffIcon: IconType = PinOff16Regular
export const NewFolderIcon: IconType = FolderAdd16Regular
export const NewFileIcon: IconType = DocumentAdd16Regular
export const TextAddIcon: IconType = TextAddRegular
export const UndoIcon: IconType = ArrowUndo16Regular
export const GridIcon: IconType = Grid16Regular
export const DetailsIcon: IconType = AppsListDetailRegular
export const TaskMgrIcon: IconType = TaskListLtr24Regular

/* ---- Coloured app icons (intrinsic fill, like real Win32 icons) ---- */

export const SettingsIcon: IconType = Settings24Color
export const StarIcon: IconType = Star16Color
export const CloudIcon: IconType = Cloud24Color
export const ShieldIcon: IconType = Shield24Color
export const MicIcon: IconType = Mic24Color
export const PaintIcon: IconType = PaintBrush24Color
export const CalculatorIcon: IconType = F(Calculator24Filled, '#3F3F3F')
export const StickyNoteIcon: IconType = F(Sticker24Filled, '#FFD54F')

/* ---- Windows resource icons (hand-drawn, glossy Win10 style) ----
 * Desktop/file-system icons get gradients, edge highlights and light
 * perspective — real Win10 icons aren't flat silhouettes. Gradient ids
 * are per-instance via useId so repeated mounts can't collide. */

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, '')

/** Yellow folder: tabbed back, dark opening, soft-lit front flap. */
export const FolderIcon: IconType = ({ className }) => {
  const id = useUid()
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8A824" />
          <stop offset="1" stopColor="#C07F0A" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD65C" />
          <stop offset="1" stopColor="#EF9F1B" />
        </linearGradient>
        <linearGradient id={`${id}sh`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8A5A00" stopOpacity=".3" />
          <stop offset="1" stopColor="#8A5A00" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}hl`} cx=".3" cy=".2" r=".9">
          <stop offset="0" stopColor="#FFF" stopOpacity=".22" />
          <stop offset=".6" stopColor="#FFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M9 14.5a2 2 0 0 1 2-2h6.5l3 3H39a2 2 0 0 1 2 2v4.5H9z"
        fill={`url(#${id}b)`}
      />
      <path d="M11 18.2h26v2.6h-26z" fill="#2E2208" opacity=".55" />
      <path
        d="M6.5 20.5h35l1.7 16.5a2 2 0 0 1-1.9 2H6.7a2 2 0 0 1-1.9-2z"
        fill={`url(#${id}f)`}
      />
      <path
        d="M6.5 20.5h35l1.7 16.5a2 2 0 0 1-1.9 2H6.7a2 2 0 0 1-1.9-2z"
        fill={`url(#${id}hl)`}
      />
      <path d="M6.5 20.5h35l.4 3.4H6.9z" fill={`url(#${id}sh)`} />
      <path d="M6.5 20.5h35" stroke="#FBD25C" strokeWidth=".9" fill="none" />
    </svg>
  )
}

/** This PC: dark-bezel monitor, glossy blue screen, neck and base. */
export const ThisPCIcon: IconType = ({ className }) => {
  const id = useUid()
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FCCF4" />
          <stop offset="1" stopColor="#1E6DBD" />
        </linearGradient>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3D454F" />
          <stop offset="1" stopColor="#20262D" />
        </linearGradient>
      </defs>
      <path d="M20.5 34h7l1.3 6H19.2z" fill="#4E5763" />
      <rect x="14.5" y="40" width="19" height="2.6" rx="1.3" fill="#3A434D" />
      <rect x="5.5" y="7.5" width="37" height="27" rx="2.5" fill={`url(#${id}m)`} />
      <rect x="8" y="10" width="32" height="22" rx=".8" fill={`url(#${id}s)`} />
      <path d="M8 10h15L10 32H8z" fill="#FFF" opacity=".18" />
      <circle cx="24" cy="33.2" r=".9" fill="#8A939E" />
    </svg>
  )
}

/** Recycle bin: tapered silver mesh basket; full adds crumpled paper. */
const BinSvg = ({
  className,
  full,
}: {
  className?: string
  full?: boolean
}) => {
  const id = useUid()
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9E1EA" />
          <stop offset="1" stopColor="#93A1B4" />
        </linearGradient>
      </defs>
      {full && (
        <>
          <path
            d="M14 9.5l6-3.8 8 2.8 7-2.8 4.8 4.8-4 3.2-9-2-7.8 3z"
            fill="#F2F6FA"
            stroke="#C2CDD9"
            strokeWidth=".7"
          />
          <path
            d="M20 8.8q2-3 5-2t4 3-1 5-5 2-4-3z"
            fill="#E4EBF3"
            stroke="#B4C0CE"
            strokeWidth=".7"
          />
        </>
      )}
      <path
        d="M10 13l3.4 28a3 3 0 0 0 3 2.2h15.2a3 3 0 0 0 3-2.2l3.4-28z"
        fill={`url(#${id}b)`}
      />
      <g stroke="#EDF2F8" strokeWidth=".8" opacity=".55" fill="none">
        <path d="M15 13.5l1.6 27M21 13.8l.8 27.5M27 13.8l-.8 27.5M33 13.5l-1.6 27" />
        <path d="M12 21q12 3.5 24 0M12.8 28q11.2 3.2 22.4 0M13.6 35q10.4 2.8 20.8 0" />
      </g>
      <ellipse cx="24" cy="13" rx="14" ry="4.3" fill="#7E8D9D" />
      <ellipse cx="24" cy="13" rx="11.6" ry="3" fill="#5D6B7B" />
      <path
        d="M10 13a14 4.3 0 0 0 28 0"
        fill="none"
        stroke="#AEBCCA"
        strokeWidth=".8"
      />
    </svg>
  )
}
export const RecycleBinIcon: IconType = (p) => <BinSvg {...p} />
export const RecycleBinFullIcon: IconType = (p) => <BinSvg {...p} full />

/** Drive: metal enclosure, light top face, slot + blue bar, LED. */
export const DriveIcon: IconType = ({ className }) => {
  const id = useUid()
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EDF1F6" />
          <stop offset="1" stopColor="#C6CFDB" />
        </linearGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D0D8E2" />
          <stop offset="1" stopColor="#8996A7" />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8B98A9" />
          <stop offset="1" stopColor="#6E7B8C" />
        </linearGradient>
      </defs>
      <path
        d="M9 14.5a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3v3H9z"
        fill={`url(#${id}t)`}
      />
      <path
        d="M9 14.5a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3"
        fill="none"
        stroke="#F7FAFD"
        strokeWidth=".8"
        opacity=".7"
      />
      <rect x="9" y="17.5" width="30" height="16.5" rx="1.5" fill={`url(#${id}c)`} />
      <rect
        x="9"
        y="17.5"
        width="30"
        height="16.5"
        rx="1.5"
        fill="none"
        stroke="#7A8697"
        strokeWidth=".6"
        opacity=".5"
      />
      <rect x="11" y="27.8" width="19" height="3" rx="1" fill={`url(#${id}s)`} />
      <rect x="11.8" y="28.6" width="17.4" height="1.4" rx=".7" fill="#3FA0E8" />
      <circle cx="34.5" cy="29.3" r="1.6" fill="#4E5B6B" />
      <circle cx="34.5" cy="29.3" r="1" fill="#63D374" />
      <path
        d="M9 32.5a1.5 1.5 0 0 0 1.5 1.5h27a1.5 1.5 0 0 0 1.5-1.5z"
        fill="#5D6A7A"
        opacity=".6"
      />
    </svg>
  )
}

/** Page icon: white sheet + folded corner; children add content. */
const PageSvg = ({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) => {
  const id = useUid()
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <defs>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E7EDF5" />
        </linearGradient>
      </defs>
      <path
        d="M13 5.5h15L36 13v28a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2z"
        fill={`url(#${id}p)`}
        stroke="#AFBAC8"
        strokeWidth=".8"
      />
      <path
        d="M28 5.5V12a1 1 0 0 0 1 1h7z"
        fill="#D6DEE9"
        stroke="#AFBAC8"
        strokeWidth=".8"
      />
      {children}
    </svg>
  )
}
export const FileIcon: IconType = (p) => (
  <PageSvg {...p}>
    <rect x="16" y="20" width="16" height="1.6" rx=".8" fill="#B9C6D6" />
    <rect x="16" y="24" width="16" height="1.6" rx=".8" fill="#B9C6D6" />
    <rect x="16" y="28" width="11" height="1.6" rx=".8" fill="#B9C6D6" />
  </PageSvg>
)
export const DocFileIcon: IconType = (p) => (
  <PageSvg {...p}>
    <rect x="16" y="17.5" width="16" height="1.8" rx=".9" fill="#6FA8DC" />
    <rect x="16" y="22" width="16" height="1.8" rx=".9" fill="#8FBCE8" />
    <rect x="16" y="26.5" width="16" height="1.8" rx=".9" fill="#8FBCE8" />
    <rect x="16" y="31" width="10" height="1.8" rx=".9" fill="#8FBCE8" />
  </PageSvg>
)
export const ImageFileIcon: IconType = (p) => (
  <PageSvg {...p}>
    <rect x="15" y="18.5" width="18" height="13" rx="1" fill="#A9D9F2" />
    <circle cx="19.5" cy="22.5" r="1.8" fill="#FFD76B" />
    <path d="M15 31.5l6-7 4 4.5 4-5.5 4 8z" fill="#5C9E62" />
    <rect
      x="15"
      y="18.5"
      width="18"
      height="13"
      rx="1"
      fill="none"
      stroke="#8FB4CC"
      strokeWidth=".6"
    />
  </PageSvg>
)

/* ---- Modern-app glyphs (white on the app's accent tile) ---- */

export const StoreIcon: IconType = ShoppingBag24Filled
export const PhotosIcon: IconType = Image24Filled
export const MailIcon: IconType = Mail24Filled
export const CalendarIcon: IconType = Calendar24Filled
export const XboxIcon: IconType = XboxController24Filled
export const WeatherIcon: IconType = WeatherPartlyCloudyDay24Filled
export const MapsIcon: IconType = Map24Filled
export const MusicIcon: IconType = MusicNote224Filled
export const MoviesIcon: IconType = VideoClip24Filled
export const CameraIcon: IconType = Camera24Filled
