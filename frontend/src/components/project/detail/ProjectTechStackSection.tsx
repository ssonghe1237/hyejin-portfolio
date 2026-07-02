import type { ProjectTechResponse } from '../../../types/project';

/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectTechStackSection.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 기술스택 섹션 컴포넌트
 *                  - 프로젝트에 사용된 기술명 출력
 *                  - 기술 카테고리 정보 출력
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       기술스택 목록 출력 추가
 */

interface ProjectTechStackSectionProps {
    techStacks : ProjectTechResponse[]
}

function ProjectTechStackSection ({ techStacks } : ProjectTechStackSectionProps) {
    return(
        <section style={{ marginTop: '40px' }}>
            <h2>Tech Stack</h2>

            {techStacks.length === 0 ? (
                <p>등록된 기술스택이 없습니다.</p>
            ) : (
                <ul>
                    {techStacks.map((tech) => (
                        <li key={tech.projectTechId}>
                            {tech.techName}
                            {tech.techCategory && ` / ${tech.techCategory}`}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

export default ProjectTechStackSection
