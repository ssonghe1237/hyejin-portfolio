/**
 * packageName    : frontend.src.pages
 * fileName       : AboutPage.tsx
 * author         : Song
 * date           : 2026-08-05
 * description    : 사용자 About 페이지
 *                  - 공개 About 콘텐츠 API 조회
 *                  - About 메인 소개와 반복 섹션 출력
 *                  - 서버에서 정제한 Tiptap HTML 본문 렌더링
 *                  - 내부 및 외부 CTA 주소 구분 처리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-05        Song               공개 About API 연동
 */

import {
  useEffect,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import { getAbout } from '../api/aboutApi'
import type { AboutResponse } from '../types/about'
import styles from './AboutPage.module.css'

function isInternalRoute(
  url: string,
) {
  return (
    url.startsWith('/') &&
    !url.startsWith('//')
  )
}

function isHttpUrl(
  url: string,
) {
  return (
    url.startsWith('http://') ||
    url.startsWith('https://')
  )
}

function AboutPage() {
  const [about, setAbout] = useState<AboutResponse | null>(null)

  const [loading, setLoading] = useState(true)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // ============================================================================
  // 사용자 공개 About 조회
  // ============================================================================

  useEffect(() => {
    let cancelled = false

    async function fetchAbout() {
      try {
        setLoading(true)
        setErrorMessage(null)

        const result = await getAbout()

        if (!cancelled) {
          setAbout(result)
        }
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(error)

        /*
         * 미등록과 비공개 상태를 사용자 화면에서 구분X
         * 서버의 내부 상태를 노출하지 않고 동일한 안내를 제공
         */
        setErrorMessage(
          'About 콘텐츠를 준비하고 있습니다.',
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchAbout()

    return () => {
      cancelled = true
    }
  }, [])

  // ============================================================================
  // 화면 상태 분기
  // ============================================================================

  if (loading) {
    return (
      <main className={styles.statusPage}>
        About 콘텐츠를 불러오는 중입니다...
      </main>
    )
  }

  if (
    errorMessage ||
    !about
  ) {
    return (
      <main className={styles.statusPage}>
        <h1 className={styles.statusTitle}>
          About
        </h1>

        <p className={styles.statusMessage}>
          {errorMessage ??
            'About 콘텐츠를 찾을 수 없습니다.'}
        </p>

        <Link
          to="/"
          className={styles.backLink}
        >
          Home으로 돌아가기
        </Link>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>
          About
        </p>

        <h1 className={styles.heading}>
          {about.heading}
        </h1>

        <p className={styles.summary}>
          {about.summary}
        </p>
      </header>

      {about.competencies.length > 0 && (
        <section
          className={styles.competencies}
          aria-labelledby="about-competencies-title"
        >
          <div
            className={
              styles.competenciesHeader
            }
          >
            <p className={styles.eyebrow}>
              What I Do
            </p>

            <h2
              id="about-competencies-title"
              className={
                styles.competenciesTitle
              }
            >
              핵심 역량
            </h2>
          </div>

          <div
            className={
              styles.competencyGrid
            }
          >
            {about.competencies.map(
              (competency, index) => (
                <article
                  key={`${competency.displayOrder}-${competency.title}-${index}`}
                  className={
                    styles.competencyCard
                  }
                >
                  <span
                    className={
                      styles.competencyNumber
                    }
                  >
                    {String(index + 1).padStart(
                      2,
                      '0',
                    )}
                  </span>

                  <h3
                    className={
                      styles.competencyTitle
                    }
                  >
                    {competency.title}
                  </h3>

                  <p
                    className={
                      styles.competencyDescription
                    }
                  >
                    {competency.description}
                  </p>
                </article>
              ),
            )}
          </div>
        </section>
      )}

      {about.sections.length > 0 && (
        <div className={styles.sectionList}>
          {about.sections.map(
            (section, index) => (
              <section
                key={`${section.displayOrder}-${section.title}-${index}`}
                className={styles.section}
                aria-labelledby={`about-section-${index}`}
              >
                <div className={styles.sectionHeading}>
                  <span className={styles.sectionNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <h2
                    id={`about-section-${index}`}
                    className={styles.sectionTitle}
                  >
                    {section.title}
                  </h2>
                </div>

                <div
                  className={styles.content}
                  dangerouslySetInnerHTML={{
                    __html: section.contentHtml,
                  }}
                />
              </section>
            ),
          )}
        </div>
      )}

      <section
        className={styles.cta}
        aria-labelledby="about-cta-title"
      >
        <p className={styles.ctaEyebrow}>
          Get in touch
        </p>

        <h2
          id="about-cta-title"
          className={styles.ctaTitle}
        >
          함께 이야기해 보세요.
        </h2>

        {isInternalRoute(about.ctaUrl) ? (
          <Link
            to={about.ctaUrl}
            className={styles.ctaLink}
          >
            {about.ctaLabel}
          </Link>
        ) : (
          <a
            href={about.ctaUrl}
            className={styles.ctaLink}
            target={
              isHttpUrl(about.ctaUrl)
                ? '_blank'
                : undefined
            }
            rel={
              isHttpUrl(about.ctaUrl)
                ? 'noreferrer'
                : undefined
            }
          >
            {about.ctaLabel}
          </a>
        )}
      </section>
    </main>
  )
}

export default AboutPage