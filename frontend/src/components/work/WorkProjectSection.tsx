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
 */

import ProjectCard from '../project/ProjectCard'
import type { ProjectListResponse } from '../../types/project'

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
    <section
      style={{
        padding: '56px 0',
        borderTop: '1px solid #eee',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '24px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '36px',
              letterSpacing: '-0.04em',
            }}
          >
            {title}
          </h2>

          <p
            style={{
              margin: '12px 0 0',
              color: '#666',
              fontSize: '16px',
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        </div>

        <span
          style={{
            flexShrink: 0,
            color: '#999',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          {projects.length} projects
        </span>
      </div>

      {projects.length === 0 ? (
        <div
          style={{
            border: '1px dashed #ccc',
            borderRadius: '20px',
            padding: '40px',
            color: '#777',
            backgroundColor: '#fafafa',
          }}
        >
          {emptyMessage}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.projectId} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}

export default WorkProjectSection