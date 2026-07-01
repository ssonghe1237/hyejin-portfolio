import type { ProjectLinkResponse } from "../../../types/project";

interface ProjectLinkSectionProps {
    links : ProjectLinkResponse[]
}

function ProjectLinkSection({links} : ProjectLinkSectionProps) {
    return(
        <section style={{ marginTop: '40px' }}>
            <h2>Links</h2>

            {links.length === 0 ? (
            <p>등록된 링크가 없습니다.</p>
            ) : (
            <ul>
                {links.map((link) => (
                <li key={link.projectLinkId}>
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