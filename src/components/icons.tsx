import type { IconType } from '../core/types'

/* Monochrome glyph icons (currentColor) and a few full-color app icons. */

export const WindowsLogo: IconType = ({ className }) => (
  <svg viewBox="0 0 15 15" className={className} fill="currentColor">
    <path d="M0 2.2 6.5 1.3v6.1H0zM7.5 1.1 15 0v8.3H7.5zM0 8.9h6.5V15L0 14.1zM7.5 9H15v7l-7.5-1z" />
  </svg>
)

export const SearchIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M6.5 1a5.5 5.5 0 1 0 3.4 9.8l4 4 1.1-1.1-4-4A5.5 5.5 0 0 0 6.5 1zm0 1.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
  </svg>
)

export const TaskViewIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M0 3.5h16v9H0z" opacity=".6" />
    <path d="M2.5 1.5h8v6h-8zM12 6h2.5v6.5H12z" />
  </svg>
)

export const ChevronUp: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M3 10.6 8 5.6l5 5-1.4 1.4L8 8.4 4.4 12z" />
  </svg>
)

export const ChevronDown: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M3 5.4 8 10.4l5-5-1.4-1.4L8 7.6 4.4 4z" />
  </svg>
)

export const ChevronRight: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M5.4 3 10.4 8l-5 5 1.4 1.4L13.2 8 6.8 1.6z" />
  </svg>
)

export const WifiIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <circle cx="8" cy="12.6" r="1.4" />
    <path d="M8 9.2c-1.5 0-2.9.6-3.9 1.6l1.3 1.3A3.7 3.7 0 0 1 8 10.8c1 0 1.9.5 2.6 1.3l1.3-1.3A5.2 5.2 0 0 0 8 9.2z" />
    <path d="M8 5.4C5.2 5.4 2.7 6.5.8 8.4l1.3 1.3A8.2 8.2 0 0 1 8 7c2.3 0 4.3.9 5.9 2.5l1.3-1.3A9.8 9.8 0 0 0 8 5.4z" />
  </svg>
)

export const VolumeIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M9.5 1.5 5.2 5.5H2v5h3.2l4.3 4z" />
    <path d="M11.6 5a4.3 4.3 0 0 1 0 6l-1-1a2.8 2.8 0 0 0 0-4zM13.2 3.4a6.8 6.8 0 0 1 0 9.2l-1-1a5.3 5.3 0 0 0 0-7.2z" />
  </svg>
)

export const ActionCenterIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M1 1.5h14V11H8.9L4.5 14.5V11H1zm2 3v1.4h10V4.6zm0 2.8v1.4h6.5V7.3z" />
  </svg>
)

export const HamburgerIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M1.5 3.5h13v1.5h-13zM1.5 7.25h13v1.5h-13zM1.5 11h13v1.5h-13z" />
  </svg>
)

export const UserIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <circle cx="8" cy="5" r="3" />
    <path d="M8 9.5c-3.1 0-5.6 2-5.6 4.5v.5h11.2V14c0-2.5-2.5-4.5-5.6-4.5z" />
  </svg>
)

export const AvatarIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="currentColor">
    <circle cx="24" cy="24" r="24" fill="#7d7d7d" />
    <circle cx="24" cy="18" r="8" fill="#e8e8e8" />
    <path d="M24 28c-8 0-14 5-14 11.5V41a24 24 0 0 0 28 0v-1.5C38 33 32 28 24 28z" fill="#e8e8e8" />
  </svg>
)

export const PowerIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 1.5v6" />
    <path d="M4.6 3.4a6 6 0 1 0 6.8 0" />
  </svg>
)

export const SettingsIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M6.9.8h2.2l.4 2a5.7 5.7 0 0 1 1.7.7l1.9-.9 1.5 1.5-.9 1.9c.3.5.6 1.1.7 1.7l2 .4v2.2l-2 .4a5.7 5.7 0 0 1-.7 1.7l.9 1.9-1.5 1.5-1.9-.9a5.7 5.7 0 0 1-1.7.7l-.4 2H6.9l-.4-2a5.7 5.7 0 0 1-1.7-.7l-1.9.9-1.5-1.5.9-1.9a5.7 5.7 0 0 1-.7-1.7l-2-.4V9.1l2-.4c.1-.6.4-1.2.7-1.7l-.9-1.9 1.5-1.5 1.9.9c.5-.3 1.1-.6 1.7-.7z" />
    <circle cx="8" cy="8" r="2.4" fill="#fff" />
    <circle cx="8" cy="8" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
)

export const MinimizeIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 10 10" className={className} fill="none" stroke="currentColor">
    <path d="M0 5h10" />
  </svg>
)

export const MaximizeIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 10 10" className={className} fill="none" stroke="currentColor">
    <rect x="0.5" y="0.5" width="9" height="9" />
  </svg>
)

export const RestoreIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 10 10" className={className} fill="none" stroke="currentColor">
    <path d="M2.5 2.5h7v7h-7z" />
    <path d="M2.5 7.5h-2v-7h7v2" />
  </svg>
)

export const CloseIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 10 10" className={className} fill="none" stroke="currentColor">
    <path d="M0.5 0.5l9 9M9.5 0.5l-9 9" />
  </svg>
)

export const BackIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10.5 2 5 8l5.5 6" />
  </svg>
)

export const ForwardIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5.5 2 11 8l-5.5 6" />
  </svg>
)

export const UpIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 14V2M3 7l5-5 5 5" />
  </svg>
)

export const RefreshIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9L10.4 5.6H15V1z" />
    <path d="M2.5 8a5.5 5.5 0 0 1 1.6-3.9l1.5-1.5H1v4.6z" opacity="0" />
    <path d="M8 13.5A5.5 5.5 0 0 1 3 10.4l-1.5.4A7 7 0 0 0 8 15z" opacity="0" />
  </svg>
)

/* ---- Full-color app/file icons ---- */

export const FolderIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h3.3L7.2 3.6h6.3A1.5 1.5 0 0 1 15 5.1v1H1z" fill="#E8B93E" />
    <path d="M1 5.5h14v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5z" fill="#FFD35C" />
    <path d="M1 5.5h14v.8H1z" fill="#F0C44F" />
  </svg>
)

export const ThisPCIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <rect x="1" y="2" width="14" height="9.5" rx="0.8" fill="#4C9AD9" />
    <rect x="2" y="3" width="12" height="7.5" fill="#BEE3F8" />
    <path d="M6 13.5h4l-.6-2H6.6z" fill="#7F7F7F" />
    <rect x="4" y="13.5" width="8" height="1" rx="0.5" fill="#636363" />
  </svg>
)

export const RecycleBinIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path d="M3.5 3h9l-.8 10.2a1.3 1.3 0 0 1-1.3 1.3H5.6a1.3 1.3 0 0 1-1.3-1.3z" fill="#8FB6D9" />
    <path d="M3.5 3h9l-.2 2.5H3.7z" fill="#A9CBE5" />
    <path d="M5 1.5l1.2 1L5.4 3.6 4 2.4zM8.5 1l1.5.8-1 1.2-1.3-.8zM11 2l1.3 1.2-1 1-1.2-1.4z" fill="#EDEDED" />
    <rect x="2.5" y="2.6" width="11" height="0.9" rx="0.45" fill="#6E97B8" />
  </svg>
)

export const EdgeIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path d="M8.4 1C4.2 1 1.4 4.3 1.4 8.4c0 .3 0 .7.1 1C2.7 6.6 5.3 5 8.2 5c2.4 0 4.1 1.2 4.8 1.2 1 0 1.5-.8 1.5-1.7C14.5 2.4 11.7 1 8.4 1z" fill="#38B2CE" />
    <path d="M15 7.6c0 4.5-3.2 7.4-7.4 7.4-3.9 0-6.6-2.3-6.6-5.5 0-2.6 2-4.4 4.6-4.4 2 0 3.4 1 3.4 2.7 0 1.3-1 2.2-2.4 2.2-.6 0-1.1-.2-1.5-.5.5 1.9 2.2 3 4.4 3 3.2 0 5.5-2 5.5-4.9z" fill="#2E7FC7" />
    <path d="M5.6 5.1c-2.6 0-4.6 1.8-4.6 4.4C1 12.7 3.7 15 7.6 15c2.4 0 4.5-1 5.8-2.6-1.2.4-2.5.6-3.8.6-3 0-5.3-1.6-5.3-4.3 0-.6.1-1.1.3-1.6-.5.5-.9 1.2-1.1 2 0-2 1-3.4 2.1-4z" fill="#41C8B0" />
  </svg>
)

export const NotepadIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <rect x="2.5" y="1" width="11" height="14" rx="0.6" fill="#F5F5F5" stroke="#B9B9B9" strokeWidth="0.5" />
    <rect x="2.5" y="1" width="11" height="3" rx="0.6" fill="#3E92E8" />
    <rect x="4" y="6" width="8" height="0.9" fill="#9BC4EE" />
    <rect x="4" y="8.2" width="8" height="0.9" fill="#9BC4EE" />
    <rect x="4" y="10.4" width="5.5" height="0.9" fill="#9BC4EE" />
  </svg>
)

export const CalculatorIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <rect x="2" y="1" width="12" height="14" rx="1" fill="#515151" />
    <rect x="3.5" y="2.5" width="9" height="3" rx="0.4" fill="#D6E8F5" />
    <rect x="3.5" y="6.5" width="2" height="1.8" fill="#EDEDED" />
    <rect x="7" y="6.5" width="2" height="1.8" fill="#EDEDED" />
    <rect x="10.5" y="6.5" width="2" height="1.8" fill="#EDEDED" />
    <rect x="3.5" y="9.3" width="2" height="1.8" fill="#EDEDED" />
    <rect x="7" y="9.3" width="2" height="1.8" fill="#EDEDED" />
    <rect x="10.5" y="9.3" width="2" height="1.8" fill="#FFB44D" />
    <rect x="3.5" y="12.1" width="2" height="1.8" fill="#EDEDED" />
    <rect x="7" y="12.1" width="2" height="1.8" fill="#EDEDED" />
    <rect x="10.5" y="12.1" width="2" height="1.8" fill="#FFB44D" />
  </svg>
)

export const StoreIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path d="M4.2 5V4a3.8 3.8 0 0 1 7.6 0v1H14l-0.8 10H2.8L2 5z" fill="#0078D7" />
    <path d="M6 5V4a2 2 0 0 1 4 0v1h1V4a3 3 0 0 0-6 0v1z" fill="#fff" opacity=".9" />
    <path d="M5.4 7.4 7 7.1v2.4H5.4zM7.8 7l1.8-.3v3.1l-1.8-.3zM5.4 10.4H7v2.4l-1.6-.3zM7.8 10.3l1.8.3v2.9l-1.8-.3z" fill="#fff" />
  </svg>
)

export const PhotosIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <rect x="1" y="2.5" width="14" height="11" rx="0.8" fill="#7A5EA8" />
    <circle cx="5" cy="6" r="1.4" fill="#FFCF4D" />
    <path d="M1 11.5 4.8 8l2.7 2.7L10 7l5 4.5v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z" fill="#E8E8E8" />
  </svg>
)

export const MailIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <rect x="1" y="3" width="14" height="10" rx="0.8" fill="#0078D7" />
    <path d="M1.5 3.5 8 8.8l6.5-5.3" fill="none" stroke="#fff" strokeWidth="1" />
  </svg>
)

export const CalendarIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <rect x="1.5" y="2" width="13" height="12.5" rx="0.8" fill="#F0F0F0" />
    <rect x="1.5" y="2" width="13" height="3.4" rx="0.8" fill="#D83B01" />
    <rect x="4" y="7" width="2.2" height="1.6" fill="#D83B01" />
    <rect x="6.9" y="7" width="2.2" height="1.6" fill="#B9B9B9" />
    <rect x="9.8" y="7" width="2.2" height="1.6" fill="#B9B9B9" />
    <rect x="4" y="9.6" width="2.2" height="1.6" fill="#B9B9B9" />
    <rect x="6.9" y="9.6" width="2.2" height="1.6" fill="#B9B9B9" />
  </svg>
)

export const XboxIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <circle cx="8" cy="8" r="7" fill="#107C10" />
    <path d="M8 7.2C6.4 5.5 4.6 4.2 3.2 3.6A6.9 6.9 0 0 0 1.5 8c0 1.4.4 2.7 1.2 3.8.6-1.7 2.1-3.4 5.3-4.6zM8 7.2c1.6-1.7 3.4-3 4.8-3.6A6.9 6.9 0 0 1 14.5 8c0 1.4-.4 2.7-1.2 3.8-.6-1.7-2.1-3.4-5.3-4.6z" fill="#fff" opacity=".95" />
  </svg>
)

export const WeatherIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <circle cx="5.5" cy="5.5" r="3" fill="#FFB900" />
    <path d="M5.5 12.5a2.7 2.7 0 0 1-.3-5.4A3.8 3.8 0 0 1 12.6 8a2.4 2.4 0 0 1-.4 4.7z" fill="#E8E8E8" />
  </svg>
)

export const MapsIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path d="M1 3.5 6 1.5l4 2 5-2v11l-5 2-4-2-5 2z" fill="#4CAF50" />
    <path d="M6 1.5v13M10 3.5v13" stroke="#fff" strokeWidth="0.8" />
    <circle cx="8" cy="7" r="2.2" fill="#D83B01" />
  </svg>
)

export const MusicIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path d="M6 12.5V3.8l7.5-1.6v8.6" fill="none" stroke="#D83B01" strokeWidth="1.4" />
    <circle cx="4.3" cy="12.5" r="2" fill="#D83B01" />
    <circle cx="11.8" cy="10.8" r="2" fill="#D83B01" />
  </svg>
)

export const MoviesIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <rect x="1" y="3" width="14" height="10" rx="0.8" fill="#5B2D8E" />
    <path d="M1 5h14M1 11h14" stroke="#fff" strokeWidth="0.7" opacity=".6" />
    <path d="M6.5 6.2 11 8l-4.5 1.8z" fill="#fff" />
  </svg>
)

export const CameraIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <rect x="1" y="4.5" width="14" height="9" rx="1" fill="#4A4A4A" />
    <rect x="5.5" y="2.5" width="5" height="2" rx="0.5" fill="#4A4A4A" />
    <circle cx="8" cy="9" r="3" fill="#8EC9F0" />
    <circle cx="8" cy="9" r="1.6" fill="#2B2B2B" />
  </svg>
)

export const StickyNoteIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path d="M2 1.5h12V11l-3.5 3.5H2z" fill="#FFD54F" />
    <path d="M14 11h-3.5v3.5z" fill="#E8B93E" />
    <path d="M4 5h8M4 7.5h8M4 10h5" stroke="#B8891A" strokeWidth="0.9" />
  </svg>
)

export const MicIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <rect x="5.5" y="1" width="5" height="8" rx="2.5" fill="#0078D7" />
    <path d="M3.5 7.5a4.5 4.5 0 0 0 9 0h-1.4a3.1 3.1 0 0 1-6.2 0z" fill="#0078D7" />
    <rect x="7.3" y="12" width="1.4" height="2.5" fill="#0078D7" />
    <rect x="5" y="14.3" width="6" height="1" fill="#0078D7" />
  </svg>
)

export const PaintIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path d="M8 1.5a6.5 6.5 0 1 0 0 13c1 0 1.5-.7 1.5-1.4 0-.9-.7-1.2-.7-2.1 0-.8.7-1.5 1.7-1.5h2A3.3 3.3 0 0 0 15.5 6C14.9 3 11.7 1.5 8 1.5z" fill="#E8E8E8" />
    <circle cx="4.5" cy="6" r="1.1" fill="#D83B01" />
    <circle cx="7.5" cy="4" r="1.1" fill="#FFB900" />
    <circle cx="10.8" cy="5.5" r="1.1" fill="#107C10" />
    <circle cx="5" cy="9.5" r="1.1" fill="#0078D7" />
  </svg>
)

export const FileIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path d="M3 1h7l3 3v11H3z" fill="#F0F0F0" stroke="#B9B9B9" strokeWidth="0.5" />
    <path d="M10 1v3h3z" fill="#C8C8C8" />
  </svg>
)

export const DocFileIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path d="M3 1h7l3 3v11H3z" fill="#2B579A" />
    <path d="M10 1v3h3z" fill="#1F3F74" />
    <path d="M5.5 8h5M5.5 10h5M5.5 12h3.5" stroke="#fff" strokeWidth="0.9" />
  </svg>
)

export const ImageFileIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <rect x="2" y="2.5" width="12" height="11" rx="0.6" fill="#4C9AD9" />
    <circle cx="5" cy="6" r="1.1" fill="#FFCF4D" />
    <path d="M2 11.5 5 8.8l2.5 2.2L9.5 9l4.5 4v.3a.8.8 0 0 1-.8.7H2.8a.8.8 0 0 1-.8-.7z" fill="#C8E6C9" />
  </svg>
)

export const DriveIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <rect x="1" y="4.5" width="14" height="8" rx="1" fill="#8FA8C8" />
    <rect x="2" y="10" width="9" height="1.2" rx="0.6" fill="#5C7391" />
    <circle cx="13" cy="10.6" r="0.8" fill="#7CFC9A" />
  </svg>
)

export const CloudIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path d="M4.7 13a3.2 3.2 0 0 1-.4-6.4A4.6 4.6 0 0 1 13 7.7 2.8 2.8 0 0 1 12.3 13z" fill="#4A9CF5" />
  </svg>
)

export const ShieldIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className}>
    <path d="M8 1 2 3.5V8c0 3.8 2.5 6.2 6 7 3.5-.8 6-3.2 6-7V3.5z" fill="#F7D154" />
    <path d="M8 1v14M2 3.5 8 5.5l6-2" stroke="#D4AC2B" strokeWidth="0.7" fill="none" />
  </svg>
)

/* ---- Quick-action / settings glyphs ---- */

export const SunIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.3">
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6 13 13M13 3l-1.4 1.4M4.4 11.6 3 13" />
  </svg>
)

export const MoonIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M13.8 10.4A6.3 6.3 0 0 1 5.6 2.2 6.3 6.3 0 1 0 13.8 10.4z" />
  </svg>
)

export const TabletIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <rect x="3" y="1.5" width="10" height="13" rx="1" fill="none" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="8" cy="12.6" r="0.8" />
  </svg>
)

export const BluetoothIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
    <path d="M4 4.5 12 11.5 8 14V2l4 2.5L4 11.5" />
  </svg>
)

export const AirplaneIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M15 8.8 9.5 6.6V2.3a1.3 1.3 0 0 0-2.6 0v4.3L1 8.8v1.7l5.9-1.7v3.5l-1.7 1.2v1.2l2.8-.8 2.8.8v-1.2l-1.7-1.2V8.8l5.9 1.7z" />
  </svg>
)

export const LocationIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M8 1a5 5 0 0 0-5 5c0 3.7 5 9 5 9s5-5.3 5-9a5 5 0 0 0-5-5zm0 6.8a1.9 1.9 0 1 1 0-3.7 1.9 1.9 0 0 1 0 3.7z" />
  </svg>
)

export const BatteryIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
    <rect x="1" y="5" width="12" height="6" rx="0.8" />
    <path d="M14.5 7v2" strokeWidth="1.6" />
    <rect x="2.5" y="6.5" width="6" height="3" fill="currentColor" stroke="none" />
  </svg>
)

export const VpnIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M1.5 8h13M8 1.5c-4 3.5-4 9.5 0 13 4-3.5 4-9.5 0-13z" />
  </svg>
)

export const MonitorIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <rect x="1" y="2.5" width="14" height="9" rx="0.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
    <path d="M6 13.8h4M8 11.5v2.3" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)

export const StarIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="#7AC3F0">
    <path d="M8 1.5 9.9 5.6l4.4.6-3.2 3.1.8 4.4L8 11.6l-3.9 2.1.8-4.4-3.2-3.1 4.4-.6z" />
  </svg>
)

export const LockIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.3">
    <rect x="3" y="7" width="10" height="7" rx="1" />
    <path d="M5.5 7V4.5a2.5 2.5 0 0 1 5 0V7" />
  </svg>
)

export const GlobeIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.1">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M1.5 8h13M8 1.5c-4 3.5-4 9.5 0 13 4-3.5 4-9.5 0-13z" />
  </svg>
)

export const DotsIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <circle cx="3" cy="8" r="1.5" />
    <circle cx="8" cy="8" r="1.5" />
    <circle cx="13" cy="8" r="1.5" />
  </svg>
)

export const CheckIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M2.5 8.5 6.5 12.5 13.5 4" />
  </svg>
)

export const HomeIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M2 8 8 2.5 14 8M4 7v6.5h8V7" />
  </svg>
)

export const PinIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M9.5 1.5 14.5 6.5l-1.7.4-2.8-.6-4 4L5 14l-1.5-1.5L7 9 6.4 6.2 6 4.5z" transform="rotate(45 8 8)" />
    <path d="M6 1.8 9 1l5.5 5.5L14 9.5l-.8.6L6.5 3z" />
  </svg>
)

export const DevicesIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <rect x="1" y="3" width="10" height="7" rx="0.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <rect x="9" y="6.5" width="6" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
  </svg>
)

export const AppsIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <rect x="1.5" y="1.5" width="6" height="6" rx="0.8" />
    <rect x="8.5" y="1.5" width="6" height="6" rx="0.8" opacity=".7" />
    <rect x="1.5" y="8.5" width="6" height="6" rx="0.8" opacity=".7" />
    <rect x="8.5" y="8.5" width="6" height="6" rx="0.8" />
  </svg>
)

export const TimeIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.3">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M8 4.5V8l2.5 1.5" />
  </svg>
)

export const UpdateIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9" />
    <path d="M14 1v3.5h-3.5" />
  </svg>
)

export const GamepadIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M5 4.5h6a4.5 4.5 0 0 1 4.4 5.4c-.3 1.3-1.4 2.1-2.6 2.1-1 0-1.9-.6-2.4-1.5H5.6c-.5.9-1.4 1.5-2.4 1.5-1.2 0-2.3-.8-2.6-2.1A4.5 4.5 0 0 1 5 4.5z" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5 7v3M3.5 8.5h3" stroke="currentColor" strokeWidth="1.1" />
    <circle cx="11" cy="7.5" r="0.9" />
    <circle cx="12.5" cy="9.5" r="0.9" />
  </svg>
)

export const NetworkIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <rect x="1" y="2" width="14" height="9" rx="0.8" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 11v3M5.5 14h5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M3 8.5l2.5-3 2 2L11 4" stroke="currentColor" strokeWidth="1.1" fill="none" />
  </svg>
)

export const EaseIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M8 1.5v13M1.5 8h13" strokeDasharray="2 1.6" />
  </svg>
)

export const PrivacyIcon: IconType = ({ className }) => (
  <svg viewBox="0 0 16 16" className={className} fill="currentColor">
    <path d="M8 1 2 3.5V8c0 3.8 2.5 6.2 6 7 3.5-.8 6-3.2 6-7V3.5z" fill="none" stroke="currentColor" strokeWidth="1.3" />
    <path d="M8 4.5a2 2 0 0 1 2 2v.8h.5v3.2h-5V7.3H6v-.8a2 2 0 0 1 2-2z" />
  </svg>
)

export const SpinnerDot: IconType = ({ className }) => (
  <svg viewBox="0 0 8 8" className={className} fill="currentColor">
    <circle cx="4" cy="4" r="3.4" />
  </svg>
)
