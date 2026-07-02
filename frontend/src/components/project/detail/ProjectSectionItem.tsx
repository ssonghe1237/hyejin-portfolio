/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectSectionItem.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 상세 섹션 단일 카드 컴포넌트
 *                  - 섹션 유형, 제목, 이미지, 본문 영역 조립
 *                  - 섹션별 콘텐츠 표시 구조 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 */

import type { ProjectSectionResponse } from '../../../types/project'
import ProjectSectionBody from './ProjectSectionBody'
import ProjectSectionImages from './ProjectSectionImages'

interface ProjectSectionItemProps {
  section: ProjectSectionResponse
}

function ProjectSectionItem({ section }: ProjectSectionItemProps) {
  return (
    <article
      style={{
        border: '1px solid #e5e5e5',
        borderRadius: '24px',
        padding: '32px',
        backgroundColor: '#fff',
      }}
    >
      <p
        style={{
          margin: 0,
          color: '#777',
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '0.08em',
        }}
      >
        {section.sectionType}
      </p>

      {section.title && (
        <h3
          style={{
            margin: '16px 0 0',
            fontSize: '28px',
            letterSpacing: '-0.04em',
          }}
        >
          {section.title}
        </h3>
      )}

      <ProjectSectionImages
        images={section.images}
        sectionType={section.sectionType}
      />

      <ProjectSectionBody
        sectionType={section.sectionType}
        content={section.content}
      />
    </article>
  )
}

export default ProjectSectionItem