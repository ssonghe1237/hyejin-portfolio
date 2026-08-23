/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectSectionItem.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 상세 섹션 단일 카드 컴포넌트
 *                  - 섹션 유형, 제목, 이미지, 본문 영역 조립
 *                  - 섹션별 콘텐츠 표시 구조 관리
 *                  - MY_ROLE 섹션 강조 표시
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       CSS Module 스타일 분리
 * 2026-07-27        Song       MY_ROLE 섹션 강조 스타일 적용
 */

import type { ProjectSectionResponse } from '../../../types/project'
import ProjectSectionBody from './ProjectSectionBody'
import ProjectSectionImages from './ProjectSectionImages'
import styles from './ProjectSectionItem.module.css'

interface ProjectSectionItemProps {
  section: ProjectSectionResponse
  index: number
}

function ProjectSectionItem({
  section,
  index,
}: ProjectSectionItemProps) {
  const isMyRoleSection =
    section.sectionType === 'MY_ROLE'
  const isWorkflowSection = section.sectionType === 'WORKFLOW'

  const sectionContent = (
    <>
      <ProjectSectionBody
        sectionType={section.sectionType}
        content={section.content}
      />

      <ProjectSectionImages
        images={section.images}
        sectionType={section.sectionType}
      />
    </>
  )

  return (
    <article
      data-section-type={section.sectionType}
      className={
        isMyRoleSection
          ? `${styles.item} ${styles.myRoleItem}`
          : styles.item
      }
    >
      <p className={styles.type}>
        {String(index + 1).padStart(2, '0')} / {section.sectionType}
      </p>

      {section.title && (
        <h3 className={styles.title}>
          {section.title}
        </h3>
      )}

      {isWorkflowSection ? (
        <div className={styles.workflowWindow}>
          <div className={styles.workflowTopBar}>
            <span className={styles.windowControls} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>workflow.json — Visual Studio Code</span>
            <span>UTF-8</span>
          </div>
          <div className={styles.workflowBody}>{sectionContent}</div>
        </div>
      ) : sectionContent}
    </article>
  )
}

export default ProjectSectionItem
