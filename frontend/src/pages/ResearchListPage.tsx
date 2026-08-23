import { useEffect, useState } from 'react'
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
        const result = await getResearchList()
        if (!cancelled) setResearchPosts(result)
      } catch (error) {
        if (cancelled) return
        console.error(error)
        setErrorMessage('Research 목록을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchResearchPosts()
    return () => { cancelled = true }
  }, [])

  return (
    <main className={styles.page}>
      <header className={styles.intro}>
        <h1 className={styles.title}>기록하고 실험하며,<br />개발의 이유를 정리합니다.</h1>
        <p className={styles.description}>
          백엔드 개발 과정에서 학습하고 검증한 개념,<br />
          구조 설계와 구현 경험을 정리한 기록입니다.
        </p>
        <div className={styles.metaRule}>
          Research Notes · Backend · Architecture · Data
        </div>
      </header>

      <section className={styles.archive} aria-label="Research archive">
        {loading ? (
          <div className={styles.status}>Research 목록을 불러오는 중입니다...</div>
        ) : errorMessage ? (
          <div className={styles.error} role="alert">{errorMessage}</div>
        ) : researchPosts.length === 0 ? (
          <div className={styles.empty}>공개된 Research가 없습니다.</div>
        ) : (
          <div className={styles.list} aria-label="전체 Research 목록">
            {researchPosts.map((research) => (
              <article key={research.researchId} className={styles.item}>
                <div className={styles.meta}>
                  <time dateTime={research.updatedAt}>
                    {research.updatedAt.slice(0, 10).replaceAll('-', '.')}
                  </time>
                  <span className={styles.category}>{research.category}</span>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.itemTitle}>
                    <Link to={`/research/${research.slug}`}>{research.title}</Link>
                  </h3>
                  <p className={styles.summary}>{research.summary}</p>
                </div>
                <Link
                  to={`/research/${research.slug}`}
                  className={styles.readLink}
                  aria-label={`${research.title} Research 상세 보기`}
                >
                  Read Research <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default ResearchListPage
