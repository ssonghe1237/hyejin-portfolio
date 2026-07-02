import { Link } from "react-router-dom";
import type { ProjectListResponse } from "../../types/project";
import ImageWithFallback from "../common/ImageWithFallback";

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
 */

// 참고) interface
// : 누구든 ProjectCard라는 컴포넌트를 사용하고싶으면 무적건 project라는 이름으로 ProjectListResponse 타입의 데이터를 넘겨주어야해!
interface PprojectCardProps {
    project: ProjectListResponse
}

function ProjectCard({project}: PprojectCardProps) {
    return (
        <article
            style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '20px',
            }}
        >
            <h3>
                <Link to={`/work/${project.slug}`}>
                    {project.title}
                </Link>
            </h3>
            
            <p>{project.summary}</p>
            
            <p>{project.periodText}</p>
            
            {project.teamName && <p>{project.teamName}</p>}

            {project.role && <p>{project.role}</p>}

            {project.thumbnailUrl && (
                <ImageWithFallback
                    src={project.thumbnailUrl}
                    alt={`${project.title} 썸네일`}
                    fallbackText="프로젝트 썸네일을 불러올 수 없습니다."
                    height="180px"
                />
            )}
        </article>
    )
}

export default ProjectCard