/**
 * packageName    : frontend.src.pages.admin
 * fileName       : AdminResearchCreatePage.tsx
 * author         : Song
 * date           : 2026-08-04
 * description    : 관리자 Research 등록 페이지
 *                  - Research 기본 정보 입력
 *                  - 공통 Tiptap RichTextEditor를 통한 본문 작성
 *                  - 관리자 Research 등록 API 연동
 *                  - 등록 성공 후 관리자 Research 목록 이동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song               최초 생성
 */

import {
  useState,
  type FormEvent,
} from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'
import { createAdminResearch } from '../../api/adminResearchApi'
import RichTextEditor from '../../components/admin/editor/RichTextEditor'
import type { AdminResearchCreateRequest } from '../../types/research'
import styles from './AdminResearchCreatePage.module.css'

interface AdminResearchFormState {
  title: string
  slug: string
  summary: string
  contentHtml: string
  category: string
  displayOrder: string
  published: boolean
}

const INITIAL_FORM: AdminResearchFormState = {
  title: '',
  slug: '',
  summary: '',
  contentHtml: '',
  category: '',
  displayOrder: '0',
  published: false,
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function AdminResearchCreatePage() {
  const navigate = useNavigate()

  const [form, setForm] = useState<AdminResearchFormState>(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // setForm에 올바른 KEY:VALUE 형식으로 조립해서 넣기
  function updateField<
    K extends keyof AdminResearchFormState,
  >(
    field: K,
    value: AdminResearchFormState[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  // 사용자가 진짜 입력한 글자(Text)가 남아있는지 유효성 검사
  function hasVisibleContent(
    contentHtml: string,
  ) {
    if (!contentHtml.trim()) {
      return false
    }

    // DOMParser() : 문자열 형태로 된 HTML이나 XML 코드를 실제 자바스크립에서 다룰 수 있는 DOM 문서 객체로 변환
    const document = new DOMParser()
        // .parseFromString() : HTML 문자열(contentHtml)을 가상의 DOM 문서(document)로 변환
        .parseFromString(
        contentHtml,
        'text/html',
      )

    // DOM 객체에서 HTML 태그들을 다 제거하고 '순수 텍스트'만 추출
    const textContent = document.body.textContent
        ?.replace(/\u00a0/g, '')
        .trim() ?? ''

    return textContent.length > 0
  }

  // form 값 검증
  function validateForm() {
    if (!form.title.trim()) {
      return 'Research 제목을 입력해 주세요.'
    }

    if (!form.slug.trim()) {
      return 'Research slug를 입력해 주세요.'
    }

    if (
      // test(): 특정 문자열이 내가 정한 패턴에 맞는지 검사하여 true/ false 반환
      !SLUG_PATTERN.test(
        form.slug.trim(),
      )
    ) {
      return 'slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.'
    }

    if (!form.summary.trim()) {
      return 'Research 요약을 입력해 주세요.'
    }

    if (!form.category.trim()) {
      return 'Research 카테고리를 입력해 주세요.'
    }

    if (
      !hasVisibleContent(
        form.contentHtml,
      )
    ) {
      return 'Research 본문을 입력해 주세요.'
    }

    const displayOrder = Number(
      form.displayOrder,
    )

    if (
      // isInteger() : 정수 타입인지 검증
      !Number.isInteger(displayOrder) ||
      displayOrder < 0
    ) {
      return '표시 순서는 0 이상의 정수로 입력해 주세요.'
    }

    return null
  }

  // 
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    // preventDefault() : 새로고침 막기
    event.preventDefault()

    // form 값 검증 후 반환 받은 에러 메시지가 있다면 setErrorMessage에 추가
    const validationMessage =
      validateForm()

    if (validationMessage) {
      setErrorMessage(
        validationMessage,
      )

      return
    }

    const request:
      AdminResearchCreateRequest = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        summary: form.summary.trim(),
        contentHtml:
          form.contentHtml,
        category:
          form.category.trim(),
        displayOrder:
          Number(form.displayOrder),
        published:
          form.published,
      }

    try {
      setSubmitting(true)
      setErrorMessage(null)

      // 관리자 Research 게시글 등록
      await createAdminResearch(
        request,
      )

      // 현 페이지를 히스토리에 남기지 않고, 관리자 Research 페이지로 이동
      navigate(
        '/admin/research',
        // replace: true  = 현재 페이지를 브라우저 방문 기록에 남기지 ㅇ낳고, 새로운 페이졸 덮어쓰기 하겠다
        // 페이지 이동 후 브라우저의 [뒤로가기] 버튼 클릭 시 직전에 있던 페이지를 건너 뜀
        {
          replace: true,
        },
      )
    } catch (error) {
      console.error(error)

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Research 게시글을 등록하지 못했습니다.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            Admin Research
          </p>

          <h1 className={styles.title}>
            Research 등록
          </h1>

          <p className={styles.description}>
            기술 학습과 구현 내용을
            Research 게시글로 등록합니다.
          </p>
        </div>

        <Link
          to="/admin/research"
          className={styles.backLink}
        >
          목록으로 돌아가기
        </Link>
      </header>

      {errorMessage && (
        <div
          className={styles.error}
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <section
          className={styles.section}
          aria-labelledby="research-basic-title"
        >
          <h2
            id="research-basic-title"
            className={styles.sectionTitle}
          >
            기본 정보
          </h2>

          <div className={styles.field}>
            <label
              htmlFor="research-title"
              className={styles.label}
            >
              제목
            </label>

            <input
              id="research-title"
              type="text"
              className={styles.input}
              value={form.title}
              onChange={(event) =>
                updateField(
                  'title',
                  event.target.value,
                )
              }
              maxLength={200}
              disabled={submitting}
              required
            />
          </div>

          <div className={styles.field}>
            <label
              htmlFor="research-slug"
              className={styles.label}
            >
              Slug
            </label>

            <input
              id="research-slug"
              type="text"
              className={styles.input}
              value={form.slug}
              onChange={(event) =>
                updateField(
                  'slug',
                  event.target.value
                    .toLowerCase(),
                )
              }
              maxLength={200}
              placeholder="jpa-persistence-context"
              disabled={submitting}
              required
            />

            <p className={styles.helpText}>
              영문 소문자, 숫자,
              하이픈만 사용할 수 있습니다.
            </p>
          </div>

          <div className={styles.field}>
            <label
              htmlFor="research-summary"
              className={styles.label}
            >
              요약
            </label>

            <textarea
              id="research-summary"
              className={styles.textarea}
              value={form.summary}
              onChange={(event) =>
                updateField(
                  'summary',
                  event.target.value,
                )
              }
              rows={4}
              disabled={submitting}
              required
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label
                htmlFor="research-category"
                className={styles.label}
              >
                카테고리
              </label>

              <input
                id="research-category"
                type="text"
                className={styles.input}
                value={form.category}
                onChange={(event) =>
                  updateField(
                    'category',
                    event.target.value,
                  )
                }
                list="research-category-options"
                maxLength={100}
                disabled={submitting}
                required
              />

              <datalist id="research-category-options">
                <option value="JAVA" />
                <option value="SPRING" />
                <option value="JPA" />
                <option value="DATABASE" />
                <option value="WEB" />
                <option value="DEVOPS" />
                <option value="PROJECT" />
              </datalist>
            </div>

            <div className={styles.field}>
              <label
                htmlFor="research-display-order"
                className={styles.label}
              >
                표시 순서
              </label>

              <input
                id="research-display-order"
                type="number"
                className={styles.input}
                value={form.displayOrder}
                onChange={(event) =>
                  updateField(
                    'displayOrder',
                    event.target.value,
                  )
                }
                min={0}
                step={1}
                disabled={submitting}
                required
              />
            </div>
          </div>
        </section>

        <section
          className={styles.section}
          aria-labelledby="research-content-title"
        >
          <h2
            id="research-content-title"
            className={styles.sectionTitle}
          >
            본문
          </h2>

          <RichTextEditor
            value={form.contentHtml}
            onChange={(contentHtml) =>
              updateField(
                'contentHtml',
                contentHtml,
              )
            }
            placeholder="Research 본문을 입력하세요."
            disabled={submitting}
            ariaLabel="Research 본문 편집기"
          />
        </section>

        <section
          className={styles.section}
          aria-labelledby="research-publication-title"
        >
          <h2
            id="research-publication-title"
            className={styles.sectionTitle}
          >
            공개 설정
          </h2>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) =>
                updateField(
                  'published',
                  event.target.checked,
                )
              }
              disabled={submitting}
            />

            등록 즉시 사용자 화면에 공개
          </label>
        </section>

        <div className={styles.actions}>
          <Link
            to="/admin/research"
            className={styles.cancelButton}
          >
            취소
          </Link>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting
              ? '등록 중...'
              : 'Research 등록'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminResearchCreatePage