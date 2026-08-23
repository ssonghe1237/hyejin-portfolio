/**
 * packageName    : frontend.src.components.work
 * fileName       : WorkResearchSection.tsx
 * author         : Song
 * date           : 2026-08-04
 * description    : Work 페이지 Research 목록 섹션 컴포넌트
 *                  - 최근 수정된 공개 Research 최대 5개 출력
 *                  - 가로 스크롤 카드형 목록 제공
 *                  - Research 상세 및 전체 목록 페이지 연결
 *                  - 로딩, 오류 및 빈 목록 상태 처리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song               최초 생성
 * 2026-08-04        Song               최근 Research 가로 스크롤 카드 및 전체보기 추가
 * 2026-08-24        Song               Research 목록 및 전체보기 표현 구조 재구성
 */

import { Link } from 'react-router-dom'
import type { ResearchListResponse } from '../../types/research'
import styles from './WorkResearchSection.module.css'

interface WorkResearchSectionProps {
  researchPosts: ResearchListResponse[]
  loading: boolean
  errorMessage: string | null
}

function WorkResearchSection({
  researchPosts,
  loading,
  errorMessage,
}: WorkResearchSectionProps) {
  return (
    <section className={styles.research} aria-labelledby="research-section-title">
      <div className={styles.researchInner}>
        <div className={styles.researchTopBand}>
          <div className={`${styles.researchCard} ${styles.researchCardTop}`}>
            <header className={styles.header}>
              <div className={styles.researchHeading}>
                <h2 id="research-section-title" className={styles.title}>
                  Research
                </h2>

                <p className={styles.description}>
                  개발 과정에서 학습하고 검증한 기술 개념과
                  구현 내용을 기록합니다.
                </p>
              </div>

              <Link to="/research" className={styles.viewAllLink}>
                View all Research
                <span className={styles.arrow} aria-hidden="true">→</span>
              </Link>
            </header>
          </div>
        </div>

        <div className={styles.researchLowerBand}>
          <div className={`${styles.researchCard} ${styles.researchCardBottom}`}>
            {loading ? (
              <div className={styles.status}>
                최근 Research 목록을 불러오는 중입니다...
              </div>
            ) : errorMessage ? (
              <div className={styles.error} role="alert">
                {errorMessage}
              </div>
            ) : researchPosts.length === 0 ? (
              <div className={styles.status}>
                공개된 Research가 없습니다.
              </div>
            ) : (
              <div className={styles.researchList} aria-label="최근 Research 목록">
                {researchPosts.map((research) => (
                  <article
                    key={research.researchId}
                    className={styles.researchRow}
                  >
                    <div className={styles.researchMeta}>
                      <span className={styles.researchCategory}>{research.category}</span>

                      <time className={styles.researchDate} dateTime={research.updatedAt}>
                        Updated {research.updatedAt.slice(0, 10)}
                      </time>
                    </div>

                    <div className={styles.researchContent}>
                      <h3 className={styles.researchTitle}>
                        <Link
                          to={`/research/${research.slug}`}
                          className={styles.researchLink}
                        >
                          {research.title}
                        </Link>
                      </h3>

                      {research.summary && (
                        <p className={styles.researchSummary}>{research.summary}</p>
                      )}
                    </div>

                    <div>
                      <Link
                        to={`/research/${research.slug}`}
                        className={styles.readLink}
                        aria-label={`${research.title} 자세히 보기`}
                      >
                        <span>Read Research</span>
                        <span className={styles.arrow} aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorkResearchSection
