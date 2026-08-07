/**
 * packageName    : frontend.src.pages.admin
 * fileName       : AdminAboutPage.tsx
 * author         : Song
 * date           : 2026-08-05
 * description    : 관리자 About 콘텐츠 편집 페이지
 *                  - About 미등록 상태에서 최초 작성
 *                  - 기존 About 기본 정보 및 공개 상태 수정
 *                  - About 섹션 추가·삭제 및 순서 관리
 *                  - 공통 Tiptap RichTextEditor를 통한 섹션 본문 작성
 *                  - 관리자 About upsert API 연동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-05        Song               최초 생성
 */

import { useEffect, useState, type FormEvent } from "react"
import { Link } from 'react-router-dom'
import RichTextEditor from '../../components/admin/editor/RichTextEditor'
import styles from './AdminAboutPage.module.css'

import {
    getAdminAbout,
    upsertAdminAbout,
} from "../../api/adminAboutApi"

import type {
    AdminAboutDetailResponse,
    AdminAboutUpsertRequest,
} from "../../types/about"

interface AboutCompetencyFormState {
    clientId: string
    competencyId: number | null
    title: string
    description: string
    displayOrder: string
}

interface AboutSectionFormState {
    clientId: string
    sectionId: number | null
    title: string
    contentHtml: string
    displayOrder: string
}

interface AboutFormState {
    heading: string,
    summary: string,
    ctaLabel: string,
    ctaUrl: string,
    published: boolean,
    competencies: AboutCompetencyFormState[],
    sections: AboutSectionFormState[]
}

const MAX_COMPETENCY_COUNT = 10
const MAX_SECTION_COUNT = 20

// clientId 랜덤 생성 (고유 UUID 생성)
function createClientId() {
    return crypto.randomUUID()
}

// 폼(Form) 상태 초기화 데이터 생성
function createInitialForm(): AboutFormState {
    return {
        heading: '',
        summary: '',
        ctaLabel: 'Get in touch',
        ctaUrl: '/contact',
        published: false,
        competencies: [],
        sections: []
    }
}

// API 응답 데이터를 Form 상태로 변환
function mapResponseToForm(
  about: AdminAboutDetailResponse,
): AboutFormState {
  return {
    heading: about.heading,
    summary: about.summary,
    ctaLabel: about.ctaLabel,
    ctaUrl: about.ctaUrl,
    published: about.published,
    competencies: about.competencies.map((competency) => ({
        clientId: createClientId(),
        competencyId: competency.competencyId,
        title: competency.title,
        description: competency.description,
        displayOrder: String(competency.displayOrder)
    })),
    sections: about.sections.map((section) => ({
      clientId: createClientId(),
      sectionId: section.sectionId,
      title: section.title,
      contentHtml: section.contentHtml,
      displayOrder: String(section.displayOrder),
    })),
  }
}

// HTML 태그와 공백을 제외한 실제 텍스트 내용이 존재하는지 검증
function hasVisibleContent(
    contentHtml: string
) {
    if(!contentHtml.trim()) {
        return false
    }

    const document = new DOMParser()
        .parseFromString(
            contentHtml,
            'text/html'
        )

    const textContent =
        document.body.textContent
            ?.replace("/\u00a0/g", '')
            .trim() ?? ''

    return textContent.length > 0
}

// CTA URL 검증
function validateCtaUrl(
    ctaUrl : string
) {
    const trimmedUrl = ctaUrl.trim()

    if(trimmedUrl.startsWith('/') &&
        !trimmedUrl.startsWith('//')
    ) {
        return true
    }

    if(trimmedUrl.startsWith('#')) {
        return true
    }

    return (
        /^https?:\/\//i.test(trimmedUrl) ||
        /^mailto:/i.test(trimmedUrl) ||
        /^tel:/i.test(trimmedUrl)
    )
}

function AdminAboutPage() {
    const [form, setForm] = useState<AboutFormState>(createInitialForm)

    const [aboutId, setAboutId] = useState<number | null>(null)

    const [createdAt, setCreatedAt] = useState<string | null>(null)

    const [updatedAt, setUpdatedAt] = useState<string | null>(null)

    const [loading, setLoading] = useState(false)

    const [submitting, setSubmitting] = useState(false)

    const [loadErrorMessage, setLoadErrorMessage] = useState<string | null>(null)

    const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null)

    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    // ============================================================================
    // 1) 관리자 About 조회
    // ============================================================================
    useEffect(() => {
        let cancelled = false

        async function fetchAbout() {
            try {
                setLoading(true)
                setLoadErrorMessage(null)

                const result = await getAdminAbout()

                if(cancelled) {
                    return
                }

                if(result === null) {
                    setAboutId(null)
                    setCreatedAt(null)
                    setUpdatedAt(null)
                    setForm(createInitialForm())

                    return
                }

                setAboutId(result.aboutId)
                setCreatedAt(result.createdAt)
                setUpdatedAt(result.updatedAt)
                setForm(
                    mapResponseToForm(result)
                )
            } catch(error) {
                if(cancelled) {
                    return
                }

                console.error(error)

                setLoadErrorMessage(
                    error instanceof Error
                        ? error.message
                        : '관리자 About 정보를 불러오지 못했습니다.'
                )
            } finally {
                if(!cancelled) {
                    setLoading(false)
                }
            }
        }

        fetchAbout()

        return () => {
            cancelled = true
        }
    },[])

    // ============================================================================
    // 2) About 기본 필드 변경
    // ============================================================================
    function updateField<
        k extends keyof AboutFormState
    >(
        field: k,
        value: AboutFormState[k]
    ){
        setForm((previous) => ({
            ...previous,
            [field] : value
        }))
    }

    // ============================================================================
    // 3-1) About 핵심 역량 필드 변경
    // ============================================================================
    function updateCompetencyField(
        clientId: string,
        field:
            | 'title'
            | 'description'
            | 'displayOrder',
        value: string
    ){
        setForm((previous) => ({
            ...previous,
            competencies: previous.competencies.map((competency) => 
                competency.clientId === clientId
                ? {
                    ...competency,
                    [field]: value
                  }
                : competency
            )
        }))

        setSubmitErrorMessage(null)
        setSuccessMessage(null)
    }

    // ============================================================================
    // 3-1) About 핵심 역량 필드 추가
    // ============================================================================
    function handleAddCompetency() {
        if(form.competencies.length >= MAX_COMPETENCY_COUNT) {
            setSubmitErrorMessage(
                `핵심 역량은 최대 ${MAX_COMPETENCY_COUNT}개까지 추가할 수 있습니다.`
            )

            return
        }

        const validOrders =
            form.competencies
                .map((competency) => 
                    Number(competency.displayOrder)
                )
                .filter((displayOrder) => 
                    Number.isInteger(displayOrder)
                )

        const nextDisplayOrder = 
                validOrders.length === 0
                    ? 1
                    : Math.max(...validOrders) + 1

        setForm((previous) => ({
            ...previous,
            competencies: [
            ...previous.competencies,
            {
                clientId: createClientId(),
                competencyId: null,
                title: '',
                description: '',
                displayOrder:
                String(nextDisplayOrder),
            },
            ],
        }))

        setSubmitErrorMessage(null)
        setSuccessMessage(null)
    }


    // ============================================================================
    // 3-1) About 핵심 역량 삭제
    // ============================================================================
    function handleRemoveCompetency(
        competency: AboutCompetencyFormState,
    ) {
        const confirmed =
            window.confirm(
            `${competency.title || '이 핵심 역량'}을 제거하시겠습니까?\n저장하기 전까지 DB에는 반영되지 않습니다.`,
            )

        if (!confirmed) {
            return
        }

        setForm((previous) => ({
            ...previous,
            competencies:
            previous.competencies.filter(
                (previousCompetency) =>
                previousCompetency.clientId !==
                competency.clientId,
            ),
        }))

        setSubmitErrorMessage(null)
        setSuccessMessage(null)
    }

    // ============================================================================
    // 3-2) About 섹션 필드 변경
    // ============================================================================
    function updateSectionField(
        clientId: string,
        field: 
            | 'title'
            | 'contentHtml'
            | 'displayOrder',
        value: string
    ){
        setForm((previous) => ({
            ...previous,
            sections: previous.sections.map(
                (section) =>
                    section.clientId === clientId
                    ? {
                        ...section,
                        [field]: value
                    }
                    : section
            )
        }))

        setSubmitErrorMessage(null)
        setSuccessMessage(null)
    }

    // ============================================================================
    // 4) About 신규 섹션 추가
    // ============================================================================
    function handleAddSection() {
        if(form.sections.length >= MAX_SECTION_COUNT) {
            setSubmitErrorMessage(
                `About 섹션은 최대 ${MAX_SECTION_COUNT}개까지 추가할 수 있습니다.`
            )

            return
        }

        // section.displayOrder 검증
        const validOrders =
            form.sections
                .map((section) => Number(section.displayOrder))
                .filter((displayOrder) => Number.isInteger(displayOrder) && displayOrder >= 0)

        const nextDisplayOrder =
            validOrders.length === 0
                ? 1
                : Math.max(...validOrders) + 1

        // AboutSectionFormState 상태 초기화 데이터 생성
        const newSection: AboutSectionFormState = {
            clientId: createClientId(),
            sectionId: null,
            title: '',
            contentHtml: '',
            displayOrder: String(nextDisplayOrder)
        }

        setForm((previous) => ({
            ...previous,
            sections: [
                ...previous.sections,
                newSection
            ]
        }))

        setSubmitErrorMessage(null)
        setSuccessMessage(null)
    }

    // ============================================================================
    // 5) About 섹션 제거
    // ============================================================================
    function handleRemoveSection(
        section: AboutSectionFormState
    ) {
        const confirmed = window.confirm(
            `${section.title || '이 섹션'}을 제거하시겠습니까?\n저장하기 전까지 DB에는 반영되지 않습니다.`
        )

        if(!confirmed) {
            return
        }

        setForm((previous) => ({
            ...previous,
            sections: previous.sections.filter(
                (previousSection) => 
                    previousSection.clientId !== section.clientId
            )
        }))

        setSubmitErrorMessage(null)
        setSuccessMessage(null)
    }

    // ============================================================================
    // 6) 폼 검증
    // ============================================================================
    function validateForm() {
        if (!form.heading.trim()) {
            return 'About 메인 제목을 입력해 주세요.'
        }

        if (!form.summary.trim()) {
            return 'About 소개 요약을 입력해 주세요.'
        }

        if (!form.ctaLabel.trim()) {
            return 'About CTA 문구를 입력해 주세요.'
        }

        if (!form.ctaUrl.trim()) {
            return 'About CTA 주소를 입력해 주세요.'
        }

        if (!validateCtaUrl(form.ctaUrl,)) {
            return 'CTA 주소는 내부 경로, 앵커, http, https, mailto 또는 tel 형식을 사용해야 합니다.'
        }

        if (form.sections.length > MAX_SECTION_COUNT) {
            return `About 섹션은 최대 ${MAX_SECTION_COUNT}개까지 등록할 수 있습니다.`
        }

        for (
            let index = 0;
            index < form.sections.length;
            index++
        ) {
            const section = form.sections[index]

            if (!section.title.trim()) {
                return `About ${index + 1}번 섹션 제목을 입력해 주세요.`
            }

            if (!hasVisibleContent(section.contentHtml,)) {
                return `About ${index + 1}번 섹션 본문을 입력해 주세요.`
            }

            const displayOrder = Number(section.displayOrder)

            if (!Number.isInteger(displayOrder) || displayOrder < 0) {
                return `About ${index + 1}번 섹션 표시 순서는 0 이상의 정수여야 합니다.`
            }
        }

        if(form.sections.length > MAX_COMPETENCY_COUNT) {
            return `핵심 역량은 최대 ${MAX_COMPETENCY_COUNT}개까지 등록할 수 있습니다.`
        }

        for(let index = 0; index < form.competencies.length; index++) {
            const competency = form.competencies[index]

            if(!competency.title.trim()) {
                return `핵심 역량 ${index+1}번 제목을 입력해 주세요.`
            }

            if(!competency.description.trim()) {
                return `핵심 역량 ${index+1}번 설명을 입력해 주세요.`
            }

            const displayOrder = Number(competency.displayOrder)

            if(!Number.isInteger(displayOrder) || displayOrder < 0) {
                return `핵심 역량 ${index+1}번 표시 순서는 0 이상의 정수여야 합니다.`
            }
        }

        return null
    }

    // ============================================================================
    // 7) About 저장
    // ============================================================================
    
    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        // 폼 검증
        const validationMessage = validateForm()

        if(validationMessage) {
            setSubmitErrorMessage(
                validationMessage
            )
            setSuccessMessage(null)
        
            return
        }

        const request: AdminAboutUpsertRequest = {
            heading: form.heading.trim(),
            summary: form.summary.trim(),
            ctaLabel: form.ctaLabel.trim(),
            ctaUrl: form.ctaUrl.trim(),
            published: form.published,
            competencies: form.competencies.map(
                (competency) => ({
                    title: competency.title.trim(),
                    description: competency.description.trim(),
                    displayOrder: Number(competency.displayOrder)
            })),
            sections: form.sections.map(
                (section) => ({
                    title: section.title.trim(),
                    contentHtml: section.contentHtml,
                    displayOrder: Number(section.displayOrder)
                })
            )
        }

        try {
            setSubmitting(true)
            setSubmitErrorMessage(null)
            setSuccessMessage(null)

            const savedAbout = await upsertAdminAbout(request)

            // 서버가 Sanitizer를 적용한 HTML과 새 sectionId를 반환하므로,
            // 저장 성공 후 서버 응답 기준으로 폼을 다시 초기화
            setAboutId(savedAbout.aboutId)
            setCreatedAt(savedAbout.createdAt)
            setUpdatedAt(savedAbout.updatedAt)
            setForm(
                mapResponseToForm(savedAbout)
            )

            setSuccessMessage(
                'About 콘텐츠가 저장되었습니다.'
            )

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        } catch(error) {
            console.error(error)

            setSubmitErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'About 콘텐츠를 저장하지 못했습니다.'
            )
        } finally {
            setSubmitting(false)
        } 
    }

    // ============================================================================
    // 8) 화면 분기
    // ============================================================================

    if (loading) {
        return (
        <div className={styles.status}>
            관리자 About 정보를 불러오는 중입니다...
        </div>
        )
    }

    if (loadErrorMessage) {
        return (
        <div
            className={styles.error}
            role="alert"
        >
            {loadErrorMessage}
        </div>
        )
    }

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>
                        Admin About
                    </p>

                    <h1 className={styles.title}>
                        About 콘텐츠 관리
                    </h1>

                    <p className={styles.description}>
                        About 기본 정보와 사용자 화면에 표시할
                        섹션을 관리합니다.
                    </p>
                </div>

                {form.published && aboutId && (
                    <Link
                        to="/about"
                        className={styles.previewLink}
                        target="_blank"
                        rel="noreferrer"
                    >
                        사용자 화면 보기
                    </Link>
                )}
            </header>

            {aboutId === null && (
                <div className={styles.initialNotice}>
                아직 저장된 About 콘텐츠가 없습니다.
                아래 폼에서 최초 콘텐츠를 작성해 주세요.
                </div>
            )}

            {successMessage && (
                <div
                className={styles.success}
                role="status"
                >
                {successMessage}
                </div>
            )}

            {submitErrorMessage && (
                <div
                className={styles.error}
                role="alert"
                >
                {submitErrorMessage}
                </div>
            )}

            {aboutId && (
                <div className={styles.metadata}>
                    <span>
                        About ID: {aboutId}
                    </span>

                    {createdAt && (
                        <span>
                        생성일 {createdAt.slice(0, 19)}
                        </span>
                    )}

                    {updatedAt && (
                        <span>
                        수정일 {updatedAt.slice(0, 19)}
                        </span>
                    )}
                </div>
            )}

            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <section
                    className={styles.panel}
                    aria-labelledby="about-basic-title"
                >
                    <h2
                        id="about-basic-title"
                        className={styles.panelTitle}
                    >
                        기본 정보
                    </h2>

                    <div className={styles.field}>
                        <label
                            htmlFor="about-heading"
                            className={styles.label}
                        >
                            메인 제목
                        </label>

                        <input
                            id="about-heading"
                            type="text"
                            className={styles.input}
                            value={form.heading}
                            onChange={(event) =>
                                updateField(
                                    'heading',
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
                            htmlFor="about-summary"
                            className={styles.label}
                        >
                            소개 요약
                        </label>

                        <textarea
                            id="about-summary"
                            className={styles.textarea}
                            value={form.summary}
                            onChange={(event) =>
                                updateField(
                                'summary',
                                event.target.value,
                                )
                            }
                            maxLength={1000}
                            rows={5}
                            disabled={submitting}
                            required
                        />
                    </div>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label
                                htmlFor="about-cta-label"
                                className={styles.label}
                            >
                                CTA 문구
                            </label>

                            <input
                                id="about-cta-label"
                                type="text"
                                className={styles.input}
                                value={form.ctaLabel}
                                onChange={(event) =>
                                updateField(
                                    'ctaLabel',
                                    event.target.value,
                                )
                                }
                                maxLength={100}
                                disabled={submitting}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label
                                htmlFor="about-cta-url"
                                className={styles.label}
                            >
                                CTA 주소
                            </label>

                            <input
                                id="about-cta-url"
                                type="text"
                                className={styles.input}
                                value={form.ctaUrl}
                                onChange={(event) =>
                                updateField(
                                    'ctaUrl',
                                    event.target.value,
                                )
                                }
                                maxLength={500}
                                placeholder="/contact"
                                disabled={submitting}
                                required
                            />

                            <p className={styles.helpText}>
                                내부 경로는 `/contact`, 외부 주소는
                                `https://` 형식으로 입력합니다.
                            </p>
                        </div>
                    </div>

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

                        사용자 About 페이지에 공개
                    </label>
                </section>

                <section
                    className={styles.sectionsArea}
                    aria-labelledby="about-competencies-title"
                >
                <div className={styles.sectionsHeader}>
                    <div>
                    <h2
                        id="about-competencies-title"
                        className={styles.panelTitle}
                    >
                        핵심 역량
                    </h2>

                    <p className={styles.sectionDescription}>
                        Home과 About 페이지에 공통으로 표시할
                        핵심 역량을 관리합니다.
                    </p>
                    </div>

                    <button
                    type="button"
                    className={styles.addButton}
                    onClick={handleAddCompetency}
                    disabled={
                        submitting ||
                        form.competencies.length >=
                        MAX_COMPETENCY_COUNT
                    }
                    >
                    + 핵심 역량 추가
                    </button>
                </div>

                {form.competencies.length === 0 ? (
                    <div className={styles.empty}>
                    등록된 핵심 역량이 없습니다.
                    </div>
                ) : (
                    <div className={styles.sectionList}>
                    {form.competencies.map(
                        (competency, index) => (
                        <article
                            key={competency.clientId}
                            className={styles.sectionCard}
                        >
                            <header
                            className={styles.sectionCardHeader}
                            >
                            <div>
                                <p className={styles.sectionNumber}>
                                Competency {index + 1}
                                </p>

                                <h3
                                className={styles.sectionCardTitle}
                                >
                                {competency.title ||
                                    '새 핵심 역량'}
                                </h3>

                                {competency.competencyId && (
                                <p className={styles.sectionId}>
                                    Competency ID:{' '}
                                    {competency.competencyId}
                                </p>
                                )}
                            </div>

                            <button
                                type="button"
                                className={styles.removeButton}
                                onClick={() =>
                                handleRemoveCompetency(
                                    competency,
                                )
                                }
                                disabled={submitting}
                            >
                                핵심 역량 제거
                            </button>
                            </header>

                            <div className={styles.fieldRow}>
                            <div className={styles.field}>
                                <label
                                htmlFor={`competency-title-${competency.clientId}`}
                                className={styles.label}
                                >
                                역량 제목
                                </label>

                                <input
                                id={`competency-title-${competency.clientId}`}
                                type="text"
                                className={styles.input}
                                value={competency.title}
                                onChange={(event) =>
                                    updateCompetencyField(
                                    competency.clientId,
                                    'title',
                                    event.target.value,
                                    )
                                }
                                maxLength={150}
                                disabled={submitting}
                                required
                                />
                            </div>

                            <div className={styles.orderField}>
                                <label
                                htmlFor={`competency-order-${competency.clientId}`}
                                className={styles.label}
                                >
                                표시 순서
                                </label>

                                <input
                                id={`competency-order-${competency.clientId}`}
                                type="number"
                                className={styles.input}
                                value={
                                    competency.displayOrder
                                }
                                onChange={(event) =>
                                    updateCompetencyField(
                                    competency.clientId,
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

                            <div className={styles.field}>
                            <label
                                htmlFor={`competency-description-${competency.clientId}`}
                                className={styles.label}
                            >
                                역량 설명
                            </label>

                            <textarea
                                id={`competency-description-${competency.clientId}`}
                                className={styles.textarea}
                                value={
                                competency.description
                                }
                                onChange={(event) =>
                                updateCompetencyField(
                                    competency.clientId,
                                    'description',
                                    event.target.value,
                                )
                                }
                                maxLength={1000}
                                rows={4}
                                disabled={submitting}
                                required
                            />
                            </div>
                        </article>
                        ),
                    )}
                    </div>
                )}
                </section>

                <section
                className={styles.sectionsArea}
                aria-labelledby="about-sections-title"
                >
                    <div className={styles.sectionsHeader}>
                        <div>
                            <h2
                                id="about-sections-title"
                                className={styles.panelTitle}
                            >
                                About 섹션
                            </h2>

                            <p className={styles.sectionDescription}>
                                Career, Skills, How I Work 등 사용자
                                화면에 출력할 콘텐츠 블록을 추가합니다.
                            </p>
                        </div>

                        <button
                        type="button"
                        className={styles.addButton}
                        onClick={handleAddSection}
                        disabled={
                            submitting ||
                            form.sections.length >=
                            MAX_SECTION_COUNT
                        }
                        >
                        + 섹션 추가
                        </button>
                    </div>

                    {form.sections.length === 0 ? (
                        <div className={styles.empty}>
                        등록된 About 섹션이 없습니다.
                        섹션 추가 버튼을 눌러 작성해 주세요.
                        </div>
                    ) : (
                        <div className={styles.sectionList}>
                        {form.sections.map(
                            (section, index) => (
                            <section
                                key={section.clientId}
                                className={styles.sectionCard}
                                aria-labelledby={`about-section-${section.clientId}`}
                            >
                                <header
                                className={styles.sectionCardHeader}
                                >
                                    <div>
                                        <p className={styles.sectionNumber}>
                                        Section {index + 1}
                                        </p>

                                        <h3
                                        id={`about-section-${section.clientId}`}
                                        className={styles.sectionCardTitle}
                                        >
                                        {section.title ||
                                            '새 About 섹션'}
                                        </h3>

                                        {section.sectionId && (
                                        <p className={styles.sectionId}>
                                            Section ID:{' '}
                                            {section.sectionId}
                                        </p>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        className={styles.removeButton}
                                        onClick={() =>
                                        handleRemoveSection(
                                            section,
                                        )
                                        }
                                        disabled={submitting}
                                    >
                                        섹션 제거
                                    </button>
                                </header>

                                <div className={styles.fieldRow}>
                                    <div className={styles.field}>
                                        <label
                                        htmlFor={`about-section-title-${section.clientId}`}
                                        className={styles.label}
                                        >
                                        섹션 제목
                                        </label>

                                        <input
                                        id={`about-section-title-${section.clientId}`}
                                        type="text"
                                        className={styles.input}
                                        value={section.title}
                                        onChange={(event) =>
                                            updateSectionField(
                                            section.clientId,
                                            'title',
                                            event.target.value,
                                            )
                                        }
                                        maxLength={150}
                                        disabled={submitting}
                                        required
                                        />
                                    </div>

                                    <div className={styles.orderField}>
                                        <label
                                        htmlFor={`about-section-order-${section.clientId}`}
                                        className={styles.label}
                                        >
                                        표시 순서
                                        </label>

                                        <input
                                        id={`about-section-order-${section.clientId}`}
                                        type="number"
                                        className={styles.input}
                                        value={
                                            section.displayOrder
                                        }
                                        onChange={(event) =>
                                            updateSectionField(
                                            section.clientId,
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

                                <div className={styles.editorField}>
                                    <span className={styles.label}>
                                        섹션 본문
                                    </span>

                                    <RichTextEditor
                                        value={section.contentHtml}
                                        onChange={(contentHtml) =>
                                        updateSectionField(
                                            section.clientId,
                                            'contentHtml',
                                            contentHtml,
                                        )
                                        }
                                        placeholder={`${section.title || 'About 섹션'} 본문을 입력하세요.`}
                                        disabled={submitting}
                                        ariaLabel={`${section.title || `About ${index + 1}번 섹션`} 본문 편집기`}
                                    />
                                </div>
                            </section>
                            ),
                        )}
                        </div>
                    )}
                </section>

                <div className={styles.actions}>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={submitting}
                    >
                        {submitting
                        ? '저장 중...'
                        : aboutId
                            ? 'About 수정 저장'
                            : 'About 최초 저장'}
                    </button>
                </div>
            </form>
        </main>
    )






}

export default AdminAboutPage