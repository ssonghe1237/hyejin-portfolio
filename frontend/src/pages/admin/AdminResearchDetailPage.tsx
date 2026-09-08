/**
 * packageName    : frontend.src.pages.admin
 * fileName       : AdminResearchDetailPage.tsx
 * author         : Song
 * date           : 2026-08-04
 * description    : 관리자 Research 상세 페이지
 *                  - Research ID 기준 관리자 상세 조회
 *                  - Research 기본 정보와 본문 HTML 확인
 *                  - 공개/비공개 상태 변경
 *                  - 사용자 Research 상세 페이지 연결
 *                  - Research 게시글 영구 삭제
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song               최초 생성
 */

import {
  useEffect,
  useState,
} from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  deleteAdminResearch,
  getAdminResearchDetail,
  updateAdminResearchPublication,
} from '../../api/adminResearchApi'
import type { AdminResearchDetailResponse } from '../../types/research'
import styles from './AdminResearchDetailPage.module.css'

function AdminResearchDetailPage() {
  const navigate = useNavigate()

  const { researchId } =
    useParams<{ researchId: string }>()

  const [research, setResearch] =
    useState<AdminResearchDetailResponse | null>(
      null,
    )

  const [loading, setLoading] =
    useState(true)

  const [changingPublication, setChangingPublication] =
    useState(false)

  const [deleting, setDeleting] =
    useState(false)

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null)

  const [actionErrorMessage, setActionErrorMessage] =
    useState<string | null>(null)

  // ============================================================================
  // 1) 관리자 Research 상세 조회
  // ============================================================================

  useEffect(() => {
    async function fetchResearchDetail() {
      const parsedResearchId =
        Number(researchId)

      if (
        !Number.isInteger(parsedResearchId) ||
        parsedResearchId <= 0
      ) {
        setErrorMessage(
          'Research 게시글 번호가 올바르지 않습니다.',
        )
        setLoading(false)

        return
      }

      try {
        setLoading(true)
        setErrorMessage(null)

        const result =
          await getAdminResearchDetail(
            parsedResearchId,
          )

        setResearch(result)
      } catch (error) {
        console.error(error)

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Research 상세 정보를 불러오지 못했습니다.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchResearchDetail()
  }, [researchId])

  // ============================================================================
  // 2) 공개·비공개 상태 변경
  // ============================================================================

  async function handleTogglePublication() {
    if (!research) {
      return
    }

    const nextPublished =
      !research.published

    const actionLabel =
      nextPublished
        ? '공개'
        : '비공개'

    const confirmed =
      window.confirm(
        `${research.title} Research를 ${actionLabel} 상태로 변경하시겠습니까?`,
      )

    if (!confirmed) {
      return
    }

    try {
      setChangingPublication(true)
      setActionErrorMessage(null)

      const updatedResearch =
        await updateAdminResearchPublication(
          research.researchId,
          nextPublished,
        )

      setResearch(updatedResearch)
    } catch (error) {
      console.error(error)

      setActionErrorMessage(
        error instanceof Error
          ? error.message
          : 'Research 공개 상태를 변경하지 못했습니다.',
      )
    } finally {
      setChangingPublication(false)
    }
  }

  // ============================================================================
  // 3) 삭제
  // ============================================================================

  async function handleDeleteResearch() {
    if (!research) {
      return
    }

    const confirmed =
      window.confirm(
        `${research.title} Research를 삭제하시겠습니까?\n삭제한 게시글은 복구할 수 없습니다.`,
      )

    if (!confirmed) {
      return
    }

    try {
      setDeleting(true)
      setActionErrorMessage(null)

      await deleteAdminResearch(
        research.researchId,
      )

      navigate(
        '/admin/research',
        {
          replace: true,
        },
      )
    } catch (error) {
      console.error(error)

      setActionErrorMessage(
        error instanceof Error
          ? error.message
          : 'Research 게시글을 삭제하지 못했습니다.',
      )
    } finally {
      setDeleting(false)
    }
  }

  // ============================================================================
  // 4) 화면 분기
  // ============================================================================

  if (loading) {
    return (
      <div className={styles.status}>
        Research 상세 정보를 불러오는 중입니다...
      </div>
    )
  }

  if (errorMessage || !research) {
    return (
      <div className={styles.errorPage}>
        <p>
          {errorMessage ??
            'Research 게시글을 찾을 수 없습니다.'}
        </p>

        <Link
          to="/admin/research"
          className={styles.backLink}
        >
          관리자 Research 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  const actionRunning =
    changingPublication ||
    deleting

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Admin Research
          </p>

          <h1 className={styles.title}>
            {research.title}
          </h1>

          <p className={styles.summary}>
            {research.summary}
          </p>
        </div>

        <Link
          to="/admin/research"
          className={styles.backLink}
        >
          목록으로 돌아가기
        </Link>
      </header>

      {actionErrorMessage && (
        <div
          className={styles.actionError}
          role="alert"
        >
          {actionErrorMessage}
        </div>
      )}

      <section
        className={styles.section}
        aria-labelledby="research-detail-basic"
      >
        <div className={styles.sectionHeader}>
          <h2
            id="research-detail-basic"
            className={styles.sectionTitle}
          >
            기본 정보
          </h2>

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
        </div>

        <dl className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <dt>Research ID</dt>
            <dd>{research.researchId}</dd>
          </div>

          <div className={styles.infoItem}>
            <dt>Slug</dt>
            <dd>{research.slug}</dd>
          </div>

          <div className={styles.infoItem}>
            <dt>카테고리</dt>
            <dd>{research.category}</dd>
          </div>

          <div className={styles.infoItem}>
            <dt>표시 순서</dt>
            <dd>{research.displayOrder}</dd>
          </div>

          <div className={styles.infoItem}>
            <dt>생성일</dt>
            <dd>
              {research.createdAt.slice(
                0,
                19,
              )}
            </dd>
          </div>

          <div className={styles.infoItem}>
            <dt>수정일</dt>
            <dd>
              {research.updatedAt.slice(
                0,
                19,
              )}
            </dd>
          </div>

          <div className={styles.infoItem}>
            <dt>최초 공개일</dt>
            <dd>
              {research.publishedAt
                ? research.publishedAt.slice(
                    0,
                    19,
                  )
                : '아직 공개된 적 없음'}
            </dd>
          </div>
        </dl>
      </section>

      <section
        className={styles.section}
        aria-labelledby="research-detail-content"
      >
        <h2
          id="research-detail-content"
          className={styles.sectionTitle}
        >
          본문 미리보기
        </h2>

        <article
          className={styles.content}
          dangerouslySetInnerHTML={{
            __html:
              research.contentHtml,
          }}
        />
      </section>

      <section
        className={styles.section}
        aria-labelledby="research-detail-actions"
      >
        <h2
          id="research-detail-actions"
          className={styles.sectionTitle}
        >
          게시글 관리
        </h2>

        <div className={styles.actionGroup}>
          <Link
            to={`/admin/research/${research.researchId}/edit`}
            className={styles.editLink}
          >
            Research 수정
          </Link>

          <button
            type="button"
            className={styles.publicationButton}
            onClick={
              handleTogglePublication
            }
            disabled={actionRunning}
          >
            {changingPublication
              ? '상태 변경 중...'
              : research.published
                ? '비공개로 변경'
                : '공개로 변경'}
          </button>

          {research.published && (
            <Link
              to={`/research/${research.slug}`}
              className={styles.previewLink}
              target="_blank"
              rel="noreferrer"
            >
              사용자 화면 보기
            </Link>
          )}

          <button
            type="button"
            className={styles.deleteButton}
            onClick={
              handleDeleteResearch
            }
            disabled={actionRunning}
          >
            {deleting
              ? '삭제 중...'
              : 'Research 삭제'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default AdminResearchDetailPage