import type { ProjectTechResponse } from '../../../types/project';

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
