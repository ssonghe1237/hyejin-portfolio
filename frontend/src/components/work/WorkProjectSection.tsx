/**
 * packageName    : frontend.src.components.work
 * fileName       : WorkProjectSection.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : Work 페이지 프로젝트 목록 섹션 컴포넌트
 *                  - 프로젝트 그룹별 섹션 제목 및 설명 출력
 *                  - 섹션별 프로젝트 카드 열 개수 처리
 *                  - ProjectCard 목록 grid 출력
 *                  - 프로젝트가 없을 경우 fallback 문구 출력
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       CSS Module 스타일 분리
 * 2026-08-03        Song       Selected Work 및 More Work 구조 반영
 * 2026-08-03        Song       섹션별 프로젝트 카드 열 개수 처리
 */

import { Link } from 'react-router-dom'
import ImageWithFallback from '../common/ImageWithFallback'
import type { ProjectListResponse } from '../../types/project'
import styles from './WorkProjectSection.module.css'

interface WorkProjectSectionProps {
  title: string
  description: string
  projects: ProjectListResponse[]
  emptyMessage: string
  columns: 1 | 2
}

function WorkProjectSection({
  title,
  description,
  projects,
  emptyMessage,
  columns,
}: WorkProjectSectionProps) {
  const gridClassName =
    columns === 1
      ? `${styles.grid} ${styles.singleColumnGrid}`
      : `${styles.grid} ${styles.twoColumnGrid}`
  const isSelected = columns === 1
  const sectionClassName = `${styles.section} ${isSelected ? styles.selectedSection : styles.moreSection}`

  return (
    <section className={sectionClassName}>
      <div className={styles.header}>
        <div>
          {isSelected && <p className={styles.eyebrow}>PROJECT</p>}

          <h2 className={styles.title}>
            {title}
          </h2>

          <p className={styles.description}>
            {description}
          </p>
        </div>

        <span className={styles.count}>
          {projects.length} projects
        </span>
      </div>

      {projects.length === 0 ? (
        <p className={styles.empty}>
          {emptyMessage}
        </p>
      ) : (
        <div className={gridClassName}>
          {projects.map((project) => (
            <article
              key={project.projectId}
              className={`${styles.project} ${isSelected ? styles.selectedProject : styles.moreProject}`}
            >
              <Link
                to={`/work/${project.slug}`}
                className={styles.visualLink}
                aria-label={`${project.title} 프로젝트 상세 보기`}
              >
                <div className={styles.browserFrame}>
                  <div className={styles.browserBar} aria-hidden="true">
                    <span className={styles.windowControls}><i /><i /><i /></span>
                    <span className={styles.browserAddress}>PROJECT / {project.slug.toUpperCase()}</span>
                  </div>
                  <div className={styles.visual}>
                    {project.thumbnailUrl ? (
                      <ImageWithFallback
                        src={project.thumbnailUrl}
                        alt={`${project.title} 썸네일`}
                        fallbackText="프로젝트 썸네일을 불러올 수 없습니다."
                        height="100%"
                        objectFit="cover"
                        borderRadius="0"
                      />
                    ) : (
                      <div className={styles.emptyThumbnail}>
                        등록된 썸네일이 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              </Link>

              <div className={styles.projectContent}>
                <div className={styles.meta}>
                  {project.periodText && <span>{project.periodText}</span>}
                  <span>{project.projectType}</span>
                  {project.teamName && <span>{project.teamName}</span>}
                </div>

                <h3 className={styles.projectTitle}>
                  <Link to={`/work/${project.slug}`}>{project.title}</Link>
                </h3>

                <p className={styles.summary}>{project.summary}</p>

                {isSelected && (project.role || project.techCategories.length > 0) && (
                  <p className={styles.supporting}>
                    {project.role ?? project.techCategories.join(' · ')}
                  </p>
                )}

                <Link
                  to={`/work/${project.slug}`}
                  className={styles.detailLink}
                  aria-label={`${project.title} 프로젝트 자세히 보기`}
                >
                  자세히 보기
                  <span className={styles.arrow} aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default WorkProjectSection
