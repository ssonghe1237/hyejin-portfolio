/**
 * packageName    : frontend.src.pages.admin
 * fileName       : AdminProjectListPage.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 관리자 프로젝트 목록 페이지
 *                  - 관리자 프로젝트 전체 목록 조회
 *                  - 공개/비공개 상태 확인
 *                  - 프로젝트 상세 관리 페이지 이동
 *                  - 프로젝트 공개/숨김 빠른 처리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-27        Song       목록 공개/숨김 빠른 처리 버튼 추가
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { AdminProjectListResponse } from '../../types/project';
import { 
    getAdminProjects,
    updateAdminProjectPublication
 } from '../../api/adminProjectApi';
import styles from './AdminProjectListPage.module.css'


function AdminProjectListPage() {

    // ============================================================================
    // 1) hooks
    // ----------------------------------------------------------------------------
    const [projects, setProjects] = useState<AdminProjectListResponse[]>([])
    const [changingPublicationProjectId, setChangingPublicationProjectId] = useState<number | null>(null)

    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null)


    // ============================================================================
    // 2) useEffect (프로젝트 목록 전체 조회)
    // ----------------------------------------------------------------------------
    useEffect(() => {
        async function fetchProjects() {
            try {
                setLoading(true)
                setErrorMessage(null)

                const result = await getAdminProjects()

                setProjects(result)
            } catch(error) {
                console.error(error)
                setErrorMessage('관리자 프로젝트 목록을 불러오지 못했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    // ============================================================================
    // 3. 이벤트 함수 (프로젝트 공개/ 비공개 빠른 처리)
    // ----------------------------------------------------------------------------
    async function handleTogglePublication(
        project:AdminProjectListResponse
    ) {
        const nextPublished = !project.published
        const actionLabel = nextPublished ? '공개' : '숨김'

        const confirmed = window.confirm(
            `${project.title} 프로젝트를 ${actionLabel} 처리하시겠습니까?`
        )

        if(!confirmed) {
            return
        }

        try{
            setChangingPublicationProjectId(project.projectId)
            setActionErrorMessage(null)

            const updateProject = await updateAdminProjectPublication(
                project.projectId,
                nextPublished
            )

            setProjects((previousProjects) =>
                previousProjects.map((previousProject) =>
                    previousProject.projectId === updateProject.projectId
                        ? {
                            ...previousProject,
                            published: updateProject.published,
                            updatedAt: updateProject.updatedAt,
                        }
                        : previousProject
                )
            )
        } catch(error) {
            console.error(error)

            setActionErrorMessage(
                error instanceof Error
                    ? error.message
                    : '프로젝트 공개 상태를 변경하지 못했습니다.'
            )
        } finally {
            setChangingPublicationProjectId(null)
        }
        
    }

    // ============================================================================
    // 4. 화면 분기
    // ----------------------------------------------------------------------------
    if(loading) {
        return (
            <div className={styles.status}>
                관리자 프로젝트 목록을 불러오는 중입니다...
            </div>
        )
    }

    if (errorMessage) {
        return (
            <div className={styles.error}>
                {errorMessage}
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Admin Projects</h1>
                    <p className={styles.description}>
                        공개/비공개 상태와 관계없이 전체 프로젝트를 관리하는 화면입니다.
                    </p>
                </div>

                <Link to="/admin/projects/new" className={styles.createLink}>
                    새 프로젝트 등록
                </Link>
            </header>

            {actionErrorMessage && (
                <div className={styles.actionError}>
                    {actionErrorMessage}
                </div>
            )}

            {projects.length === 0 ? (
                <div className={styles.empty}>등록된 프로젝트가 없습니다.</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>프로젝트명</th>
                                <th>유형</th>
                                <th>공개 상태</th>
                                <th>정렬</th>
                                <th>생성일</th>
                                <th>수정일</th>
                                <th>관리</th>
                            </tr>
                        </thead>

                        <tbody>
                            {projects.map((project) => {
                                const isChanging = changingPublicationProjectId === project.projectId

                                return(
                                    <tr key={project.projectId}>
                                        <td>{project.projectId}</td>

                                        <td>
                                            <Link
                                                to={`/admin/projects/${project.projectId}`}
                                                className={styles.titleLink}
                                            >
                                            {project.title}
                                            </Link>
                                        </td>

                                        <td>{project.projectType}</td>

                                        <td>
                                            <span
                                                className={
                                                    project.published
                                                    ? `${styles.badge} ${styles.published}`
                                                    : `${styles.badge} ${styles.unpublished}`
                                                }
                                            >
                                            {project.published ? '공개' : '비공개'}
                                            </span>
                                        </td>

                                        <td>{project.displayOrder}</td>
                                        <td>{project.createdAt.slice(0, 10)}</td>
                                        <td>{project.updatedAt.slice(0, 10)}</td>

                                        <td>
                                            <button
                                                type="button"
                                                className={styles.publicationButton}
                                                onClick={() => handleTogglePublication(project)}
                                                disabled={isChanging}    
                                            >
                                                {isChanging
                                                    ? '변경 중'
                                                    : project.published
                                                        ? '숨김 처리'
                                                        : '공개 처리'
                                                }
                                            </button>
                                        </td>
                                    </tr>
                                )    
                        
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminProjectListPage;
