import type { ComponentType } from 'react'
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
  DocumentAdd16Regular,
  FolderAdd16Regular,
  Games24Regular,
  Globe24Regular,
  Grid16Regular,
  History24Regular,
  Home16Regular,
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
import type { IconType } from '../../core/types'

/*
 * Fluent-backed glyphs (@fluentui/react-icons). Conventions:
 *
 *  - UI glyphs (taskbar, menus, settings nav): *Regular variants —
 *    thin monochrome outlines via currentColor, matching Windows 10's
 *    Segoe MDL2 glyph weight.
 *  - Win32-style app icons: *Color variants, or *Filled + primaryFill —
 *    intrinsic colour like real desktop icons.
 *  - Modern-app icons (tiles/splash headers): *Filled monochrome —
 *    they inherit white text and render as white glyphs on the app's
 *    accent tile, exactly like Windows 10.
 */

/** Build an app icon with an intrinsic fill colour. */
const F =
  (Icon: ComponentType<FluentIconsProps>, primaryFill: string): IconType =>
  ({ className }) => <Icon className={className} primaryFill={primaryFill} />

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
