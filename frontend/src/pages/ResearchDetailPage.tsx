/**
 * packageName    : frontend.src.pages
 * fileName       : ResearchDetailPage.tsx
 * author         : Song
 * date           : 2026-08-04
 * description    : 사용자 Research 상세 페이지
 *                  - URL slug 기준 공개 Research 상세 조회
 *                  - Research 제목, 요약, 카테고리 및 날짜 출력
 *                  - Tiptap으로 작성하고 서버에서 정제한 본문 HTML 출력
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song               최초 생성
 * 2026-08-04        Song               Tiptap 본문 및 코드 블록 스타일 적용
 */


import { Link, useParams } from 'react-router-dom'
import type { ResearchDetailResponse } from '../types/research'
import { getResearchDetail } from '../api/researchApi'
import { useEffect, useState } from 'react'
import styles from './ResearchDetailPage.module.css'


function ResearchDetailPage() {
    // ================================================================
    // hook
    // ----------------------------------------------------------------
    const {slug} = useParams<{slug : string}>()
    const [research, setResearch] = useState<ResearchDetailResponse>()
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // ================================================================
    // useEffect
    // ----------------------------------------------------------------
    useEffect(() => {
        async function fetchResearchDetail() {
            if(!slug) {
                setErrorMessage(
                    'Research 게시글 주소가 올바르지 않습니다.'
                )
                setLoading(false)

                return
            }

            try {
                setLoading(false)
                setErrorMessage(null)

                const result = await getResearchDetail(slug)

                setResearch(result)
            } catch(error) {
                console.error(error)

                setErrorMessage('Research 게시글을 불러오지 못했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchResearchDetail()
    }, [slug])

    // ================================================================
    // 화면 분기
    // ----------------------------------------------------------------
    if (loading) {
        return (
        <div>
            Research 게시글을 불러오는 중입니다...
        </div>
        )
    }

    if (errorMessage || !research) {
        return (
        <div>
            <p>
            {errorMessage ??
                'Research 게시글을 찾을 수 없습니다.'}
            </p>

            <Link to="/work">
            Work로 돌아가기
            </Link>
        </div>
        )
    }

    return (
        <article className={styles.page}>
            <header className={styles.header}>
            <p className={styles.category}>
                {research.category}
            </p>

            <h1 className={styles.title}>
                {research.title}
            </h1>

            <p className={styles.summary}>
                {research.summary}
            </p>

            <div className={styles.dateGroup}>
                <time dateTime={research.publishedAt}>
                Published {research.publishedAt.slice(0, 10)}
                </time>

                {research.updatedAt !== research.publishedAt && (
                <time dateTime={research.updatedAt}>
                    Updated {research.updatedAt.slice(0, 10)}
                </time>
                )}
            </div>
            </header>

            <div
            className={styles.content}
            dangerouslySetInnerHTML={{
                __html: research.contentHtml,
            }}
            />

            <footer className={styles.footer}>
            <Link
                to="/work"
                className={styles.backLink}
            >
                Back to Work
            </Link>
            </footer>
        </article>
    )  
}

export default ResearchDetailPage