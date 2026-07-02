import type { ProjectSectionResponse } from "../../../types/project";
import MermaidRenderer from "./MermaidRenderer";

/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectContentSection.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 상세 섹션 컴포넌트
 *                  - 프로젝트 상세 섹션 목록 출력
 *                  - 섹션 별 이미지 목록 출력
 *                  - WORKFLOW 섹션의 Mermaid 차트 렌더링 처리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       상세 섹션 목록 출력 추가
 * 2026-07-02        Song       WORKFLOW 섹션 Mermaid 렌더링 추가
 * 2026-07-02        Song       섹션 별 이미지 출력 구조 반영
 */

interface ProjectContentSectionProps {
    sections : ProjectSectionResponse[]
}

function ProjectContentSection({ sections } : ProjectContentSectionProps) {
    return(
        <section style={{ marginTop: '40px' }}>
            <h2>Section</h2>

            {sections.length === 0 ? (
                <p>등록된 상세 섹션이 없습니다.</p>
            ) : (
                <div style={{ display: 'grid', gap: '24px' }}>
                    {sections.map((section) => (
                        <article
                            key={section.sectionId}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '12px',
                                padding: '20px',
                            }}
                        >
                            <p>{section.sectionType}</p>

                            {section.images.length > 0 && (
                                <div style={{ display: "grid", gap: "12px" }}>
                                    {section.images.map((image) => (
                                        <figure key={image.projectImageId} style={{ margin: 0 }}>
                                            <img
                                                src={image.imageUrl}
                                                alt={image.caption ?? section.sectionType}
                                                style={{
                                                    width: '100%',
                                                    maxWidth: '720px',
                                                    borderRadius: '12px'
                                                }}
                                            />
                                            {image.caption && (
                                                <figcaption>{image.caption}</figcaption>
                                            )}
                                        </figure>
                                    ))}
                                </div>
                            )}

                            {section.title && <h3>{section.title}</h3>}

                            {section.content && (
                                section.sectionType === 'WORKFLOW' ? (
                                    <MermaidRenderer chart={section.content} />
                                ) : (
                                    <pre
                                        style={{
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                        }}
                                    >
                                        {section.content}
                                    </pre>
                                )
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>
    )

}

export default ProjectContentSection