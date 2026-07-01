import React from 'react';
import type { ProjectDetailResponse } from '../../../types/project';

interface projectBasicInfoProps {
    project: ProjectDetailResponse
}

function ProjectBasicInfo({project} : projectBasicInfoProps) {
    return (
        <section style={{ marginTop: '32px' }}>
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
