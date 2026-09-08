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
 *                  - 프로필·학력·수상·근무 이력·역량·기술 정보 편집
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-05        Song               최초 생성
 * 2026-08-24        Song               About 프로필·이력·기술 관리자 편집 기능 확장
 */

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { Link } from 'react-router-dom'
import RichTextEditor from '../../components/admin/editor/RichTextEditor'
import styles from './AdminAboutPage.module.css'

import {
    getAdminAbout,
    uploadAboutSkillLogo,
    uploadAdminAboutProfileImage,
    upsertAdminAbout,
} from "../../api/adminAboutApi"

import type {
    AdminAboutDetailResponse,
    AdminAboutUpsertRequest,
    AboutSectionType,
    AboutEducationType,
    AboutEmploymentType,
} from "../../types/about"

interface EducationFormState { clientId: string; educationId: number | null; educationType: AboutEducationType; institutionName: string; courseName: string; startDate: string; endDate: string; status: string; description: string; displayOrder: string }
interface AwardFormState { clientId: string; awardId: number | null; title: string; issuer: string; awardedDate: string; description: string; displayOrder: string }
interface WorkExperienceFormState { clientId: string; experienceId: number | null; companyName: string; positionTitle: string; employmentType: AboutEmploymentType; startDate: string; endDate: string; descriptionHtml: string; displayOrder: string }
interface SkillFormState { clientId: string; skillId: number | null; name: string; logoUrl: string; description: string; displayOrder: string }
interface SkillCategoryFormState { clientId: string; skillCategoryId: number | null; title: string; description: string; displayOrder: string; skills: SkillFormState[] }

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
    sectionType: AboutSectionType
    displayOrder: string
}

interface AboutFormState {
    heading: string,
    summary: string,
    nameKo: string,
    nameEn: string,
    profileImageUrl: string,
    birthDate: string,
    position: string,
    background: string,
    currentFocus: string,
    location: string,
    interests: string,
    ctaLabel: string,
    ctaUrl: string,
    published: boolean,
    competencies: AboutCompetencyFormState[],
    sections: AboutSectionFormState[],
    educations: EducationFormState[],
    awards: AwardFormState[],
    workExperiences: WorkExperienceFormState[],
    skillCategories: SkillCategoryFormState[]
}

const MAX_COMPETENCY_COUNT = 10
const MAX_SECTION_COUNT = 20
const MAX_EDUCATION_COUNT = 20
const MAX_AWARD_COUNT = 30
const MAX_WORK_EXPERIENCE_COUNT = 30
const MAX_SKILL_CATEGORY_COUNT = 10
const MAX_SKILL_COUNT = 30

// clientId 랜덤 생성 (고유 UUID 생성)
function createClientId() {
    return crypto.randomUUID()
}

// 폼(Form) 상태 초기화 데이터 생성
function createInitialForm(): AboutFormState {
    return {
        heading: '',
        summary: '',
        nameKo: '', nameEn: '', profileImageUrl: '', birthDate: '', position: '',
        background: '', currentFocus: '', location: '', interests: '',
        ctaLabel: 'Get in touch',
        ctaUrl: '/contact',
        published: false,
        competencies: [],
        sections: [], educations: [], awards: [], workExperiences: [], skillCategories: []
    }
}

// API 응답 데이터를 Form 상태로 변환
function mapResponseToForm(
  about: AdminAboutDetailResponse,
): AboutFormState {
  return {
    heading: about.heading,
    summary: about.summary,
    nameKo: about.nameKo ?? '', nameEn: about.nameEn ?? '', profileImageUrl: about.profileImageUrl ?? '',
    birthDate: about.birthDate ?? '', position: about.position ?? '', background: about.background ?? '',
    currentFocus: about.currentFocus ?? '', location: about.location ?? '', interests: about.interests ?? '',
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
      sectionType: section.sectionType ?? 'STORY',
      displayOrder: String(section.displayOrder),
    })),
    educations: about.educations.map((item) => ({ clientId: createClientId(), educationId: item.educationId, educationType: item.educationType, institutionName: item.institutionName, courseName: item.courseName, startDate: item.startDate, endDate: item.endDate ?? '', status: item.status ?? '', description: item.description ?? '', displayOrder: String(item.displayOrder) })),
    awards: about.awards.map((item) => ({ clientId: createClientId(), awardId: item.awardId, title: item.title, issuer: item.issuer, awardedDate: item.awardedDate, description: item.description ?? '', displayOrder: String(item.displayOrder) })),
    workExperiences: about.workExperiences.map((item) => ({ clientId: createClientId(), experienceId: item.experienceId, companyName: item.companyName, positionTitle: item.positionTitle, employmentType: item.employmentType, startDate: item.startDate, endDate: item.endDate ?? '', descriptionHtml: item.descriptionHtml, displayOrder: String(item.displayOrder) })),
    skillCategories: about.skillCategories.map((category) => ({
      clientId: createClientId(), skillCategoryId: category.skillCategoryId,
      title: category.title, description: category.description ?? '', displayOrder: String(category.displayOrder),
      skills: category.skills.map((skill) => ({ clientId: createClientId(), skillId: skill.skillId, name: skill.name, logoUrl: skill.logoUrl ?? '', description: skill.description ?? '', displayOrder: String(skill.displayOrder) })),
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

    const [profileImageUploading, setProfileImageUploading] = useState(false)
    const [profileImageUploadError, setProfileImageUploadError] = useState<string | null>(null)
    const [profileImagePreviewError, setProfileImagePreviewError] = useState(false)
    const [uploadingSkillLogos, setUploadingSkillLogos] = useState<Record<string, boolean>>({})
    const [skillLogoErrors, setSkillLogoErrors] = useState<Record<string, string>>({})
    const [skillLogoPreviewErrors, setSkillLogoPreviewErrors] = useState<Record<string, boolean>>({})

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

    async function handleProfileImageChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        event.target.value = ''
        if (!file) return

        try {
            setProfileImageUploading(true)
            setProfileImageUploadError(null)
            setProfileImagePreviewError(false)
            const uploaded = await uploadAdminAboutProfileImage(file)
            updateField('profileImageUrl', uploaded.imageUrl)
        } catch (error) {
            setProfileImageUploadError(error instanceof Error ? error.message : '프로필 이미지를 업로드하지 못했습니다.')
        } finally {
            setProfileImageUploading(false)
        }
    }

    function handleRemoveProfileImage() {
        updateField('profileImageUrl', '')
        setProfileImagePreviewError(false)
        setProfileImageUploadError(null)
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
            | 'sectionType'
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
            sectionType: 'STORY',
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

    function nextOrder(items: Array<{ displayOrder: string }>) {
        const orders = items.map((item) => Number(item.displayOrder)).filter((value) => Number.isInteger(value) && value >= 0)
        return String(orders.length ? Math.max(...orders) + 1 : 1)
    }

    function updateEducation(clientId: string, field: keyof EducationFormState, value: string) {
        setForm((previous) => ({ ...previous, educations: previous.educations.map((item) => item.clientId === clientId ? { ...item, [field]: value } : item) }))
    }
    function updateAward(clientId: string, field: keyof AwardFormState, value: string) {
        setForm((previous) => ({ ...previous, awards: previous.awards.map((item) => item.clientId === clientId ? { ...item, [field]: value } : item) }))
    }
    function updateWorkExperience(clientId: string, field: keyof WorkExperienceFormState, value: string) {
        setForm((previous) => ({ ...previous, workExperiences: previous.workExperiences.map((item) => item.clientId === clientId ? { ...item, [field]: value } : item) }))
    }

    function addEducation() {
        if (form.educations.length >= MAX_EDUCATION_COUNT) return
        const item: EducationFormState = { clientId: createClientId(), educationId: null, educationType: 'SCHOOL', institutionName: '', courseName: '', startDate: '', endDate: '', status: '', description: '', displayOrder: nextOrder(form.educations) }
        setForm((previous) => ({ ...previous, educations: [...previous.educations, item] }))
    }
    function addAward() {
        if (form.awards.length >= MAX_AWARD_COUNT) return
        const item: AwardFormState = { clientId: createClientId(), awardId: null, title: '', issuer: '', awardedDate: '', description: '', displayOrder: nextOrder(form.awards) }
        setForm((previous) => ({ ...previous, awards: [...previous.awards, item] }))
    }
    function addWorkExperience() {
        if (form.workExperiences.length >= MAX_WORK_EXPERIENCE_COUNT) return
        const item: WorkExperienceFormState = { clientId: createClientId(), experienceId: null, companyName: '', positionTitle: '', employmentType: 'FULL_TIME', startDate: '', endDate: '', descriptionHtml: '', displayOrder: nextOrder(form.workExperiences) }
        setForm((previous) => ({ ...previous, workExperiences: [...previous.workExperiences, item] }))
    }

    function removeChild(collection: 'educations' | 'awards' | 'workExperiences', clientId: string) {
        if (!window.confirm('이 항목을 제거하시겠습니까? 저장 전까지 DB에는 반영되지 않습니다.')) return
        setForm((previous) => ({ ...previous, [collection]: previous[collection].filter((item) => item.clientId !== clientId) }))
    }

    function addSkillCategory() {
        if (form.skillCategories.length >= MAX_SKILL_CATEGORY_COUNT) return
        const category: SkillCategoryFormState = { clientId: createClientId(), skillCategoryId: null, title: '', description: '', displayOrder: nextOrder(form.skillCategories), skills: [] }
        setForm((previous) => ({ ...previous, skillCategories: [...previous.skillCategories, category] }))
    }
    function removeSkillCategory(clientId: string) {
        if (!window.confirm('이 기술 카테고리를 제거하시겠습니까? 저장 전까지 DB에는 반영되지 않습니다.')) return
        setForm((previous) => ({ ...previous, skillCategories: previous.skillCategories.filter((item) => item.clientId !== clientId) }))
    }
    function updateSkillCategory(clientId: string, field: 'title' | 'description' | 'displayOrder', value: string) {
        setForm((previous) => ({ ...previous, skillCategories: previous.skillCategories.map((item) => item.clientId === clientId ? { ...item, [field]: value } : item) }))
    }
    function addSkill(categoryClientId: string) {
        setForm((previous) => ({ ...previous, skillCategories: previous.skillCategories.map((category) => {
            if (category.clientId !== categoryClientId || category.skills.length >= MAX_SKILL_COUNT) return category
            const skill: SkillFormState = { clientId: createClientId(), skillId: null, name: '', logoUrl: '', description: '', displayOrder: nextOrder(category.skills) }
            return { ...category, skills: [...category.skills, skill] }
        }) }))
    }
    function updateSkill(categoryClientId: string, skillClientId: string, field: 'name' | 'logoUrl' | 'description' | 'displayOrder', value: string) {
        setForm((previous) => ({ ...previous, skillCategories: previous.skillCategories.map((category) => category.clientId === categoryClientId
            ? { ...category, skills: category.skills.map((skill) => skill.clientId === skillClientId ? { ...skill, [field]: value } : skill) }
            : category) }))
    }
    function removeSkill(categoryClientId: string, skillClientId: string) {
        if (!window.confirm('이 기술을 제거하시겠습니까? 저장 전까지 DB에는 반영되지 않습니다.')) return
        setForm((previous) => ({ ...previous, skillCategories: previous.skillCategories.map((category) => category.clientId === categoryClientId
            ? { ...category, skills: category.skills.filter((skill) => skill.clientId !== skillClientId) }
            : category) }))
    }
    async function handleSkillLogoChange(categoryClientId: string, skillClientId: string, event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        event.target.value = ''
        if (!file) return
        setUploadingSkillLogos((state) => ({ ...state, [skillClientId]: true }))
        setSkillLogoErrors((state) => ({ ...state, [skillClientId]: '' }))
        setSkillLogoPreviewErrors((state) => ({ ...state, [skillClientId]: false }))
        try {
            const uploaded = await uploadAboutSkillLogo(file)
            updateSkill(categoryClientId, skillClientId, 'logoUrl', uploaded.imageUrl)
        } catch (error) {
            setSkillLogoErrors((state) => ({ ...state, [skillClientId]: error instanceof Error ? error.message : '기술 로고를 업로드하지 못했습니다.' }))
        } finally {
            setUploadingSkillLogos((state) => ({ ...state, [skillClientId]: false }))
        }
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

        const technicalStackCount = form.sections.filter(
            (section) => section.sectionType === 'TECHNICAL_STACK',
        ).length
        const troubleshootingCount = form.sections.filter(
            (section) => section.sectionType === 'TROUBLESHOOTING',
        ).length

        if (technicalStackCount > 1 || troubleshootingCount > 1) {
            return 'Technical Stack과 Troubleshooting 섹션은 각각 하나만 등록할 수 있습니다.'
        }

        if (form.educations.length > MAX_EDUCATION_COUNT || form.awards.length > MAX_AWARD_COUNT || form.workExperiences.length > MAX_WORK_EXPERIENCE_COUNT) return '이력 항목 최대 개수를 확인해 주세요.'
        for (const [index, item] of form.educations.entries()) {
            if (!item.institutionName.trim() || !item.courseName.trim() || !item.startDate) return `교육 이력 ${index + 1}번 필수 정보를 입력해 주세요.`
            if (!Number.isInteger(Number(item.displayOrder)) || Number(item.displayOrder) < 0) return `교육 이력 ${index + 1}번 표시 순서를 확인해 주세요.`
        }
        for (const [index, item] of form.awards.entries()) {
            if (!item.title.trim() || !item.issuer.trim() || !item.awardedDate) return `수상 이력 ${index + 1}번 필수 정보를 입력해 주세요.`
            if (!Number.isInteger(Number(item.displayOrder)) || Number(item.displayOrder) < 0) return `수상 이력 ${index + 1}번 표시 순서를 확인해 주세요.`
        }
        for (const [index, item] of form.workExperiences.entries()) {
            if (!item.companyName.trim() || !item.positionTitle.trim() || !item.startDate || !hasVisibleContent(item.descriptionHtml)) return `근무 이력 ${index + 1}번 필수 정보와 상세 업무를 입력해 주세요.`
            if (!Number.isInteger(Number(item.displayOrder)) || Number(item.displayOrder) < 0) return `근무 이력 ${index + 1}번 표시 순서를 확인해 주세요.`
        }

        if(form.competencies.length > MAX_COMPETENCY_COUNT) {
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

        if (form.skillCategories.length > MAX_SKILL_CATEGORY_COUNT) return `기술 카테고리는 최대 ${MAX_SKILL_CATEGORY_COUNT}개까지 등록할 수 있습니다.`
        const categoryNames = new Set<string>()
        for (const [categoryIndex, category] of form.skillCategories.entries()) {
            const categoryName = category.title.trim().toLowerCase()
            if (!categoryName) return `기술 카테고리 ${categoryIndex + 1}번 제목을 입력해 주세요.`
            if (categoryNames.has(categoryName)) return '기술 카테고리 제목은 중복될 수 없습니다.'
            categoryNames.add(categoryName)
            if (!Number.isInteger(Number(category.displayOrder)) || Number(category.displayOrder) < 0) return `기술 카테고리 ${categoryIndex + 1}번 표시 순서를 확인해 주세요.`
            if (category.skills.length > MAX_SKILL_COUNT) return `카테고리별 기술은 최대 ${MAX_SKILL_COUNT}개까지 등록할 수 있습니다.`
            const skillNames = new Set<string>()
            for (const [skillIndex, skill] of category.skills.entries()) {
                const skillName = skill.name.trim().toLowerCase()
                if (!skillName) return `${category.title}의 기술 ${skillIndex + 1}번 이름을 입력해 주세요.`
                if (skillNames.has(skillName)) return `${category.title} 카테고리의 기술명은 중복될 수 없습니다.`
                skillNames.add(skillName)
                if (!Number.isInteger(Number(skill.displayOrder)) || Number(skill.displayOrder) < 0) return `${category.title}의 기술 ${skillIndex + 1}번 표시 순서를 확인해 주세요.`
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
            nameKo: form.nameKo.trim() || null,
            nameEn: form.nameEn.trim() || null,
            profileImageUrl: form.profileImageUrl.trim() || null,
            birthDate: form.birthDate || null,
            position: form.position.trim() || null,
            background: form.background.trim() || null,
            currentFocus: form.currentFocus.trim() || null,
            location: form.location.trim() || null,
            interests: form.interests.trim() || null,
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
                    sectionType: section.sectionType,
                    displayOrder: Number(section.displayOrder)
                })
            ),
            educations: form.educations.map((item) => ({ educationType: item.educationType, institutionName: item.institutionName.trim(), courseName: item.courseName.trim(), startDate: item.startDate, endDate: item.endDate || null, status: item.status.trim() || null, description: item.description.trim() || null, displayOrder: Number(item.displayOrder) })),
            awards: form.awards.map((item) => ({ title: item.title.trim(), issuer: item.issuer.trim(), awardedDate: item.awardedDate, description: item.description.trim() || null, displayOrder: Number(item.displayOrder) })),
            workExperiences: form.workExperiences.map((item) => ({ companyName: item.companyName.trim(), positionTitle: item.positionTitle.trim(), employmentType: item.employmentType, startDate: item.startDate, endDate: item.endDate || null, descriptionHtml: item.descriptionHtml, displayOrder: Number(item.displayOrder) })),
            skillCategories: form.skillCategories.map((category) => ({ title: category.title.trim(), description: category.description.trim() || null, displayOrder: Number(category.displayOrder), skills: category.skills.map((skill) => ({ name: skill.name.trim(), logoUrl: skill.logoUrl.trim() || null, description: skill.description.trim() || null, displayOrder: Number(skill.displayOrder) })) }))
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
                        01 Profile / About Intro
                    </h2>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label className={styles.label}>이름(한글)</label>

                            <input className={styles.input} value={form.nameKo} maxLength={100} onChange={(e) => updateField('nameKo', e.target.value)} />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>이름(영문)</label>

                            <input className={styles.input} value={form.nameEn} maxLength={100} onChange={(e) => updateField('nameEn', e.target.value)} />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>생년월일</label>

                            <input type="date" className={styles.input} value={form.birthDate} onChange={(e) => updateField('birthDate', e.target.value)} />
                        </div>
                    </div>

                    <div className={styles.fieldRow}>
                        <div className={styles.field}><label className={styles.label}>포지션</label><input className={styles.input} value={form.position} maxLength={150} onChange={(e) => updateField('position', e.target.value)} /></div>
                        <div className={styles.field}><label className={styles.label}>Background</label><input className={styles.input} value={form.background} maxLength={200} onChange={(e) => updateField('background', e.target.value)} /></div>
                        <div className={styles.field}><label className={styles.label}>Current Focus</label><input className={styles.input} value={form.currentFocus} maxLength={200} onChange={(e) => updateField('currentFocus', e.target.value)} /></div>
                    </div>
                    <div className={styles.fieldRow}>
                        <div className={styles.field}><label className={styles.label}>거주 지역</label><input className={styles.input} value={form.location} maxLength={200} onChange={(e) => updateField('location', e.target.value)} /></div>
                        <div className={styles.field}><label className={styles.label}>관심사</label><textarea className={styles.textarea} value={form.interests} maxLength={500} rows={2} onChange={(e) => updateField('interests', e.target.value)} /></div>
                    </div>

                    <div className={styles.profileImageField}>
                        <span className={styles.label}>프로필 이미지</span>
                        <div className={styles.profileImageControls}>
                            <label className={styles.profileImageUploadButton}>
                                {profileImageUploading ? '업로드 중...' : '이미지 선택'}
                                <input
                                    className={styles.visuallyHidden}
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                    onChange={handleProfileImageChange}
                                    disabled={submitting || profileImageUploading}
                                />
                            </label>
                            {form.profileImageUrl && (
                                <button type="button" className={styles.profileImageRemoveButton} onClick={handleRemoveProfileImage} disabled={submitting || profileImageUploading}>
                                    이미지 제거
                                </button>
                            )}
                        </div>
                        <p className={styles.helpText}>JPG, PNG, WEBP · 최대 10MB. 업로드 후 About 저장을 눌러야 반영됩니다.</p>
                        {profileImageUploadError && <p className={styles.profileImageError} role="alert">{profileImageUploadError}</p>}
                        {form.profileImageUrl && !profileImagePreviewError && (
                            <img key={form.profileImageUrl} className={styles.profilePreview} src={form.profileImageUrl} alt="프로필 이미지 미리보기" onError={() => setProfileImagePreviewError(true)} />
                        )}
                        {form.profileImageUrl && profileImagePreviewError && <p className={styles.profileImageError}>이미지 미리보기를 불러오지 못했습니다.</p>}
                    </div>

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

                </section>

                <section className={styles.sectionsArea} aria-labelledby="about-education-title">
                    <div className={styles.sectionsHeader}><div><h2 id="about-education-title" className={styles.panelTitle}>02 Education</h2><p className={styles.sectionDescription}>학력과 직무 교육 이력을 관리합니다.</p></div><button type="button" className={styles.addButton} onClick={addEducation} disabled={submitting || form.educations.length >= MAX_EDUCATION_COUNT}>+ 교육 이력 추가</button></div>
                    {form.educations.length === 0 ? <div className={styles.empty}>등록된 교육 이력이 없습니다.</div> : <div className={styles.sectionList}>{form.educations.map((item, index) => <article key={item.clientId} className={styles.sectionCard}>
                        <header className={styles.sectionCardHeader}><h3 className={styles.sectionCardTitle}>Education {index + 1}</h3><button type="button" className={styles.removeButton} onClick={() => removeChild('educations', item.clientId)}>삭제</button></header>
                        <div className={styles.fieldRow}>
                            <div className={styles.field}><label className={styles.label}>교육 구분</label><select className={styles.input} value={item.educationType} onChange={(e) => updateEducation(item.clientId, 'educationType', e.target.value)}><option value="SCHOOL">학력</option><option value="TRAINING">교육</option></select></div>
                            <div className={styles.field}><label className={styles.label}>기관명</label><input className={styles.input} value={item.institutionName} onChange={(e) => updateEducation(item.clientId, 'institutionName', e.target.value)} /></div>
                            <div className={styles.field}><label className={styles.label}>과정 / 학과명</label><input className={styles.input} value={item.courseName} onChange={(e) => updateEducation(item.clientId, 'courseName', e.target.value)} /></div>
                        </div><div className={styles.fieldRow}>
                            <div className={styles.field}><label className={styles.label}>시작일</label><input type="date" className={styles.input} value={item.startDate} onChange={(e) => updateEducation(item.clientId, 'startDate', e.target.value)} /></div>
                            <div className={styles.field}><label className={styles.label}>종료일</label><input type="date" className={styles.input} value={item.endDate} onChange={(e) => updateEducation(item.clientId, 'endDate', e.target.value)} /></div>
                            <div className={styles.field}><label className={styles.label}>상태</label><input className={styles.input} value={item.status} onChange={(e) => updateEducation(item.clientId, 'status', e.target.value)} /></div>
                            <div className={styles.orderField}><label className={styles.label}>노출 순서</label><input type="number" min="0" className={styles.input} value={item.displayOrder} onChange={(e) => updateEducation(item.clientId, 'displayOrder', e.target.value)} /></div>
                        </div><div className={styles.field}><label className={styles.label}>설명</label><textarea className={styles.textarea} rows={3} value={item.description} onChange={(e) => updateEducation(item.clientId, 'description', e.target.value)} /></div>
                    </article>)}</div>}
                </section>

                <section className={styles.sectionsArea} aria-labelledby="about-awards-title">
                    <div className={styles.sectionsHeader}><div><h2 id="about-awards-title" className={styles.panelTitle}>03 Awards</h2><p className={styles.sectionDescription}>수상 이력을 관리합니다.</p></div><button type="button" className={styles.addButton} onClick={addAward} disabled={submitting || form.awards.length >= MAX_AWARD_COUNT}>+ 수상 이력 추가</button></div>
                    {form.awards.length === 0 ? <div className={styles.empty}>등록된 수상 이력이 없습니다.</div> : <div className={styles.sectionList}>{form.awards.map((item, index) => <article key={item.clientId} className={styles.sectionCard}>
                        <header className={styles.sectionCardHeader}><h3 className={styles.sectionCardTitle}>Award {index + 1}</h3><button type="button" className={styles.removeButton} onClick={() => removeChild('awards', item.clientId)}>삭제</button></header>
                        <div className={styles.fieldRow}><div className={styles.field}><label className={styles.label}>수상명</label><input className={styles.input} value={item.title} onChange={(e) => updateAward(item.clientId, 'title', e.target.value)} /></div><div className={styles.field}><label className={styles.label}>수여 기관</label><input className={styles.input} value={item.issuer} onChange={(e) => updateAward(item.clientId, 'issuer', e.target.value)} /></div><div className={styles.field}><label className={styles.label}>수상일</label><input type="date" className={styles.input} value={item.awardedDate} onChange={(e) => updateAward(item.clientId, 'awardedDate', e.target.value)} /></div><div className={styles.orderField}><label className={styles.label}>노출 순서</label><input type="number" min="0" className={styles.input} value={item.displayOrder} onChange={(e) => updateAward(item.clientId, 'displayOrder', e.target.value)} /></div></div>
                        <div className={styles.field}><label className={styles.label}>설명</label><textarea className={styles.textarea} rows={3} value={item.description} onChange={(e) => updateAward(item.clientId, 'description', e.target.value)} /></div>
                    </article>)}</div>}
                </section>

                <section className={styles.sectionsArea} aria-labelledby="about-work-experience-title">
                    <div className={styles.sectionsHeader}><div><h2 id="about-work-experience-title" className={styles.panelTitle}>04 Work Experience</h2><p className={styles.sectionDescription}>근무 이력과 상세 업무를 관리합니다.</p></div><button type="button" className={styles.addButton} onClick={addWorkExperience} disabled={submitting || form.workExperiences.length >= MAX_WORK_EXPERIENCE_COUNT}>+ 근무 이력 추가</button></div>
                    {form.workExperiences.length === 0 ? <div className={styles.empty}>등록된 근무 이력이 없습니다.</div> : <div className={styles.sectionList}>{form.workExperiences.map((item, index) => <article key={item.clientId} className={styles.sectionCard}>
                        <header className={styles.sectionCardHeader}><h3 className={styles.sectionCardTitle}>Work Experience {index + 1}</h3><button type="button" className={styles.removeButton} onClick={() => removeChild('workExperiences', item.clientId)}>삭제</button></header>
                        <div className={styles.fieldRow}><div className={styles.field}><label className={styles.label}>회사명</label><input className={styles.input} value={item.companyName} onChange={(e) => updateWorkExperience(item.clientId, 'companyName', e.target.value)} /></div><div className={styles.field}><label className={styles.label}>직무 / 포지션</label><input className={styles.input} value={item.positionTitle} onChange={(e) => updateWorkExperience(item.clientId, 'positionTitle', e.target.value)} /></div><div className={styles.field}><label className={styles.label}>고용 형태</label><select className={styles.input} value={item.employmentType} onChange={(e) => updateWorkExperience(item.clientId, 'employmentType', e.target.value)}><option value="FULL_TIME">정규직</option><option value="FREELANCE">프리랜서</option><option value="INTERN">인턴</option><option value="CONTRACT">계약직</option></select></div></div>
                        <div className={styles.fieldRow}><div className={styles.field}><label className={styles.label}>시작일</label><input type="date" className={styles.input} value={item.startDate} onChange={(e) => updateWorkExperience(item.clientId, 'startDate', e.target.value)} /></div><div className={styles.field}><label className={styles.label}>종료일</label><input type="date" className={styles.input} value={item.endDate} onChange={(e) => updateWorkExperience(item.clientId, 'endDate', e.target.value)} /></div><div className={styles.orderField}><label className={styles.label}>노출 순서</label><input type="number" min="0" className={styles.input} value={item.displayOrder} onChange={(e) => updateWorkExperience(item.clientId, 'displayOrder', e.target.value)} /></div></div>
                        <div className={styles.editorField}><span className={styles.label}>상세 업무</span><RichTextEditor value={item.descriptionHtml} onChange={(html) => updateWorkExperience(item.clientId, 'descriptionHtml', html)} placeholder="상세 업무를 입력하세요." disabled={submitting} ariaLabel={`근무 이력 ${index + 1} 상세 업무 편집기`} /></div>
                    </article>)}</div>}
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
                        05 Core Competencies
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

                <section className={styles.sectionsArea} aria-labelledby="about-technical-skills-title">
                    <div className={styles.sectionsHeader}>
                        <div>
                            <h2 id="about-technical-skills-title" className={styles.panelTitle}>06 Technical Skills</h2>
                            <p className={styles.sectionDescription}>실제 사용 기술과 도구를 자유로운 카테고리로 관리합니다.</p>
                        </div>
                        <button type="button" className={styles.addButton} onClick={addSkillCategory} disabled={submitting || form.skillCategories.length >= MAX_SKILL_CATEGORY_COUNT}>+ 카테고리 추가</button>
                    </div>

                    {form.skillCategories.length === 0 ? <div className={styles.empty}>등록된 Technical Skill Category가 없습니다.</div> : (
                        <div className={styles.sectionList}>
                            {form.skillCategories.map((category, categoryIndex) => (
                                <article key={category.clientId} className={`${styles.sectionCard} ${styles.skillCategoryCard}`}>
                                    <header className={styles.sectionCardHeader}>
                                        <div><p className={styles.sectionNumber}>Category {String(categoryIndex + 1).padStart(2, '0')}</p><h3 className={styles.sectionCardTitle}>{category.title || '새 기술 카테고리'}</h3></div>
                                        <button type="button" className={styles.removeButton} onClick={() => removeSkillCategory(category.clientId)} disabled={submitting}>카테고리 삭제</button>
                                    </header>
                                    <div className={styles.fieldRow}>
                                        <div className={styles.field}><label className={styles.label}>카테고리명</label><input className={styles.input} value={category.title} maxLength={150} onChange={(e) => updateSkillCategory(category.clientId, 'title', e.target.value)} required /></div>
                                        <div className={styles.field}><label className={styles.label}>설명</label><textarea className={styles.textarea} value={category.description} maxLength={500} rows={2} onChange={(e) => updateSkillCategory(category.clientId, 'description', e.target.value)} /></div>
                                        <div className={styles.orderField}><label className={styles.label}>표시 순서</label><input type="number" className={styles.input} value={category.displayOrder} min={0} onChange={(e) => updateSkillCategory(category.clientId, 'displayOrder', e.target.value)} required /></div>
                                    </div>
                                    <div className={styles.skillHeader}><h4>Skills</h4><button type="button" className={styles.addButton} onClick={() => addSkill(category.clientId)} disabled={submitting || category.skills.length >= MAX_SKILL_COUNT}>+ 기술 추가</button></div>
                                    {category.skills.length === 0 ? <div className={styles.empty}>기술을 추가해 주세요. 빈 카테고리도 저장할 수 있습니다.</div> : (
                                        <div className={styles.skillList}>{category.skills.map((skill, skillIndex) => (
                                            <article key={skill.clientId} className={styles.skillCard}>
                                                <header className={styles.skillCardHeader}><strong>Skill {String(skillIndex + 1).padStart(2, '0')}</strong><button type="button" className={styles.skillRemoveButton} onClick={() => removeSkill(category.clientId, skill.clientId)} disabled={submitting}>기술 삭제</button></header>
                                                <div className={styles.skillGrid}>
                                                    <div className={styles.field}><label className={styles.label}>기술명</label><input className={styles.input} value={skill.name} maxLength={100} onChange={(e) => updateSkill(category.clientId, skill.clientId, 'name', e.target.value)} required /></div>
                                                    <div className={styles.field}><label className={styles.label}>설명</label><input className={styles.input} value={skill.description} maxLength={300} onChange={(e) => updateSkill(category.clientId, skill.clientId, 'description', e.target.value)} /></div>
                                                    <div className={styles.orderField}><label className={styles.label}>표시 순서</label><input type="number" className={styles.input} value={skill.displayOrder} min={0} onChange={(e) => updateSkill(category.clientId, skill.clientId, 'displayOrder', e.target.value)} required /></div>
                                                </div>
                                                <div className={styles.skillLogoArea}>
                                                    {skill.logoUrl && !skillLogoPreviewErrors[skill.clientId] ? <img src={skill.logoUrl} alt={`${skill.name || '기술'} 로고 미리보기`} onError={() => setSkillLogoPreviewErrors((state) => ({ ...state, [skill.clientId]: true }))} /> : <div className={styles.skillLogoPlaceholder}>로고 없음</div>}
                                                    <div className={styles.skillLogoActions}>
                                                        <label className={styles.skillLogoUploadButton}>{uploadingSkillLogos[skill.clientId] ? '업로드 중...' : skill.logoUrl ? '로고 변경' : '로고 선택'}<input className={styles.visuallyHidden} type="file" accept=".png,.webp,image/png,image/webp" disabled={submitting || uploadingSkillLogos[skill.clientId]} onChange={(e) => handleSkillLogoChange(category.clientId, skill.clientId, e)} /></label>
                                                        {skill.logoUrl && <button type="button" className={styles.skillLogoRemoveButton} onClick={() => { updateSkill(category.clientId, skill.clientId, 'logoUrl', ''); setSkillLogoPreviewErrors((state) => ({ ...state, [skill.clientId]: false })) }} disabled={submitting}>로고 제거</button>}
                                                        {skillLogoErrors[skill.clientId] && <p className={styles.profileImageError} role="alert">{skillLogoErrors[skill.clientId]}</p>}
                                                    </div>
                                                </div>
                                            </article>
                                        ))}</div>
                                    )}
                                </article>
                            ))}
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
                                07 Content Sections
                            </h2>

                            <p className={styles.sectionDescription}>
                                Troubleshooting, Story와 기존 TECHNICAL_STACK Rich Text를 관리합니다.
                                Structured Technical Skills가 등록되면 다음 사용자 UI 단계에서 해당 데이터를 우선 사용할 예정입니다.
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
                                            htmlFor={`about-section-type-${section.clientId}`}
                                            className={styles.label}
                                        >
                                            Section type
                                        </label>
                                        <select
                                            id={`about-section-type-${section.clientId}`}
                                            className={styles.input}
                                            value={section.sectionType}
                                            onChange={(event) =>
                                                updateSectionField(
                                                    section.clientId,
                                                    'sectionType',
                                                    event.target.value,
                                                )
                                            }
                                            disabled={submitting}
                                        >
                                            <option value="TECHNICAL_STACK">Technical Stack</option>
                                            <option value="TROUBLESHOOTING">Troubleshooting</option>
                                            <option value="STORY">Story</option>
                                        </select>
                                    </div>

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

                <section className={styles.panel} aria-labelledby="about-publish-title">
                    <h2 id="about-publish-title" className={styles.panelTitle}>08 CTA / Publish</h2>
                    <div className={styles.fieldRow}>
                        <div className={styles.field}><label htmlFor="about-cta-label" className={styles.label}>CTA 문구</label><input id="about-cta-label" className={styles.input} value={form.ctaLabel} maxLength={100} onChange={(e) => updateField('ctaLabel', e.target.value)} required /></div>
                        <div className={styles.field}><label htmlFor="about-cta-url" className={styles.label}>CTA 주소</label><input id="about-cta-url" className={styles.input} value={form.ctaUrl} maxLength={500} placeholder="/contact" onChange={(e) => updateField('ctaUrl', e.target.value)} required /><p className={styles.helpText}>내부 경로 또는 허용된 외부 URL을 입력합니다.</p></div>
                    </div>
                    <label className={styles.checkboxLabel}><input type="checkbox" checked={form.published} onChange={(e) => updateField('published', e.target.checked)} disabled={submitting} />사용자 About 페이지에 공개</label>
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
