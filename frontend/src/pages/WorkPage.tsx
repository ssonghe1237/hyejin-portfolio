import React, { useEffect, useState } from 'react';
import type { ProjectListResponse } from '../types/project';
import { getProjects } from '../api/projectApi';


function WorkPage() {
    const [teamProjects, setTeamProjects] = useState<ProjectListResponse[]>([])
    const [personalProject, setPersonalProject] = useState<ProjectListResponse[]>([])
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProjects() {
            try {
                setLoading(true)

                const [teamResult, personalResult] = await Promise.all([
                    getProjects('TEAM'),
                    getProjects('PERSONAL'),
                ])

                setTeamProjects(teamResult)
                setPersonalProject(personalResult)
            } catch(error) {
                console.error(error)
                setErrorMessage(`프로젝트 데이터를 불러오지 못했습니다.`)

            } finally {
                setLoading(false);
            }
        }

        fetchProjects()
    }, []);

    if(loading) {
        return <main style={{ padding: '40px' }}>Loading...</main>
    }

    if(errorMessage) {
        return <main style={{ padding: '40px' }}>{errorMessage}</main>
    }

  return (
    <main style={{ padding: '40px' }}>
        <h1>Work</h1>

        {/* ========================================================================= */}
        {/* 팀 프로젝트 */}
        <section style={{ margin: '40px' }}>
            <h2>Team Project</h2>

            {teamProjects.length === 0 ? (
                <p>등록된 팀 프로젝트가 없습니다.</p>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {teamProjects.map((project) => (
                        <article
                            key={project.projectId}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '12px',
                                padding: '20px',
                            }}
                        >
                            <h3>{project.title}</h3>
                            <p>{project.summary}</p>
                            <p>{project.periodText}</p>
                            <p>{project.teamName}</p>
                            <p>{project.role}</p>

                            {project.thumbnailUrl && (
                                <p>
                                    thumbnail:
                                    {' '}
                                    {project.thumbnailUrl}
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>

        {/* ========================================================================= */}
        {/* 개인 프로젝트 */}
        <section style={{ marginTop: '40px' }}>
            <h2>More stuff I made</h2>

            {personalProject.length === 0 ? (
                <p>등록된 개인 프로젝트가 없습니다.</p>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {personalProject.map((project) => (
                        <article
                            key={project.projectId}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '12px',
                                padding: '20px',
                            }}
                        >
                            <h3>{project.title}</h3>
                            <p>{project.summary}</p>
                            <p>{project.periodText}</p>
                            <p>{project.teamName}</p>
                            <p>{project.role}</p>

                            {project.thumbnailUrl && (
                                <p>
                                    thumnail :
                                    {' '}
                                    {project.thumbnailUrl}
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>
    </main>
  );
}

export default WorkPage
