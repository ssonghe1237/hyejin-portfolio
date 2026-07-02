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
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: ProjectListResponse
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card}>
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
        <div className={styles.emptyThumbnail}>
          등록된 썸네일이 없습니다.
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.meta}>
          {project.periodText && (
            <span className={styles.metaItem}>
              {project.periodText}
            </span>
          )}

          {project.teamName && (
            <span className={styles.metaItem}>
              · {project.teamName}
            </span>
          )}
        </div>

        <h3 className={styles.title}>
          <Link to={`/work/${project.slug}`} className={styles.titleLink}>
            {project.title}
          </Link>
        </h3>

        <p className={styles.summary}>
          {project.summary}
        </p>

        {project.role && (
          <p className={styles.role}>
            {project.role}
          </p>
        )}

        <Link to={`/work/${project.slug}`} className={styles.detailLink}>
          자세히 보기 →
        </Link>
      </div>
    </article>
  )
}

export default ProjectCard