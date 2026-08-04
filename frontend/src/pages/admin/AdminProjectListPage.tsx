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
 *                  - 프로젝트 목록 필터 처리
 *                  - 목록 관리 액션 버튼 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-27        Song       목록 공개/숨김 빠른 처리 버튼 추가
 * 2026-07-27        Song       프로젝트 목록 필터 처리 추가
 * 2026-07-27        Song       목록 관리 액션 버튼 추가
 * 2026-07-27        Song       프로젝트명 검색 기능 및 목록 정렬 기능 추가
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

    // 필터 hook
    const [typeFilter, setTypeFilter] = useState('ALL')
    const [publicationFilter, setPublicationFilter] = useState('ALL')
    const [fromDate, setFromDate] = useState('') // 생성일 필터 시작 값
    const [toDate, setToDate] = useState('')     // 수정일 필터 종료 값
    const [searchKeyword, setSearchKeyword] = useState('')

    // 정렬 hook
    const [sortOption, setSortOption] = useState('DISPLAY_ORDER_ASC')


    // ============================================================================
    // 2) useEffect (프로젝트 목록 전체 조회/ 필터 조회)
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

    // 필터 분기
    const filteredProjects = projects.filter((project) => {
        const matchesType = 
            typeFilter === 'ALL' || project.projectType === typeFilter

            const matchesPublication = 
                publicationFilter === 'ALL' ||
                (publicationFilter === 'PUBLISHED' && project.published) ||
                (publicationFilter === 'UNPUBLISHED' && !project.published)

            const createdDate = project.createdAt.slice(0, 10)
            const updatedDate = project.updatedAt.slice(0, 10)

            const matchesDateRange = 
                (!fromDate || createdDate >= fromDate) &&
                (!toDate || updatedDate <= toDate) 

            const keyword = searchKeyword.trim().toLowerCase()

            const matchesKeyword =
                !keyword || project.title.toLowerCase().includes(keyword)

            return (
                matchesType &&
                matchesPublication &&
                matchesDateRange &&
                matchesKeyword
            )
    })

    // 정렬 분기
    const sortedProject = [...filteredProjects].sort((a, b) => {
        switch (sortOption) {
            case 'DISPLAY_ORDER_ASC' :
                return a.displayOrder - b.displayOrder // 최신순

            case 'CREATED_AT_DESC' :
                return b.createdAt.localeCompare(a.createdAt)
            
            case 'CREATED_AT_ASC' :
                return a.createdAt.localeCompare(b.createdAt)

            case 'UPDATE_AT_DESC' :
                return b.updatedAt.localeCompare(a.updatedAt)

            case 'UPDATE_AT_ASC' : 
                return a.updatedAt.localeCompare(b.updatedAt)

            case 'DISPLAY_ORDER_DESC':
                default:
                    return b.displayOrder - a.displayOrder // 오래된순
        }
    })

    // ============================================================================
    // 3. 이벤트 함수 (프로젝트 공개/ 비공개 빠른 처리 | 필터 초기화 처리)
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

    // 필터 초기화 함수
    function handleResetFilters() {
        setTypeFilter('ALL')
        setPublicationFilter('ALL')
        setFromDate('')
        setToDate('')
        setSearchKeyword('')
        setSortOption('DISPLAY_ORDER_ASC')
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

            <section className={styles.filterPanel}>
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>
                        프로젝트명
                    </label>

                    <input
                        type='search'
                        value={searchKeyword}
                        className={styles.searchInput}
                        onChange={(event) => setSearchKeyword(event.target.value)}
                        placeholder='프로젝트명 검색'
                    >
                    </input>

                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>
                        유형
                    </label>

                    <select
                        className={styles.filterSelect}
                        value={typeFilter}
                        onChange={(event) => setTypeFilter(event.target.value)}
                    >
                        <option value="ALL">전체</option>
                        <option value="PERSONAL">개인</option>
                        <option value="TEAM">팀</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>
                        공개 상태
                    </label>

                    <select
                        className={styles.filterSelect}
                        value={publicationFilter}
                        onChange={(event) => setPublicationFilter(event.target.value)}
                    >
                        <option value="ALL">전체</option>
                        <option value="PUBLISHED">공개</option>
                        <option value="UNPUBLISHED">비공개</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>
                    생성일
                    </label>

                    <input
                    type="date"
                    className={styles.filterInput}
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>
                    수정일
                    </label>

                    <input
                    type="date"
                    className={styles.filterInput}
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>
                        정렬
                    </label>

                    <select
                        className={styles.filterSelect}
                        value={sortOption}
                        onChange={(event) => setSortOption(event.target.value)}
                    >
                        <option value='DISPLAY_ORDER_ASC'>
                            정렬순서 낮은순
                        </option>

                        <option value='DISPLAY_ORDER_DESC'>
                            정렬순서 높은순
                        </option>

                        <option value='CREATED_AT_ASC'>
                            생성일 최신순
                        </option>

                        <option value='CREATED_AT_DESC'>
                            생성일 오래된순
                        </option>

                        <option value='UPDATE_AT_ASC'>
                            수정일 최신순
                        </option>

                        <option value='UPDATE_AT_DESC'>
                            수정일 오래된순
                        </option>
                    </select>
                </div>

                <button
                    type="button"
                    className={styles.resetButton}
                    onClick={handleResetFilters}
                >
                    초기화
                </button>

            </section>

            {actionErrorMessage && (
                <div className={styles.actionError}>
                    {actionErrorMessage}
                </div>
            )}

            {sortedProject.length === 0 ? (
                <div className={styles.empty}>조건에 맞는 프로젝트가 없습니다.</div>
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
                            {sortedProject.map((project) => {
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
                                            <div className={styles.actionButton}>
                                                <Link
                                                    to={`/admin/projects/${project.projectId}`}
                                                    className={styles.detailButton}
                                                >
                                                    상세
                                                </Link>

                                                <Link
                                                    to={`/admin/projects/${project.projectId}/edit`}
                                                    className={styles.detailButton}
                                                >
                                                    수정
                                                </Link>
                                                
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

                                            </div>
                                            
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
