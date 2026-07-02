import type { ProjectDetailResponse } from '../../../types/project'
import ProjectBasicInfo from './ProjectBasicInfo'
import ProjectHeroImages from './ProjectHeroImages'

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
 * 2026-07-02        Song       Hero 이미지 및 기본 정보 겹침 레이아웃 추가
 */

interface ProjectDetailHeaderProps {
  project: ProjectDetailResponse
}

function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  return (
    <header>
      <ProjectHeroImages images={project.heroImages} />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '920px',
          margin: '-72px auto 0', // 겹치는 디자인 담당 부분 (-00 숫자가 작아질 수록 덜 겹침)
          padding: '32px',
          borderRadius: '24px',
          backgroundColor: '#fff',
          boxShadow: '0 18px 40px rgba(0, 0, 0, 0.12)',
        }}
      >
        <ProjectBasicInfo project={project} />
      </div>
    </header>
  )
}

export default ProjectDetailHeader