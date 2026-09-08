/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectSectionBody.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 상세 섹션 본문 컴포넌트
 *                  - 일반 섹션 본문 출력
 *                  - WORKFLOW 섹션의 Mermaid 차트 렌더링 분기 처리
 *                  - Rich Text 대상 섹션의 안전한 HTML 본문 렌더링
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       CSS Module 스타일 분리
 * 2026-08-24        Song       Rich Text와 일반 본문 렌더링 분기 추가
 */

import type { ProjectSectionType } from '../../../types/project'
import MermaidRenderer from './MermaidRenderer'
import RichTextContent from '../../common/RichTextContent'
import {
  isProjectRichTextHtml,
  isRichTextProjectSection,
} from '../projectRichText'
import styles from './ProjectSectionBody.module.css'

interface ProjectSectionBodyProps {
  sectionType: ProjectSectionType
  content: string | null
}

function ProjectSectionBody({ sectionType, content }: ProjectSectionBodyProps) {
  if (!content) {
    return null
  }

  if (sectionType === 'WORKFLOW') {
    return <MermaidRenderer chart={content} />
  }

  if (
    isRichTextProjectSection(sectionType) &&
    isProjectRichTextHtml(content)
  ) {
    return (
      <RichTextContent
        html={content}
        className={styles.richText}
      />
    )
  }

  return (
    <p className={styles.body}>
      {content}
    </p>
  )
}

export default ProjectSectionBody
