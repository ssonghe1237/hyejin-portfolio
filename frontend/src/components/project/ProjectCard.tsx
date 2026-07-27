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
 * 2026-07-27        Song       기술스택 카테고리 및 MY_ROLE 섹션 제목 출력 추가
 */

import { Link } from 'react-router-dom'
import ImageWithFallback from '../common/ImageWithFallback'
import type { ProjectListResponse } from '../../types/project'
import styles from './ProjectCard.module.css';

// [설계도] 부모가 전달해 줘야 하는 데이터의 모양 규정
interface ProjectCardProps {
  project: ProjectListResponse
}

// [자식 컴포넌트] 부모가 넘겨준 진짜 데이터(props)를 받아서 사용
function ProjectCard({ project }: ProjectCardProps) {
  const techCategories = project.techCategories ?? []
  const myRoleTitles = project.myRoleTitles ?? []

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

        {techCategories.length > 0 && (
          <div className={styles.cardInfoBlock}>
            <p className={styles.cardInfoTitle}>
              Tech Category
            </p>

            <div className={styles.badgeList}>
              {techCategories.map((category) => (
                <span
                  key={category}
                  className={styles.techCategoryBadge}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {myRoleTitles.length > 0 && (
          <div className={styles.cardInfoBlock}>
              <p className={styles.cardInfoTitle}>
                MY ROLE
              </p>

              <ul className={styles.myRoleList}>
                {myRoleTitles.map((title) => (
                  <li
                    key={title}
                    className={styles.myRoleItem}
                  >
                    {title}
                  </li>
                ))}
              </ul>
          </div>
        )}

        <Link to={`/work/${project.slug}`} className={styles.detailLink}>
          자세히 보기 →
        </Link>
      </div>
    </article>
  )
}

export default ProjectCard