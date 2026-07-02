import type { ProjectLinkResponse } from "../../../types/project";

/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectLinkSection.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 링크 섹션 컴포넌트
 *                  - GitHub, 배포 URL, PDF, Notion 등 프로젝트 관련 링크 출력
 *                  - 외부 링크 새 창 이동 처리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       프로젝트 관련 링크 목록 출력 추가
 * 2026-07-02        Song       CSS Module 스타일 분리
 */
import styles from "./ProjectLinkSection.module.css";

interface ProjectLinkSectionProps {
    links : ProjectLinkResponse[]
}

function ProjectLinkSection({links} : ProjectLinkSectionProps) {
    return(
        <section className={styles.section}>
            <h2 className={styles.title}>Links</h2>

            {links.length === 0 ? (
            <p className={styles.empty}>등록된 링크가 없습니다.</p>
            ) : (
            <ul className={styles.list}>
                {links.map((link) => (
                <li key={link.projectLinkId} className={styles.link}>
                    [{link.linkType}]{' '}
                    <a href={link.url} target="_blank" rel="noreferrer">
                    {link.linkName}
                    </a>
                </li>
                ))}
            </ul>
            )}
        </section>
    )
}

export default ProjectLinkSection