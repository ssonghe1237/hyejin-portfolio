/**
 * packageName    : frontend.src.pages
 * fileName       : ContactPage.tsx
 * author         : Song
 * date           : 2026-08-03
 * description    : 포트폴리오 사용자 연락처 페이지
 *                  - 공개 Contact API 기반 연락 정보 제공
 *                  - 이메일 및 외부 프로필 링크 제공
 *                  - 관리자 등록 이력서 PDF 열람 링크 제공
 *                  - 메시지 전송 폼 제외
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song               최초 생성
 * 2026-08-10        Song               Contact API 및 이력서 PDF 연동
 */

import {
  useEffect,
  useState,
} from 'react'
import { getContact } from '../api/contactApi'
import type { ContactResponse } from '../types/contact'
import styles from './ContactPage.module.css'

function ContactPage() {
  // =============================================================================================
  // 1) Hook
  // =============================================================================================

  const [contact, setContact] =
    useState<ContactResponse | null>(
      null,
    )

  const [loading, setLoading] =
    useState(true)

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null)

  // =============================================================================================
  // 2) Contact 조회
  // =============================================================================================

  useEffect(() => {
    let cancelled = false

    async function fetchContact() {
      try {
        setLoading(true)
        setErrorMessage(null)

        const result =
          await getContact()

        if (!cancelled) {
          setContact(result)
        }
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(error)

        /*
         * Contact 미등록 / 비공개 여부를
         * 사용자 화면에서 구분해서 노출하지 않는다.
         */
        setErrorMessage(
          'Contact 콘텐츠를 준비하고 있습니다.',
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchContact()

    return () => {
      cancelled = true
    }
  }, [])

  // =============================================================================================
  // 3) Render - Loading
  // =============================================================================================

  if (loading) {
    return (
      <main className={styles.page}>
        <p className={styles.stateMessage}>
          Contact 정보를 불러오는 중입니다...
        </p>
      </main>
    )
  }

  // =============================================================================================
  // 4) Render - Error
  // =============================================================================================

  if (
    errorMessage ||
    !contact
  ) {
    return (
      <main className={styles.page}>
        <section
          className={styles.stateSection}
        >
          <p className={styles.eyebrow}>
            Get in touch
          </p>

          <h1 className={styles.stateTitle}>
            {errorMessage ??
              'Contact 콘텐츠를 준비하고 있습니다.'}
          </h1>
        </section>
      </main>
    )
  }

  // =============================================================================================
  // 5) Render - Contact
  // =============================================================================================

  return (
    <main className={styles.page}>
      {/* Contact Intro */}
      <section
        className={styles.hero}
        aria-labelledby="contact-title"
      >
        <p className={styles.eyebrow}>
          Get in touch
        </p>

        <h1
          id="contact-title"
          className={styles.heroTitle}
        >
          {contact.heading}
        </h1>

        <p
          className={
            styles.heroDescription
          }
        >
          {contact.description}
        </p>
      </section>

      {/* Contact Links */}
      <section
        className={styles.contactSection}
        aria-labelledby="contact-links-title"
      >
        <div
          className={
            styles.sectionHeading
          }
        >
          <p className={styles.eyebrow}>
            Contact
          </p>

          <h2
            id="contact-links-title"
            className={
              styles.sectionTitle
            }
          >
            연락처
          </h2>
        </div>

        <div
          className={
            styles.contactList
          }
        >
          {/* Email */}
          <div
            className={
              styles.contactItem
            }
          >
            <span
              className={
                styles.contactLabel
              }
            >
              Email
            </span>

            <a
              href={`mailto:${contact.email}`}
              className={
                styles.contactLink
              }
            >
              {contact.email}
            </a>
          </div>

          {/* GitHub */}
          <div
            className={
              styles.contactItem
            }
          >
            <span
              className={
                styles.contactLabel
              }
            >
              GitHub
            </span>

            <a
              href={contact.githubUrl}
              target="_blank"
              rel="noreferrer"
              className={
                styles.contactLink
              }
            >
              {contact.githubUrl}
            </a>
          </div>

          {/* LinkedIn */}
          {contact.linkedinUrl && (
            <div
              className={
                styles.contactItem
              }
            >
              <span
                className={
                  styles.contactLabel
                }
              >
                LinkedIn
              </span>

              <a
                href={
                  contact.linkedinUrl
                }
                target="_blank"
                rel="noreferrer"
                className={
                  styles.contactLink
                }
              >
                {contact.linkedinUrl}
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Resume */}
      {contact.resumeFileUrl && (
        <section
          className={styles.resumeSection}
          aria-labelledby="contact-resume-title"
        >
          <div>
            <p className={styles.eyebrow}>
              Resume
            </p>

            <h2
              id="contact-resume-title"
              className={
                styles.resumeTitle
              }
            >
              더 자세한 경험과
              <br />
              프로젝트를 확인해 주세요.
            </h2>
          </div>

          <a
            href={
              contact.resumeFileUrl
            }
            target="_blank"
            rel="noreferrer"
            className={
              styles.resumeLink
            }
          >
            {contact.resumeLabel}
            <span
              aria-hidden="true"
              className={
                styles.resumeArrow
              }
            >
              ↗
            </span>
          </a>
        </section>
      )}
    </main>
  )
}

export default ContactPage