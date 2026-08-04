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

import ProjectCard from '../project/ProjectCard'
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

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
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
        <div className={styles.empty}>
          {emptyMessage}
        </div>
      ) : (
        <div className={gridClassName}>
          {projects.map((project) => (
            <ProjectCard
              key={project.projectId}
              project={project}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default WorkProjectSection