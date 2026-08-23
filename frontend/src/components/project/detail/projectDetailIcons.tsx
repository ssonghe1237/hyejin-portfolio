import type { ProjectLinkType } from '../../../types/project'
import type { ReactNode } from 'react'

/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : projectDetailIcons.tsx
 * author         : Song
 * date           : 2026-08-18
 * description    : Project Detail 전용 Category / Link inline icon
 *                  - currentColor 기반의 일관된 outline icon 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-18        Song       최초 생성
 */

interface IconProps {
  className?: string
}

interface IconFrameProps extends IconProps {
  children: ReactNode
}

function IconFrame({ className, children }: IconFrameProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  )
}

function ServerIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="3" y="4" width="18" height="6" rx="2" />
      <rect x="3" y="14" width="18" height="6" rx="2" />
      <path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" />
    </IconFrame>
  )
}

function MonitorIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </IconFrame>
  )
}

function DatabaseIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
    </IconFrame>
  )
}

function SparklesIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" />
      <path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3ZM5 13l.8 2.2L8 16l-2.2.8L5 19l-.8-2.2L2 16l2.2-.8L5 13Z" />
    </IconFrame>
  )
}

function BoxIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="m4 7 8-4 8 4-8 4-8-4Z" />
      <path d="m4 7 8 4 8-4v10l-8 4-8-4V7ZM12 11v10" />
    </IconFrame>
  )
}

function RepositoryIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M5 3h12a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2V3Z" />
      <path d="M9 7h6M9 11h6M5 17h14" />
    </IconFrame>
  )
}

function FileIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M6 3h8l4 4v14H6V3Z" />
      <path d="M14 3v5h4M9 13h6M9 17h6" />
    </IconFrame>
  )
}

function ExternalIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="3" y="5" width="14" height="14" rx="2" />
      <path d="M13 3h8v8M21 3l-9 9" />
    </IconFrame>
  )
}

export function TechCategoryIcon({
  category,
  className,
}: IconProps & { category: string }) {
  switch (category.trim().toLowerCase()) {
    case 'backend':
      return <ServerIcon className={className} />
    case 'frontend':
      return <MonitorIcon className={className} />
    case 'database':
      return <DatabaseIcon className={className} />
    case 'ai':
      return <SparklesIcon className={className} />
    case 'infra':
      return <BoxIcon className={className} />
    default:
      return null
  }
}

export function ProjectLinkIcon({
  linkType,
  className,
}: IconProps & { linkType: ProjectLinkType }) {
  if (linkType === 'GITHUB') {
    return <RepositoryIcon className={className} />
  }

  if (linkType === 'PDF' || linkType === 'RESUME') {
    return <FileIcon className={className} />
  }

  return <ExternalIcon className={className} />
}
