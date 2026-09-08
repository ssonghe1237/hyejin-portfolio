/**
 * packageName    : frontend.src.pages
 * fileName       : ResearchDetailPage.tsx
 * author         : Song
 * date           : 2026-08-04
 * description    : Research 상세 페이지
 *                  - slug 기반 공개 Research 상세 조회
 *                  - Research 본문 및 이전·다음 게시글 탐색 제공
 *                  - 로딩 및 오류 상태 처리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song       최초 생성
 * 2026-08-24        Song       상세 본문 및 게시글 탐색 화면 재구성
 */

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getResearchDetail, getResearchList } from '../api/researchApi'
import RichTextContent from '../components/common/RichTextContent'
import type { ResearchDetailResponse, ResearchListResponse } from '../types/research'
import styles from './ResearchDetailPage.module.css'

function ResearchDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [research, setResearch] = useState<ResearchDetailResponse>()
  const [researchList, setResearchList] = useState<ResearchListResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchResearchDetail() {
      if (!slug) {
        setErrorMessage('Research 게시글 주소가 올바르지 않습니다.')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setErrorMessage(null)
        const result = await getResearchDetail(slug)
        setResearch(result)
      } catch (error) {
        console.error(error)
        setErrorMessage('Research 게시글을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchResearchDetail()
  }, [slug])

  useEffect(() => {
    getResearchList()
      .then(setResearchList)
      .catch((error) => console.error(error))
  }, [])

  if (loading) return <div className={styles.state}>Research 게시글을 불러오는 중입니다...</div>

  if (errorMessage || !research) {
    return (
      <div className={styles.state} role="alert">
        <p>{errorMessage ?? 'Research 게시글을 찾을 수 없습니다.'}</p>
        <Link to="/research">Research 목록으로 돌아가기</Link>
      </div>
    )
  }

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{research.title}</h1>
        <div className={styles.meta}>
          <span>{research.category}</span>
          <time dateTime={research.updatedAt}>UPDATED {research.updatedAt.slice(0, 10).replaceAll('-', '.')}</time>
        </div>
      </header>

      <div className={styles.divider} />
      <RichTextContent html={research.contentHtml} className={styles.articleBody} />

      <footer className={styles.footer}>
        <nav className={styles.postNavigation} aria-label="Research 게시글 탐색">
          {(() => {
            const currentIndex = researchList.findIndex((post) => post.slug === research.slug)
            const previous = currentIndex > 0 ? researchList[currentIndex - 1] : undefined
            const next = currentIndex >= 0 ? researchList[currentIndex + 1] : undefined

            return (
              <>
                {previous ? <Link to={`/research/${previous.slug}`}>이전글</Link> : <span>이전글</span>}
                <Link to="/research">목록으로 돌아가기</Link>
                {next ? <Link to={`/research/${next.slug}`}>이후글</Link> : <span>이후글</span>}
              </>
            )
          })()}
        </nav>
      </footer>
    </article>
  )
}

export default ResearchDetailPage
