import type { ProjectDetailResponse } from '../../../types/project';

/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectBasicInfo.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 기본 정보 컴포넌트
 *                  - 프로젝트 제목, 요약, 기간, 팀명, 담당 역할 출력
 *                  - 프로젝트 설명 출력
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       프로젝트 상세 기본 정보 출력 추가
 * 2026-07-02        Song       ProjectDetailHeader 내부 조립 구조로 변경
 */

interface projectBasicInfoProps {
    project: ProjectDetailResponse
}

function ProjectBasicInfo({project} : projectBasicInfoProps) {
    return (
        <section>
            <h1>{project.title}</h1>
            <p>{project.summary}</p>

            {project.periodText && <p>{project.periodText}</p>}
            {project.teamName && <p>{project.teamName}</p>}
            {project.role && <p>{project.role}</p>}
            {project.description && <p>{project.description}</p>}
        </section>
    )
}

export default ProjectBasicInfo;
