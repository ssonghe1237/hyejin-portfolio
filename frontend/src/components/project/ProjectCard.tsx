/**
 * packageName    : frontend.src.components.project
 * fileName       : ProjectCard.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 목록 카드 컴포넌트
 *                  - 프로젝트 제목, 요약, 기간, 팀명, 담당 역할 출력
 *                  - 프로젝트 상세 페이지 이동 링크 제공
 *                  - 목록용 썸네일 이미지 출력 영역 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       프로젝트 목록 카드 UI 분리
 * 2026-07-02        Song       상세 페이지 이동 링크 추가
 * 2026-07-02        Song       Work 목록 grid 레이아웃에 맞춰 카드 UI 정리
 */

import { Link } from 'react-router-dom'
import ImageWithFallback from '../common/ImageWithFallback'
import type { ProjectListResponse } from '../../types/project'

interface ProjectCardProps {
  project: ProjectListResponse
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      style={{
        height: '100%',
        border: '1px solid #e5e5e5',
        borderRadius: '24px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.04)',
      }}
    >
      {project.thumbnailUrl ? (
        <ImageWithFallback
          src={project.thumbnailUrl}
          alt={`${project.title} 썸네일`}
          fallbackText="프로젝트 썸네일을 불러올 수 없습니다."
          height="220px"
          objectFit="cover"
          borderRadius="0"
        />
      ) : (
        <div
          style={{
            height: '220px',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
          }}
        >
          등록된 썸네일이 없습니다.
        </div>
      )}

      <div
        style={{
          padding: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '16px',
          }}
        >
          {project.periodText && (
            <span
              style={{
                color: '#777',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {project.periodText}
            </span>
          )}

          {project.teamName && (
            <span
              style={{
                color: '#777',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              · {project.teamName}
            </span>
          )}
        </div>

        <h3
          style={{
            margin: 0,
            fontSize: '26px',
            letterSpacing: '-0.04em',
          }}
        >
          <Link
            to={`/work/${project.slug}`}
            style={{
              color: '#111',
              textDecoration: 'none',
            }}
          >
            {project.title}
          </Link>
        </h3>

        <p
          style={{
            margin: '12px 0 0',
            color: '#555',
            fontSize: '15px',
            lineHeight: 1.7,
          }}
        >
          {project.summary}
        </p>

        {project.role && (
          <p
            style={{
              margin: '20px 0 0',
              color: '#111',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            {project.role}
          </p>
        )}

        <Link
          to={`/work/${project.slug}`}
          style={{
            display: 'inline-flex',
            marginTop: '24px',
            color: '#111',
            fontSize: '14px',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          자세히 보기 →
        </Link>
      </div>
    </article>
  )
}

export default ProjectCard