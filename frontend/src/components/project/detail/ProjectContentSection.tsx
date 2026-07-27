/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectContentSection.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 상세 섹션 컴포넌트
 *                  - 프로젝트 상세 섹션 목록 출력
 *                  - 섹션 단일 렌더링은 ProjectSectionItem에 위임
 *                  - 빈 섹션 데이터 출력 방지
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       상세 섹션 목록 출력 추가
 * 2026-07-02        Song       WORKFLOW 섹션 Mermaid 렌더링 추가
 * 2026-07-02        Song       섹션 별 이미지 출력 구조 반영
 * 2026-07-02        Song       섹션 단일 렌더링 컴포넌트 분리
 * 2026-07-02        Song       CSS Module 스타일 분리
 * 2026-07-27        Song       상세 섹션 표시 조건 및 제목 개선
 */

import type { ProjectSectionResponse } from '../../../types/project'
import ProjectSectionItem from './ProjectSectionItem'
import styles from './ProjectContentSection.module.css'

interface ProjectContentSectionProps {
  sections: ProjectSectionResponse[]
}

function ProjectContentSection({
  sections,
}: ProjectContentSectionProps) {
  const visibleSections = sections.filter(
    (section) =>
      Boolean(section.title?.trim()) ||
      Boolean(section.content?.trim()) ||
      section.images.length > 0,
  )

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Project Details
      </h2>

      {visibleSections.length === 0 ? (
        <div className={styles.empty}>
          등록된 상세 섹션이 없습니다.
        </div>
      ) : (
        <div className={styles.list}>
          {visibleSections.map((section) => (
            <ProjectSectionItem
              key={section.sectionId}
              section={section}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default ProjectContentSection