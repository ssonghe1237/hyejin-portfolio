/**
 * packageName    : frontend.src.pages.admin
 * fileName       : AdminResearchUpdatePage.tsx
 * author         : Song
 * date           : 2026-08-04
 * description    : 관리자 Research 수정 페이지
 *                  - Research ID 기준 기존 상세 정보 조회
 *                  - 공통 Tiptap RichTextEditor에 기존 본문 HTML 연결
 *                  - Research 기본 정보 및 공개 상태 수정
 *                  - 수정 성공 후 관리자 Research 상세 페이지 이동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song               최초 생성
 */

import { useEffect, useState, type FormEvent } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import RichTextEditor from '../../components/admin/editor/RichTextEditor'
import { getAdminResearchDetail, updateAdminResearch } from "../../api/adminResearchApi"
import type { AdminResearchDetailResponse, AdminResearchUpdateRequest } from "../../types/research"
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

function AdminResearchUpdatePage(){
    const navigate = useNavigate()

    const { researchId } = useParams<{ researchId : string }>()

    const [form, setForm] = useState<AdminResearchFormState>(INITIAL_FORM)

    // 기존 research 정보
    const [research, setResearch] = useState<AdminResearchDetailResponse | null>(null)

    const [loading, setLoading] = useState(true)

    const [submitting, setSubmitting] = useState(false)

    const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null)

    const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null)

    // ============================================================================
    // 1) 기존 Research 상세 조회 및 폼 초기화
    // ============================================================================
    useEffect(() => {
        let cancelled = false

        async function fetchResearchDetail() {
            const parsedResearchId = Number(researchId)

            if(!Number.isInteger(parsedResearchId) || parsedResearchId <= 0) {
                setLoadErrorMessage('Research 게시글 번호가 올바르지 않습니다.')
                setLoading(false)

                return
            }
            
            try {
                setLoading(true)
                setLoadErrorMessage(null)

                const result = await getAdminResearchDetail(parsedResearchId)

                if(cancelled) {
                    return
                }

                setResearch(result)

                setForm({
                    title: result.title,
                    slug: result.slug,
                    summary: result.summary,
                    contentHtml: result.contentHtml,
                    category: result.category,
                    displayOrder: String(result.displayOrder),
                    published: result.published,
                })
            } catch(error) {
                if(cancelled) {
                    return
                }

                console.error(error)
                
                setLoadErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'Research 상세 정보를 불러오지 못했습니다.'
                )
            } finally {
                if(!cancelled) {
                    setLoading(false)
                }
            }
        }

        fetchResearchDetail()

        return () => {
            cancelled = true
        }

    }, [researchId])

    // ============================================================================
    // 2) 공통 필드 변경
    // ============================================================================
    function updateField<
        k extends keyof AdminResearchFormState
    > (
        field: k,
        value: AdminResearchFormState[k]
    ) {
        setForm((previous) => ({
            ...previous,
            [field] : value,
        }))
    }

    // ============================================================================
    // 3) 본문 실제 텍스트 존재 여부 확인
    // ============================================================================
    function hasVisibleContent(
        contentHtml : string
    ){
        if(!contentHtml.trim()) {
            return false
        }

        const document = 
            new DOMParser().parseFromString(
                contentHtml,
                'text/html'
            )

        const textContent = 
            document.body.textContent
                ?.replace(/\u00a0/g, '')
                .trim() ?? ''

        return textContent.length > 0
    }

    // ============================================================================
    // 4) 수정 폼 검증
    // ============================================================================
    function validateForm() {
        if (!form.title.trim()) {
        return 'Research 제목을 입력해 주세요.'
        }

        if (!form.slug.trim()) {
        return 'Research slug를 입력해 주세요.'
        }

        if (
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
        !Number.isInteger(displayOrder) ||
        displayOrder < 0
        ) {
        return '표시 순서는 0 이상의 정수로 입력해 주세요.'
        }

        return null
    }

    // ============================================================================
    // 5) 수정 요청
    // ============================================================================
    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        if(!research) {
            setSubmitErrorMessage('수정할 Research 정보를 찾을 수 없습니다.')

            return
        }

        const validationMessage = validateForm()

        if(validationMessage) {
            setSubmitErrorMessage(
                validationMessage
            )

            return
        }

        const request:
            AdminResearchUpdateRequest = {
                title: form.title.trim(),
                slug: form.slug.trim(),
                summary: form.summary.trim(),
                contentHtml: form.contentHtml,
                category: form.category.trim(),
                displayOrder: Number(form.displayOrder),
                published: form.published
            }

        try {
            setSubmitting(true)
            setSubmitErrorMessage(null)

            const updatedResearch =
                await updateAdminResearch(
                    research.researchId,
                    request
                )

            navigate(
                `/admin/research/${updatedResearch.researchId}`,
                {
                    replace: true
                }
            )
        } catch(error) {
            console.error(error)

            setSubmitErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'Research 게시글을 수정하지 못했습니다.'
            )
        } finally {
            setSubmitting(false)
        }
    }

    // ============================================================================
    // 6) 화면 분기
    // ============================================================================

    if (loading) {
        return (
        <div>
            수정할 Research 정보를 불러오는 중입니다...
        </div>
        )
    }

    if (
        loadErrorMessage ||
        !research
    ) {
        return (
        <div>
            <p>
            {loadErrorMessage ??
                'Research 게시글을 찾을 수 없습니다.'}
            </p>

            <Link to="/admin/research">
            관리자 Research 목록으로 돌아가기
            </Link>
        </div>
        )
    }

    return(
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                <p className={styles.eyebrow}>
                    Admin Research
                </p>

                <h1 className={styles.title}>
                    Research 수정
                </h1>

                <p className={styles.description}>
                    기존 Research 게시글의 정보와 본문을
                    수정합니다.
                </p>
                </div>

                <Link
                to={`/admin/research/${research.researchId}`}
                className={styles.backLink}
                >
                상세로 돌아가기
                </Link>
            </header>

            {submitErrorMessage && (
                <div
                className={styles.error}
                role="alert"
                >
                {submitErrorMessage}
                </div>
            )}

            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <section
                className={styles.section}
                aria-labelledby="research-update-basic-title"
                >
                <h2
                    id="research-update-basic-title"
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
                    slug를 변경하면 기존 사용자 상세 주소도
                    변경됩니다.
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
                aria-labelledby="research-update-content-title"
                >
                <h2
                    id="research-update-content-title"
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
                aria-labelledby="research-update-publication-title"
                >
                <h2
                    id="research-update-publication-title"
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

                    사용자 화면에 공개
                </label>
                </section>

                <div className={styles.actions}>
                <Link
                    to={`/admin/research/${research.researchId}`}
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
                    ? '수정 중...'
                    : 'Research 수정'}
                </button>
                </div>
            </form>
        </div>
    )
}

export default AdminResearchUpdatePage