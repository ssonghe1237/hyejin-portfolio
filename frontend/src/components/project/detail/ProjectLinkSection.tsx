/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectLinkSection.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 링크 섹션 컴포넌트
 *                  - GitHub, 배포 URL, PDF, Notion 등 프로젝트 관련 링크 출력
 *                  - 외부 링크 새 창 이동 처리
 *                  - 링크 버튼형 CTA UI 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       프로젝트 관련 링크 목록 출력 추가
 * 2026-07-02        Song       CSS Module 스타일 분리
 * 2026-07-27        Song       링크 버튼형 CTA UI 적용
 */

import type {
  ProjectLinkResponse,
  ProjectLinkType,
} from '../../../types/project'
import styles from './ProjectLinkSection.module.css'

const LINK_TYPE_LABEL: Record<ProjectLinkType, string> = {
  GITHUB: 'GitHub',
  DEPLOY: 'Live Demo',
  PDF: 'PDF',
  NOTION: 'Notion',
  RESUME: 'Resume',
  SARAMIN: 'Saramin',
  ETC: 'Link',
}

interface ProjectLinkSectionProps {
  links: ProjectLinkResponse[]
}

function ProjectLinkSection({
  links,
}: ProjectLinkSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Links
      </h2>

      {links.length === 0 ? (
        <p className={styles.empty}>
          등록된 링크가 없습니다.
        </p>
      ) : (
        <div className={styles.linkList}>
          {links.map((link) => (
            <a
              key={link.projectLinkId}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkButton}
            >
              <span className={styles.linkType}>
                {LINK_TYPE_LABEL[link.linkType]}
              </span>

              <span className={styles.linkName}>
                {link.linkName}
              </span>

              <span className={styles.linkArrow}>
                →
              </span>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}

export default ProjectLinkSection