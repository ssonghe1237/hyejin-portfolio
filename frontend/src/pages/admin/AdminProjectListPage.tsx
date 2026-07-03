/**
 * packageName    : frontend.src.pages.admin
 * fileName       : AdminProjectListPage.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 관리자 프로젝트 목록 페이지
 *                  - 관리자 프로젝트 전체 목록 조회
 *                  - 공개/비공개 상태 확인
 *                  - 프로젝트 상세 관리 페이지 이동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 */

import { useEffect, useState } from 'react';
import type { AdminProjectListResponse } from '../../types/project';
import { getAdminProjects } from '../../api/adminProjectApi';
import styles from './AdminProjectListPage.module.css'
import { Link } from 'react-router-dom';

function AdminProjectListPage() {
    const [projects, setProjects] = useState<AdminProjectListResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

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

    if(loading) {
        return <div className={styles.status}>관리자 프로젝트 목록을 불러오는 중입니다...</div>
    }

    if (errorMessage) {
        return <div className={styles.error}>{errorMessage}</div>
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
            </header>

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
                            </tr>
                        </thead>

                        <tbody>
                            {projects.map((project) => (
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminProjectListPage;
