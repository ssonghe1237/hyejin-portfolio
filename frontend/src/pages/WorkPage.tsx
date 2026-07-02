import React, { useEffect, useState } from 'react';
import type { ProjectListResponse } from '../types/project';
import { getProjects } from '../api/projectApi';
import ProjectCard from '../components/project/ProjectCard';

/**
 * packageName    : frontend.src.pages
 * fileName       : WorkPage.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 목록 페이지
 *                  - 팀 프로젝트 목록 조회
 *                  - 개인 프로젝트 목록 조회
 *                  - 프로젝트 카드 컴포넌트를 통한 목록 출력
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       프로젝트 유형별 목록 API 연동
 * 2026-07-02        Song       ProjectCard 컴포넌트 분리 적용
 */

function WorkPage() {
    const [teamProjects, setTeamProjects] = useState<ProjectListResponse[]>([])
    const [personalProjects, setPersonalProjects] = useState<ProjectListResponse[]>([])
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
                setPersonalProjects(personalResult)
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
        return <div style={{ padding: '40px' }}>Loading...</div>
    }

    if(errorMessage) {
        return <div style={{ padding: '40px' }}>{errorMessage}</div>
    }

  return (
    <div style={{ padding: '40px' }}>
        <h1>Work</h1>

        {/* ========================================================================= */}
        {/* 팀 프로젝트 */}
        <ProjectSection
            title="Team Project"
            emptyMessage="등록된 팀 프로젝트가 없습니다."
            projects={teamProjects}
        />



        {/* ========================================================================= */}
        {/* 개인 프로젝트 */}
        <ProjectSection
            title="More stuff I made"
            emptyMessage="등록된 개인 프로젝트가 없습니다."
            projects={personalProjects}
        />
    </div>
  );
}

interface ProjectSectionProps {
    title: string
    emptyMessage: string
    projects: ProjectListResponse[]
}

function ProjectSection({
    title,
    emptyMessage,
    projects,
}: ProjectSectionProps) {
    return (
        <section style={{ margin: '40px' }}>
            <h2>{title}</h2>

            {projects.length === 0 ? (
                <p>{emptyMessage}</p>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {projects.map((project) => (
                        <ProjectCard 
                            key={project.projectId}
                            project={project}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

export default WorkPage
