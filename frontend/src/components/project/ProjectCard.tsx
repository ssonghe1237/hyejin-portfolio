import { Link } from "react-router-dom";
import type { ProjectListResponse } from "../../types/project";

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
                <p>
                    thumnail :
                    {' '}
                    {project.thumbnailUrl}
                </p>
            )}
        </article>
    )
}

export default ProjectCard