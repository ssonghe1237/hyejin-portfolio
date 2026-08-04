/**
 * packageName    : frontend.src.pages
 * fileName       : ResearchListPage.tsx
 * author         : Song
 * date           : 2026-08-04
 * description    : 사용자 Research 전체 목록 페이지
 *                  - 전체 공개 Research 게시글 조회
 *                  - Research 제목, 요약, 카테고리 및 날짜 출력
 *                  - 항목 클릭 시 Research 상세 페이지 이동
 *                  - 로딩, 오류 및 빈 목록 상태 처리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song               최초 생성
 */

import {
  useEffect,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import { getResearchList } from '../api/researchApi'
import type { ResearchListResponse } from '../types/research'
import styles from './ResearchListPage.module.css'

function ResearchListPage() {
  const [researchPosts, setResearchPosts] = useState<ResearchListResponse[]>([])

  const [loading, setLoading] = useState(true)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchResearchPosts() {
      try {
        setLoading(true)
        setErrorMessage(null)

        const result =
          await getResearchList()

        if (!cancelled) {
          setResearchPosts(result)
        }
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(error)

        setErrorMessage(
          'Research 목록을 불러오지 못했습니다.',
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchResearchPosts()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className={styles.status}>
        Research 목록을 불러오는 중입니다...
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div
        className={styles.error}
        role="alert"
      >
        {errorMessage}
      </div>
    )
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          Development Notes
        </p>

        <h1 className={styles.title}>
          Research
        </h1>

        <p className={styles.description}>
          백엔드 개발 과정에서 학습하고 검증한 개념,
          구조 설계와 구현 경험을 정리한 기록입니다.
        </p>
      </header>

      {researchPosts.length === 0 ? (
        <div className={styles.empty}>
          공개된 Research가 없습니다.
        </div>
      ) : (
        <section
          className={styles.list}
          aria-label="전체 Research 목록"
        >
          {researchPosts.map((research) => (
            <article
              key={research.researchId}
              className={styles.item}
            >
              <Link
                to={`/research/${research.slug}`}
                className={styles.itemLink}
                aria-label={`${research.title} Research 상세 보기`}
              >
                <div className={styles.meta}>
                  <span className={styles.category}>
                    {research.category}
                  </span>

                  <time dateTime={research.updatedAt}>
                    Updated{' '}
                    {research.updatedAt.slice(0, 10)}
                  </time>
                </div>

                <div className={styles.content}>
                  <h2 className={styles.itemTitle}>
                    {research.title}
                  </h2>

                  <p className={styles.summary}>
                    {research.summary}
                  </p>
                </div>

                <span
                  className={styles.arrow}
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </article>
          ))}
        </section>
      )}

      <footer className={styles.footer}>
        <Link
          to="/work"
          className={styles.backLink}
        >
          Back to Work
        </Link>
      </footer>
    </main>
  )
}

export default ResearchListPage