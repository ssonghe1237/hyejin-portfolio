/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectDetailHeader.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 상세 상단 헤더 컴포넌트
 *                  - 대표 이미지 영역과 프로젝트 기본 정보 영역 조립
 *                  - heroImages 하단에 기본 정보 카드가 겹쳐 보이는 레이아웃 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       Hero 이미지 및 기본 정보 겹침 레이아웃 추가\
 * 2026-07-02        Song       CSS Module 스타일 분리
 */

import type { ProjectDetailResponse } from '../../../types/project'
import ProjectBasicInfo from './ProjectBasicInfo'
import ProjectHeroImages from './ProjectHeroImages'
import styles from './ProjectDetailHeader.module.css';

interface ProjectDetailHeaderProps {
  project: ProjectDetailResponse
}

function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  return (
    <header className={styles.header}>
      <ProjectHeroImages images={project.heroImages} />

      <div className={styles.infoCard}>
        <ProjectBasicInfo project={project} />
      </div>
    </header>
  )
}

export default ProjectDetailHeader