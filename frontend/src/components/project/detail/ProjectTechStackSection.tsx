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
 * 2026-07-02        Song       CSS Module 스타일 분리
 * 2026-07-27        Song       기술스택 카테고리별 카드 UI 적용
 */

import styles from './ProjectTechStackSection.module.css'

interface ProjectTechStackSectionProps {
    techStacks : ProjectTechResponse[]
}

function ProjectTechStackSection ({ techStacks } : ProjectTechStackSectionProps) {
    const techStacksByCtegory =
        techStacks.reduce<Record<string, ProjectTechResponse[]>> (
            (group, techStack) => {
                const categroy = techStack.techCategory?.trim() || 'ETC'

                return {
                    ...group,
                    [categroy]: [
                        ...(group[categroy] ?? []),
                        techStack,
                    ],
                }
            },
            {}
        )

    const categoryEntries = Object.entries(techStacksByCtegory)

    return(
        <section className={styles.section}>
            <h2 className={styles.title}>Tech Stack</h2>

            {techStacks.length === 0 ? (
                <p className={styles.empty}>등록된 기술스택이 없습니다.</p>
            ) : (
                <div className={styles.categoryGrid}>
                    {categoryEntries.map(([category, categoryTechStack]) => (
                        <div
                            key={category}
                            className={styles.techList}
                        >
                            <h3 className={styles.categoryTitle}>
                                {category}
                            </h3>

                            <div className={styles.techList}>
                                {categoryTechStack.map((tech) => (
                                    <span
                                        key={tech.projectTechId}
                                        className={styles.techItem}
                                    >
                                        {tech.techName}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                
            )}
        </section>
    )
}

export default ProjectTechStackSection
