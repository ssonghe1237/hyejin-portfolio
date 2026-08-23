import type { ProjectSectionType } from '../../types/project'

const RICH_TEXT_SECTION_TYPES = new Set<ProjectSectionType>([
  'OVERVIEW',
  'KEY_FEATURES',
  'MY_ROLE',
  'ARCHITECTURE',
  'DATABASE_ERD',
  'TROUBLESHOOTING',
  'RESULT',
])

const RICH_TEXT_ROOT_TAGS = new Set([
  'P',
  'H2',
  'H3',
  'UL',
  'OL',
  'BLOCKQUOTE',
  'PRE',
  'HR',
])

const RICH_TEXT_ALLOWED_TAGS = new Set([
  ...RICH_TEXT_ROOT_TAGS,
  'BR',
  'STRONG',
  'EM',
  'S',
  'LI',
  'CODE',
  'A',
])

export function isRichTextProjectSection(
  sectionType: ProjectSectionType,
): boolean {
  return RICH_TEXT_SECTION_TYPES.has(sectionType)
}

/**
 * Distinguishes server-sanitized Tiptap HTML from legacy plain text.
 * A Rich Text value must parse into supported block-level root elements,
 * contain no loose text root nodes, and use only the backend allow-list tags.
 */
export function isProjectRichTextHtml(content: string): boolean {
  if (!content.trim()) {
    return false
  }

  const document = new DOMParser().parseFromString(content, 'text/html')
  const rootElements = Array.from(document.body.children)

  if (
    rootElements.length === 0 ||
    rootElements.some((element) => !RICH_TEXT_ROOT_TAGS.has(element.tagName))
  ) {
    return false
  }

  const hasLooseText = Array.from(document.body.childNodes).some(
    (node) =>
      node.nodeType === Node.TEXT_NODE &&
      Boolean(node.textContent?.trim()),
  )

  if (hasLooseText) {
    return false
  }

  return Array.from(document.body.querySelectorAll('*')).every((element) =>
    RICH_TEXT_ALLOWED_TAGS.has(element.tagName),
  )
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/** Safely converts legacy plain text into Tiptap-compatible paragraphs. */
export function legacyProjectTextToHtml(content: string): string {
  if (!content.trim()) {
    return ''
  }

  return content
    .replaceAll('\r\n', '\n')
    .replaceAll('\r', '\n')
    .split('\n')
    .map((line) => `<p>${line ? escapeHtml(line) : '<br>'}</p>`)
    .join('')
}

export function getProjectRichTextEditorValue(content: string | null): string {
  if (!content) {
    return ''
  }

  return isProjectRichTextHtml(content)
    ? content
    : legacyProjectTextToHtml(content)
}
