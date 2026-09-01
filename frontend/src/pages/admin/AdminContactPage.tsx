/**
 * packageName    : frontend.src.pages.admin
 * fileName       : AdminContactPage.tsx
 * author         : Song
 * date           : 2026-08-10
 * description    : 관리자 Contact 콘텐츠 관리 페이지
 *                  - Contact 기본 정보 생성 및 수정
 *                  - Contact 공개 여부 관리
 *                  - 이력서 PDF 업로드, 교체, 삭제
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-10        Song               최초 생성
 */

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  deleteContactResume,
  getAdminContact,
  uploadContactResume,
  upsertAdminContact,
} from '../../api/adminContactApi'

import type {
  AdminContactDetailResponse,
  AdminContactUpsertRequest,
} from '../../types/contact'

import styles from './AdminContactPage.module.css'

interface ContactFormState {
  heading: string
  description: string
  email: string
  githubUrl: string
  linkedinUrl: string
  resumeLabel: string
  published: boolean
}

const MAX_RESUME_SIZE = 10 * 1024 * 1024

function createInitialForm(): ContactFormState {
  return {
    heading: '',
    description: '',
    email: '',
    githubUrl: '',
    linkedinUrl: '',
    resumeLabel: 'View Resume',
    published: false,
  }
}

function AdminContactPage() {
  // =============================================================================================
  // 1) Hook
  // =============================================================================================

  const [form, setForm] =
    useState<ContactFormState>(
      createInitialForm(),
    )

  const [contact, setContact] =
    useState<AdminContactDetailResponse | null>(
      null,
    )

  const [loading, setLoading] =
    useState(true)

  const [submitting, setSubmitting] =
    useState(false)

  const [
    resumeSubmitting,
    setResumeSubmitting,
  ] = useState(false)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null)

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<string | null>(null)

  const resumeInputRef =
    useRef<HTMLInputElement | null>(null)

  // =============================================================================================
  // 2) 최초 조회
  // =============================================================================================

  useEffect(() => {
    let cancelled = false

    async function fetchContact() {
      try {
        setLoading(true)
        setErrorMessage(null)

        const result =
          await getAdminContact()

        if (cancelled) {
          return
        }

        if (result === null) {
          setContact(null)
          setForm(
            createInitialForm(),
          )

          return
        }

        applyContactResponse(
          result,
        )
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(error)

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Contact 정보를 불러오지 못했습니다.',
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
  // 3) 응답 → 화면 상태 적용
  // =============================================================================================

  function applyContactResponse(
    response: AdminContactDetailResponse,
  ) {
    setContact(response)

    setForm({
      heading: response.heading,
      description:
        response.description,
      email: response.email,
      githubUrl:
        response.githubUrl,
      linkedinUrl:
        response.linkedinUrl ?? '',
      resumeLabel:
        response.resumeLabel,
      published:
        response.published,
    })
  }

  // =============================================================================================
  // 4) 기본 입력값 변경
  // =============================================================================================

  function updateField(
    field:
      | 'heading'
      | 'description'
      | 'email'
      | 'githubUrl'
      | 'linkedinUrl'
      | 'resumeLabel',
    value: string,
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))

    clearMessages()
  }

  function handlePublishedChange(
    published: boolean,
  ) {
    setForm((previous) => ({
      ...previous,
      published,
    }))

    clearMessages()
  }

  // =============================================================================================
  // 5) 기본 정보 저장
  // =============================================================================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const validationMessage =
      validateForm()

    if (validationMessage) {
      setErrorMessage(
        validationMessage,
      )

      return
    }

    const request:
      AdminContactUpsertRequest = {
        heading:
          form.heading.trim(),
        description:
          form.description.trim(),
        email:
          form.email.trim(),
        githubUrl:
          form.githubUrl.trim(),
        linkedinUrl:
          form.linkedinUrl.trim(),
        resumeLabel:
          form.resumeLabel.trim(),
        published:
          form.published,
      }

    try {
      setSubmitting(true)
      clearMessages()

      const response =
        await upsertAdminContact(
          request,
        )

      applyContactResponse(
        response,
      )

      setSuccessMessage(
        'Contact 정보를 저장했습니다.',
      )
    } catch (error) {
      console.error(error)

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Contact 정보를 저장하지 못했습니다.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  // =============================================================================================
  // 6) PDF 업로드 / 교체
  // =============================================================================================

  async function handleResumeChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    /*
     * Contact 기본 정보가 존재하지 않으면
     * Backend uploadResume()에서 409를 반환하므로
     * 프론트에서도 업로드를 막는다.
     */
    if (!contact) {
      setErrorMessage(
        '이력서를 업로드하기 전에 Contact 기본 정보를 먼저 저장해 주세요.',
      )

      resetResumeInput()

      return
    }

    const validationMessage =
      validateResumeFile(
        file,
      )

    if (validationMessage) {
      setErrorMessage(
        validationMessage,
      )

      resetResumeInput()

      return
    }

    const replacing =
      Boolean(
        contact.resumeFileUrl,
      )

    if (replacing) {
      const confirmed =
        window.confirm(
          '현재 등록된 이력서를 새 PDF로 교체하시겠습니까?',
        )

      if (!confirmed) {
        resetResumeInput()

        return
      }
    }

    try {
      setResumeSubmitting(true)
      clearMessages()

      const response =
        await uploadContactResume(
          file,
        )

      applyContactResponse(
        response,
      )

      setSuccessMessage(
        replacing
          ? '이력서 PDF를 교체했습니다.'
          : '이력서 PDF를 업로드했습니다.',
      )
    } catch (error) {
      console.error(error)

      setErrorMessage(
        error instanceof Error
          ? error.message
          : '이력서 PDF를 업로드하지 못했습니다.',
      )
    } finally {
      setResumeSubmitting(false)

      resetResumeInput()
    }
  }

  // =============================================================================================
  // 7) PDF 삭제
  // =============================================================================================

  async function handleDeleteResume() {
    if (
      !contact?.resumeFileUrl
    ) {
      return
    }

    const confirmed =
      window.confirm(
        '현재 등록된 이력서 PDF를 삭제하시겠습니까?',
      )

    if (!confirmed) {
      return
    }

    try {
      setResumeSubmitting(true)
      clearMessages()

      await deleteContactResume()

      setContact((previous) => {
        if (!previous) {
          return null
        }

        return {
          ...previous,
          resumeFileUrl: null,
          resumeOriginalFileName:
            null,
        }
      })

      setSuccessMessage(
        '이력서 PDF를 삭제했습니다.',
      )
    } catch (error) {
      console.error(error)

      setErrorMessage(
        error instanceof Error
          ? error.message
          : '이력서 PDF를 삭제하지 못했습니다.',
      )
    } finally {
      setResumeSubmitting(false)
    }
  }

  // =============================================================================================
  // 8) 검증
  // =============================================================================================

  function validateForm():
    string | null {
    if (!form.heading.trim()) {
      return 'Contact 메인 제목을 입력해 주세요.'
    }

    if (!form.description.trim()) {
      return 'Contact 소개 문구를 입력해 주세요.'
    }

    if (!form.email.trim()) {
      return '이메일을 입력해 주세요.'
    }

    if (
      !isValidEmail(
        form.email.trim(),
      )
    ) {
      return '올바른 이메일 형식을 입력해 주세요.'
    }

    if (!form.githubUrl.trim()) {
      return 'GitHub 주소를 입력해 주세요.'
    }

    if (
      !isValidHttpUrl(
        form.githubUrl.trim(),
      )
    ) {
      return 'GitHub 주소는 http 또는 https 형식으로 입력해 주세요.'
    }

    if (
      form.linkedinUrl.trim() &&
      !isValidHttpUrl(
        form.linkedinUrl.trim(),
      )
    ) {
      return 'LinkedIn 주소는 http 또는 https 형식으로 입력해 주세요.'
    }

    if (
      !form.resumeLabel.trim()
    ) {
      return '이력서 버튼 문구를 입력해 주세요.'
    }

    return null
  }

  function validateResumeFile(
    file: File,
  ): string | null {
    const fileName =
      file.name.toLowerCase()

    if (
      !fileName.endsWith(
        '.pdf',
      )
    ) {
      return 'PDF 파일만 업로드할 수 있습니다.'
    }

    /*
     * 브라우저 Content-Type은 보조 검증만 한다.
     * 실제 보안 검증은 Backend에서 다시 수행한다.
     */
    if (
      file.type &&
      file.type !== 'application/pdf'
    ) {
      return 'PDF 형식의 파일만 업로드할 수 있습니다.'
    }

    if (
      file.size >
      MAX_RESUME_SIZE
    ) {
      return '이력서 PDF는 10MB 이하만 업로드할 수 있습니다.'
    }

    return null
  }

  function isValidEmail(
    email: string,
  ) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email,
    )
  }

  function isValidHttpUrl(
    rawUrl: string,
  ) {
    try {
      const url =
        new URL(rawUrl)

      return (
        url.protocol === 'http:' ||
        url.protocol === 'https:'
      )
    } catch {
      return false
    }
  }

  // =============================================================================================
  // 9) 공통
  // =============================================================================================

  function clearMessages() {
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  function resetResumeInput() {
    if (
      resumeInputRef.current
    ) {
      resumeInputRef.current.value =
        ''
    }
  }

  // =============================================================================================
  // 10) Render
  // =============================================================================================

  if (loading) {
    return (
      <main
        className={styles.page}
      >
        <p>
          Contact 정보를 불러오는 중입니다...
        </p>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <header
        className={
          styles.pageHeader
        }
      >
        <div>
          <p
            className={
              styles.eyebrow
            }
          >
            Admin
          </p>

          <h1
            className={
              styles.pageTitle
            }
          >
            Contact 관리
          </h1>

          <p
            className={
              styles.pageDescription
            }
          >
            사용자 Contact 페이지의
            연락 정보와 이력서 PDF를
            관리합니다.
          </p>
        </div>

        {contact?.published && (
          <a
            href="/contact"
            target="_blank"
            rel="noreferrer"
            className={
              styles.previewLink
            }
          >
            사용자 화면 보기
          </a>
        )}
      </header>

      {errorMessage && (
        <div
          className={
            styles.errorMessage
          }
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div
          className={
            styles.successMessage
          }
        >
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={
          styles.form
        }
      >
        {/* 기본 정보 */}
        <section
          className={
            styles.panel
          }
          aria-labelledby="contact-basic-title"
        >
          <div
            className={
              styles.panelHeader
            }
          >
            <div>
              <h2
                id="contact-basic-title"
                className={
                  styles.panelTitle
                }
              >
                기본 정보
              </h2>

              <p
                className={
                  styles.panelDescription
                }
              >
                사용자 Contact 화면에
                표시할 기본 정보를
                입력합니다.
              </p>
            </div>
          </div>

          <div
            className={
              styles.field
            }
          >
            <label
              htmlFor="contact-heading"
              className={
                styles.label
              }
            >
              메인 제목
            </label>

            <input
              id="contact-heading"
              type="text"
              value={form.heading}
              onChange={(event) =>
                updateField(
                  'heading',
                  event.target.value,
                )
              }
              className={
                styles.input
              }
              maxLength={200}
              disabled={submitting}
              required
            />
          </div>

          <div
            className={
              styles.field
            }
          >
            <label
              htmlFor="contact-description"
              className={
                styles.label
              }
            >
              소개 문구
            </label>

            <textarea
              id="contact-description"
              value={
                form.description
              }
              onChange={(event) =>
                updateField(
                  'description',
                  event.target.value,
                )
              }
              className={
                styles.textarea
              }
              rows={5}
              maxLength={1000}
              disabled={submitting}
              required
            />
          </div>

          <div
            className={
              styles.fieldGrid
            }
          >
            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="contact-email"
                className={
                  styles.label
                }
              >
                이메일
              </label>

              <input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField(
                    'email',
                    event.target.value,
                  )
                }
                className={
                  styles.input
                }
                maxLength={255}
                disabled={submitting}
                required
              />
            </div>

            <div
              className={
                styles.field
              }
            >
              <label
                htmlFor="contact-resume-label"
                className={
                  styles.label
                }
              >
                이력서 버튼 문구
              </label>

              <input
                id="contact-resume-label"
                type="text"
                value={
                  form.resumeLabel
                }
                onChange={(event) =>
                  updateField(
                    'resumeLabel',
                    event.target.value,
                  )
                }
                className={
                  styles.input
                }
                maxLength={100}
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div
            className={
              styles.field
            }
          >
            <label
              htmlFor="contact-github"
              className={
                styles.label
              }
            >
              GitHub URL
            </label>

            <input
              id="contact-github"
              type="url"
              value={
                form.githubUrl
              }
              onChange={(event) =>
                updateField(
                  'githubUrl',
                  event.target.value,
                )
              }
              className={
                styles.input
              }
              placeholder="https://github.com/..."
              maxLength={500}
              disabled={submitting}
              required
            />
          </div>

          <div
            className={
              styles.field
            }
          >
            <label
              htmlFor="contact-linkedin"
              className={
                styles.label
              }
            >
              LinkedIn URL
              <span
                className={
                  styles.optional
                }
              >
                선택
              </span>
            </label>

            <input
              id="contact-linkedin"
              type="url"
              value={
                form.linkedinUrl
              }
              onChange={(event) =>
                updateField(
                  'linkedinUrl',
                  event.target.value,
                )
              }
              className={
                styles.input
              }
              placeholder="https://www.linkedin.com/in/..."
              maxLength={500}
              disabled={submitting}
            />
          </div>

          <label
            className={
              styles.checkboxRow
            }
          >
            <input
              type="checkbox"
              checked={
                form.published
              }
              onChange={(event) =>
                handlePublishedChange(
                  event.target.checked,
                )
              }
              disabled={submitting}
            />

            <span>
              사용자 Contact 페이지 공개
            </span>
          </label>
        </section>

        {/* 이력서 */}
        <section
          className={
            styles.panel
          }
          aria-labelledby="contact-resume-title"
        >
          <div
            className={
              styles.panelHeader
            }
          >
            <div>
              <h2
                id="contact-resume-title"
                className={
                  styles.panelTitle
                }
              >
                이력서 PDF
              </h2>

              <p
                className={
                  styles.panelDescription
                }
              >
                사용자 Contact 화면의
                이력서 버튼에 연결할
                PDF를 관리합니다.
              </p>
            </div>
          </div>

          {!contact ? (
            <div
              className={
                styles.resumeEmpty
              }
            >
              Contact 기본 정보를 먼저
              저장한 후 이력서를 업로드할
              수 있습니다.
            </div>
          ) : contact.resumeFileUrl ? (
            <div
              className={
                styles.resumeCurrent
              }
            >
              <div>
                <span
                  className={
                    styles.resumeStatus
                  }
                >
                  현재 등록 파일
                </span>

                <strong
                  className={
                    styles.resumeFileName
                  }
                >
                  {contact.resumeOriginalFileName ??
                    'resume.pdf'}
                </strong>
              </div>

              <div
                className={
                  styles.resumeActions
                }
              >
                <a
                  href={
                    contact.resumeFileUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className={
                    styles.resumeViewLink
                  }
                >
                  PDF 보기
                </a>

                <button
                  type="button"
                  onClick={
                    handleDeleteResume
                  }
                  className={
                    styles.deleteButton
                  }
                  disabled={
                    resumeSubmitting
                  }
                >
                  삭제
                </button>
              </div>
            </div>
          ) : (
            <div
              className={
                styles.resumeEmpty
              }
            >
              등록된 이력서 PDF가
              없습니다.
            </div>
          )}

          <div
            className={
              styles.resumeUpload
            }
          >
            <label
              htmlFor="contact-resume-file"
              className={
                styles.fileLabel
              }
            >
              {contact?.resumeFileUrl
                ? 'PDF 교체'
                : 'PDF 업로드'}
            </label>

            <input
              ref={resumeInputRef}
              id="contact-resume-file"
              type="file"
              accept="application/pdf,.pdf"
              onChange={
                handleResumeChange
              }
              className={
                styles.fileInput
              }
              disabled={
                !contact ||
                resumeSubmitting
              }
            />

            <p
              className={
                styles.fileHelp
              }
            >
              PDF 파일만 업로드할 수
              있으며 최대 크기는
              10MB입니다.
            </p>
          </div>
        </section>

        {/* 저장 */}
        <div
          className={
            styles.submitArea
          }
        >
          {contact && (
            <div
              className={
                styles.metadata
              }
            >
              <span>
                Contact ID:{' '}
                {contact.contactId}
              </span>

              <span>
                최근 수정:{' '}
                {new Date(
                  contact.updatedAt,
                ).toLocaleString()}
              </span>
            </div>
          )}

          <button
            type="submit"
            className={
              styles.submitButton
            }
            disabled={
              submitting ||
              resumeSubmitting
            }
          >
            {submitting
              ? '저장 중...'
              : contact
                ? 'Contact 수정'
                : 'Contact 저장'}
          </button>
        </div>
      </form>
    </main>
  )
}

export default AdminContactPage