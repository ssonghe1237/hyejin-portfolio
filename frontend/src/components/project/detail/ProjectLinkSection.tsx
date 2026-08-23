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
 * 2026-08-24        Song       링크 유형별 아이콘 및 정렬된 링크 표현 구조 적용
 */

import type { ProjectLinkResponse } from '../../../types/project'
import { ProjectLinkIcon } from './projectDetailIcons'
import styles from './ProjectLinkSection.module.css'

interface ProjectLinkSectionProps {
  links: ProjectLinkResponse[]
}

function ProjectLinkSection({
  links,
}: ProjectLinkSectionProps) {
  const sortedLinks = [...links].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  )

  return (
    <section className={styles.section}>
      <p className={styles.kicker}>06 · Links</p>
      <h2 className={styles.title}>
        Links
      </h2>

      {links.length === 0 ? (
        <p className={styles.empty}>
          등록된 링크가 없습니다.
        </p>
      ) : (
        <div className={styles.linkList}>
          {sortedLinks.map((link) => (
            <a
              key={link.projectLinkId}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkButton}
            >
              <span className={styles.linkIcon} aria-hidden="true">
                <ProjectLinkIcon
                  linkType={link.linkType}
                  className={styles.linkIconSvg}
                />
              </span>

              <span className={styles.linkName}>
                {link.linkName}
              </span>

              <span className={styles.linkArrow} aria-hidden="true">
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
