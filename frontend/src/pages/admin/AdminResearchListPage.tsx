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
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song               최초 생성
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
              {researchPosts.map((research) => {
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminResearchListPage