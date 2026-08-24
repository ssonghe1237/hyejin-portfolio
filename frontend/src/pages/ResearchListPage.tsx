/**
 * packageName    : frontend.src.pages
 * fileName       : ResearchListPage.tsx
 * author         : Song
 * date           : 2026-08-04
 * description    : Research 목록 페이지
 *                  - 공개 Research 목록 조회 및 상세 이동 제공
 *                  - 제목 검색과 카테고리 필터를 통한 목록 탐색 지원
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song       최초 생성
 * 2026-08-24        Song       검색·카테고리 필터 및 목록 화면 재구성
 */

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getResearchList } from '../api/researchApi'
import type { ResearchListResponse } from '../types/research'
import styles from './ResearchListPage.module.css'

function ResearchListPage() {
  const [researchPosts, setResearchPosts] = useState<ResearchListResponse[]>([])
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const categories = useMemo(
    () => Array.from(new Set(researchPosts.map((research) => research.category))),
    [researchPosts],
  )

  const filteredResearchPosts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase()

    return researchPosts.filter((research) => {
      const matchesTitle = normalizedKeyword.length === 0
        || research.title.toLocaleLowerCase().includes(normalizedKeyword)
      const matchesCategory = selectedCategory === 'ALL'
        || research.category === selectedCategory

      return matchesTitle && matchesCategory
    })
  }, [keyword, researchPosts, selectedCategory])

  const hasActiveFilters = keyword.length > 0 || selectedCategory !== 'ALL'

  function resetFilters() {
    setKeyword('')
    setSelectedCategory('ALL')
  }

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

      {!loading && !errorMessage && researchPosts.length > 0 && (
        <div className={styles.explore} aria-label="Research 검색 및 필터">
          <div className={styles.searchField}>
            <label htmlFor="research-title-search" className={styles.visuallyHidden}>
              Research 제목 검색
            </label>
            <input
              id="research-title-search"
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className={styles.searchInput}
              placeholder="제목으로 검색"
            />
          </div>
          <div className={styles.categoryField}>
            <label htmlFor="research-category" className={styles.visuallyHidden}>
              Research 카테고리
            </label>
            <select
              id="research-category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className={styles.categorySelect}
            >
              <option value="ALL">전체</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className={styles.resetButton}
            onClick={resetFilters}
            disabled={!hasActiveFilters}
          >
            초기화
          </button>
        </div>
      )}

      <section className={styles.archive} aria-label="Research archive">
        {loading ? (
          <div className={styles.status}>Research 목록을 불러오는 중입니다...</div>
        ) : errorMessage ? (
          <div className={styles.error} role="alert">{errorMessage}</div>
        ) : researchPosts.length === 0 ? (
          <div className={styles.empty}>공개된 Research가 없습니다.</div>
        ) : filteredResearchPosts.length === 0 ? (
          <div className={styles.empty} aria-live="polite">
            <p>검색 결과가 없습니다.</p>
            <p>검색어 또는 카테고리를 다시 확인해 주세요.</p>
            <button type="button" className={styles.emptyResetButton} onClick={resetFilters}>
              필터 초기화
            </button>
          </div>
        ) : (
          <div className={styles.list} aria-label="Research 검색 결과">
            {filteredResearchPosts.map((research) => (
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
