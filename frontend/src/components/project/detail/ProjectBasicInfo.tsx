import type { ProjectDetailResponse } from '../../../types/project';

/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectBasicInfo.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 기본 정보 컴포넌트
 *                  - 프로젝트 제목, 요약, 기간, 팀명, 담당 역할 출력
 *                  - 프로젝트 설명 출력
 *                  - MY_ROLE 섹션 제목 요약 출력
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       프로젝트 상세 기본 정보 출력 추가
 * 2026-07-02        Song       ProjectDetailHeader 내부 조립 구조로 변경
 * 2026-07-02        Song       CSS Module 스타일 분리
 * 2026-07-27        Song       description 하단 MY_ROLE 섹션 제목 출력 추가
 * 
 */
import styles from './ProjectBasicInfo.module.css';

interface projectBasicInfoProps {
    project: ProjectDetailResponse
}

function ProjectBasicInfo({project} : projectBasicInfoProps) {
    const metadataValues = [
        project.periodText,
        project.role,
        project.projectType,
        project.teamName,
    ].filter((value): value is string => Boolean(value?.trim()))

    return (
        <section className={styles.basicInfo}>
            <h1 className={styles.title}>
                {project.title}
            </h1>

            {project.summary && (
                <p className={styles.summary}>
                    {project.summary}
                </p>
            )}

            {metadataValues.length > 0 && (
                <div className={styles.meta}>
                    {metadataValues.map((value, index) => (
                        <span key={`${index}-${value}`}>{value}</span>
                    ))}
                </div>
            )}

        </section>
    )
}

export default ProjectBasicInfo;
