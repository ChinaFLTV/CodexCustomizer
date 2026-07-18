import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
}

export function IconPalette(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H13a1 1 0 0 1-1-1v-.5a4 4 0 0 1 4-4h.5a3.5 3.5 0 0 0 0-7H12Z" />
      <circle cx="7.5" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconPower(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v8" />
      <path d="M7.5 6.5a7 7 0 1 0 9 0" />
    </svg>
  )
}

export function IconSettings(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.6 1.1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  )
}

export function IconInfo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" />
      <circle cx="12" cy="8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconMinimize(props: IconProps) {
  return (
    <svg {...base} width={14} height={14} {...props}>
      <path d="M5 12h14" />
    </svg>
  )
}

export function IconMaximize(props: IconProps) {
  return (
    <svg {...base} width={14} height={14} {...props}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  )
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base} width={14} height={14} {...props}>
      <path d="M7 7l10 10M17 7 7 17" />
    </svg>
  )
}

export function IconPlay(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 6.5v11l10-5.5-10-5.5Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconStop(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function IconSpark(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  )
}

export function IconRefresh(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 5v5h-5" />
    </svg>
  )
}

export function IconAlert(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 9v5" />
      <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
      <path d="M10.3 4.8 2.8 18a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.8a2 2 0 0 0-3.4 0Z" />
    </svg>
  )
}

export function IconCode(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 8 4 12l4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m13 6-2 12" />
    </svg>
  )
}

export function IconDownload(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4v10" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 19h14" />
    </svg>
  )
}

export function IconUpload(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20V10" />
      <path d="m7 14 5-5 5 5" />
      <path d="M5 5h14" />
    </svg>
  )
}

export function IconTrash(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 7h14" />
      <path d="M9 7V5h6v2" />
      <path d="m8 7 1 12h6l1-12" />
    </svg>
  )
}
