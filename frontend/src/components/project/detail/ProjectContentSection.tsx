import type { ProjectSectionResponse } from "../../../types/project";

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
                            {section.title && <h3>{section.title}</h3>}
                            {section.content && (
                                <pre
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                    }}
                                >
                                    {section.content}
                                </pre>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>
    )

}

export default ProjectContentSection