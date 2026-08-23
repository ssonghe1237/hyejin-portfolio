/**
 * packageName    : frontend.src.pages.admin
 * fileName       : AdminResearchListPage.tsx
 * author         : Song
 * date           : 2026-08-04
 * description    : 관리자 Research 목록 페이지
 *                  - 관리자 Research 전체 목록 조회
 *                  - 공개/비공개 상태 확인 및 빠른 변경
 *                  - Research 게시글 영구 삭제
 *                  - 목록 로딩 및 액션 오류 처리
 *                  - 제목 검색과 카테고리 필터 및 필터 초기화 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song               최초 생성
 * 2026-08-24        Song               관리자 Research 제목 검색 및 카테고리 필터 추가
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  deleteAdminResearch,
  getAdminResearchList,
  updateAdminResearchPublication,
} from '../../api/adminResearchApi'
import type { AdminResearchListResponse } from '../../types/research'
import styles from './AdminResearchListPage.module.css'

function AdminResearchListPage() {
  // ============================================================================
  // 1) 상태
  // ----------------------------------------------------------------------------

  const [researchPosts, setResearchPosts] =
    useState<AdminResearchListResponse[]>([])

  const [
    changingPublicationResearchId,
    setChangingPublicationResearchId,
  ] = useState<number | null>(null)

  const [deletingResearchId, setDeletingResearchId] =
    useState<number | null>(null)

  const [loading, setLoading] = useState(true)

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null)

  const [actionErrorMessage, setActionErrorMessage] =
    useState<string | null>(null)

  const [searchKeyword, setSearchKeyword] = useState('')

  const [categoryFilter, setCategoryFilter] = useState('ALL')

  const categories = Array.from(
    new Set(researchPosts.map((research) => research.category)),
  )

  const normalizedKeyword = searchKeyword.trim().toLocaleLowerCase()

  const filteredResearchPosts = researchPosts.filter((research) => {
    const matchesTitle =
      normalizedKeyword.length === 0 ||
      research.title.toLocaleLowerCase().includes(normalizedKeyword)

    const matchesCategory =
      categoryFilter === 'ALL' || research.category === categoryFilter

    return matchesTitle && matchesCategory
  })

  // ============================================================================
  // 2) 관리자 Research 전체 목록 조회
  // ----------------------------------------------------------------------------

  useEffect(() => {
    async function fetchResearchPosts() {
      try {
        setLoading(true)
        setErrorMessage(null)

        const result = await getAdminResearchList()

        setResearchPosts(result)
      } catch (error) {
        console.error(error)

        setErrorMessage(
          error instanceof Error
            ? error.message
            : '관리자 Research 목록을 불러오지 못했습니다.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchResearchPosts()
  }, [])

  // ============================================================================
  // 3) 공개·비공개 빠른 변경
  // ----------------------------------------------------------------------------

  async function handleTogglePublication(
    research: AdminResearchListResponse,
  ) {
    const nextPublished = !research.published
    const actionLabel = nextPublished ? '공개' : '숨김'

    const confirmed = window.confirm(
      `${research.title} Research를 ${actionLabel} 처리하시겠습니까?`,
    )

    if (!confirmed) {
      return
    }

    try {
      setChangingPublicationResearchId(
        research.researchId,
      )
      setActionErrorMessage(null)

      const updatedResearch =
        await updateAdminResearchPublication(
          research.researchId,
          nextPublished,
        )

      setResearchPosts((previousResearchPosts) =>
        previousResearchPosts.map(
          (previousResearch) =>
            previousResearch.researchId ===
            updatedResearch.researchId
              ? {
                  ...previousResearch,
                  published:
                    updatedResearch.published,
                  updatedAt:
                    updatedResearch.updatedAt,
                  publishedAt:
                    updatedResearch.publishedAt,
                }
              : previousResearch,
        ),
      )
    } catch (error) {
      console.error(error)

      setActionErrorMessage(
        error instanceof Error
          ? error.message
          : 'Research 공개 상태를 변경하지 못했습니다.',
      )
    } finally {
      setChangingPublicationResearchId(null)
    }
  }

  // ============================================================================
  // 4) 삭제
  // ----------------------------------------------------------------------------

  async function handleDeleteResearch(
    research: AdminResearchListResponse,
  ) {
    const confirmed = window.confirm(
      `${research.title} Research를 삭제하시겠습니까?\n삭제한 게시글은 복구할 수 없습니다.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingResearchId(
        research.researchId,
      )
      setActionErrorMessage(null)

      await deleteAdminResearch(
        research.researchId,
      )

      setResearchPosts((previousResearchPosts) =>
        previousResearchPosts.filter(
          (previousResearch) =>
            previousResearch.researchId !==
            research.researchId,
        ),
      )
    } catch (error) {
      console.error(error)

      setActionErrorMessage(
        error instanceof Error
          ? error.message
          : 'Research 게시글을 삭제하지 못했습니다.',
      )
    } finally {
      setDeletingResearchId(null)
    }
  }

  function handleResetFilters() {
    setSearchKeyword('')
    setCategoryFilter('ALL')
  }

  // ============================================================================
  // 5) 화면 분기
  // ----------------------------------------------------------------------------

  if (loading) {
    return (
      <div className={styles.status}>
        관리자 Research 목록을 불러오는 중입니다...
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
          <h1 className={styles.title}>
            Admin Research
          </h1>

          <p className={styles.description}>
            공개 여부와 관계없이 전체 Research 게시글을
            관리하는 화면입니다.
          </p>
        </div>

        <Link
            to="/admin/research/new"
            className={styles.createLink}
        >
            새 Research 등록
        </Link>
      </header>

      {actionErrorMessage && (
        <div className={styles.actionError}>
          {actionErrorMessage}
        </div>
      )}

      {researchPosts.length === 0 ? (
        <div className={styles.empty}>
          등록된 Research 게시글이 없습니다.
        </div>
      ) : (
        <>
          <section className={styles.filterPanel} aria-label="Research 목록 필터">
            <div className={styles.filterGroup}>
              <label htmlFor="admin-research-title-search" className={styles.filterLabel}>
                제목 검색
              </label>

              <input
                id="admin-research-title-search"
                type="search"
                className={styles.searchInput}
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="제목으로 검색"
              />
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="admin-research-category-filter" className={styles.filterLabel}>
                카테고리
              </label>

              <select
                id="admin-research-category-filter"
                className={styles.filterSelect}
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="ALL">전체</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
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

          <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>제목</th>
                <th>카테고리</th>
                <th>공개 상태</th>
                <th>정렬</th>
                <th>생성일</th>
                <th>수정일</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {filteredResearchPosts.map((research) => {
                const isChangingPublication =
                  changingPublicationResearchId ===
                  research.researchId

                const isDeleting =
                  deletingResearchId ===
                  research.researchId

                const isActionRunning =
                  isChangingPublication ||
                  isDeleting

                return (
                  <tr key={research.researchId}>
                    <td>
                      {research.researchId}
                    </td>

                    <td>
                      <strong>
                        <Link
                            to={`/admin/research/${research.researchId}`}
                            className={styles.detailLink}
                        >
                            {research.title}
                        </Link>
                      </strong>

                      <div className={styles.slug}>
                        {research.slug}
                      </div>
                    </td>

                    <td>
                      {research.category}
                    </td>

                    <td>
                      <span
                        className={
                          research.published
                            ? `${styles.badge} ${styles.published}`
                            : `${styles.badge} ${styles.unpublished}`
                        }
                      >
                        {research.published
                          ? '공개'
                          : '비공개'}
                      </span>
                    </td>

                    <td>
                      {research.displayOrder}
                    </td>

                    <td>
                      {research.createdAt.slice(
                        0,
                        10,
                      )}
                    </td>

                    <td>
                      {research.updatedAt.slice(
                        0,
                        10,
                      )}
                    </td>

                    <td>
                      <div className={styles.actionGroup}>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={() =>
                            handleTogglePublication(
                              research,
                            )
                          }
                          disabled={isActionRunning}
                        >
                          {isChangingPublication
                            ? '변경 중'
                            : research.published
                              ? '숨김 처리'
                              : '공개 처리'}
                        </button>

                        <button
                          type="button"
                          className={styles.deleteButton}
                          onClick={() =>
                            handleDeleteResearch(
                              research,
                            )
                          }
                          disabled={isActionRunning}
                        >
                          {isDeleting
                            ? '삭제 중'
                            : '삭제'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filteredResearchPosts.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.filteredEmpty}>
                    <p>조건에 맞는 Research가 없습니다.</p>
                    <button
                      type="button"
                      className={styles.emptyResetButton}
                      onClick={handleResetFilters}
                    >
                      필터 초기화
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminResearchListPage
