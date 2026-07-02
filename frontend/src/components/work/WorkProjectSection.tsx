/**
 * packageName    : frontend.src.components.work
 * fileName       : WorkProjectSection.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : Work 페이지 프로젝트 목록 섹션 컴포넌트
 *                  - 프로젝트 유형별 섹션 제목 및 설명 출력
 *                  - ProjectCard 목록 grid 출력
 *                  - 프로젝트가 없을 경우 fallback 문구 출력
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       CSS Module 스타일 분리
 */

import ProjectCard from '../project/ProjectCard'
import type { ProjectListResponse } from '../../types/project'
import styles from './WorkProjectSection.module.css'

interface WorkProjectSectionProps {
  title: string
  description: string
  projects: ProjectListResponse[]
  emptyMessage: string
}

function WorkProjectSection({
  title,
  description,
  projects,
  emptyMessage,
}: WorkProjectSectionProps) {
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
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.projectId} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}

export default WorkProjectSection