import type { ComponentType } from 'react'
import {
  Accessibility24Regular,
  Airplane24Regular,
  Apps24Regular,
  ArrowClockwise16Regular,
  ArrowLeft16Regular,
  ArrowRight16Regular,
  ArrowSync24Regular,
  ArrowUp16Regular,
  Battery924Regular,
  BinRecycle24Filled,
  Bluetooth24Regular,
  BrightnessHigh24Regular,
  Calculator24Filled,
  Calendar24Filled,
  Camera24Filled,
  Checkmark16Regular,
  ChevronDown16Regular,
  ChevronRight16Regular,
  ChevronUp16Regular,
  Clock24Regular,
  Cloud24Color,
  CommentText24Regular,
  Desktop24Filled,
  Desktop24Regular,
  Dismiss16Regular,
  Document24Color,
  DocumentText24Color,
  Folder24Filled,
  Games24Regular,
  Globe24Regular,
  HardDrive24Filled,
  Home16Regular,
  Image24Color,
  Image24Filled,
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
  Power24Regular,
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

export const WindowsLogo: IconType = ({ className }) => (
  <svg viewBox="0 0 15 15" className={className} fill="currentColor">
    <path d="M0 2.2 6.5 1.3v6.1H0zM7.5 1.1 15 0v8.3H7.5zM0 8.9h6.5V15L0 14.1zM7.5 9H15v7l-7.5-1z" />
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

/* ---- Coloured app icons (intrinsic fill, like real Win32 icons) ---- */

export const SettingsIcon: IconType = Settings24Color
export const StarIcon: IconType = Star16Color
export const FileIcon: IconType = Document24Color
export const DocFileIcon: IconType = DocumentText24Color
export const ImageFileIcon: IconType = Image24Color
export const CloudIcon: IconType = Cloud24Color
export const ShieldIcon: IconType = Shield24Color
export const MicIcon: IconType = Mic24Color
export const PaintIcon: IconType = PaintBrush24Color
export const FolderIcon: IconType = F(Folder24Filled, '#F4B400')
export const ThisPCIcon: IconType = F(Desktop24Filled, '#3E9BE8')
export const RecycleBinIcon: IconType = F(BinRecycle24Filled, '#5B9BD5')
export const CalculatorIcon: IconType = F(Calculator24Filled, '#3F3F3F')
export const DriveIcon: IconType = F(HardDrive24Filled, '#4A90C4')
export const StickyNoteIcon: IconType = F(Sticker24Filled, '#FFD54F')

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
