import { useId, type ComponentType } from 'react'
import {
  Accessibility24Regular,
  Airplane24Regular,
  Apps24Regular,
  AppsListDetailRegular,
  ArrowClockwise16Regular,
  ArrowDownload24Regular,
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
  Document24Color,
  DocumentAdd16Regular,
  DocumentText24Color,
  FolderAdd16Regular,
  Games24Regular,
  Globe24Regular,
  Grid16Regular,
  History24Regular,
  Home16Regular,
  Image24Color,
  Image24Filled,
  Info16Regular,
  Keyboard24Regular,
  LineHorizontal116Regular,
  Location24Regular,
  LockClosed16Regular,
  Mail24Filled,
  Map24Filled,
  Maximize16Regular,
  Mic24Color,
  MoreHorizontal20Regular,
  Cursor24Regular,
  MusicNote224Filled,
  Navigation24Regular,
  PaintBrush24Color,
  Person24Regular,
  PersonCircleFilled,
  PhoneDesktop24Regular,
  Pin16Regular,
  PinOff16Regular,
  Power24Regular,
  Print24Regular,
  Record24Regular,
  Rename16Regular,
  Search24Regular,
  Settings24Color,
  Shield24Color,
  ShieldGlobe24Regular,
  ShieldKeyhole24Regular,
  ShieldTask24Regular,
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

/* ---- Settings-page glyphs ---- */

export const MouseIcon: IconType = Cursor24Regular
export const KeyboardIcon: IconType = Keyboard24Regular
export const PrinterIcon: IconType = Print24Regular
export const HistoryIcon: IconType = History24Regular
export const RecordIcon: IconType = Record24Regular
export const DownloadIcon: IconType = ArrowDownload24Regular
export const ShieldTaskIcon: IconType = ShieldTask24Regular

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
