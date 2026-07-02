/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectSectionBody.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 상세 섹션 본문 컴포넌트
 *                  - 일반 섹션 본문 출력
 *                  - WORKFLOW 섹션의 Mermaid 차트 렌더링 분기 처리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 */

import type { ProjectSectionType } from '../../../types/project'
import MermaidRenderer from './MermaidRenderer'

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

  return (
    <p
      style={{
        margin: '20px 0 0',
        color: '#333',
        fontSize: '16px',
        lineHeight: 1.8,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {content}
    </p>
  )
}

export default ProjectSectionBody