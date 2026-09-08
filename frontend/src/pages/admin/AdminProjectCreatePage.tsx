/**
 * packageName    : frontend.src.pages.admin
 * fileName       : AdminProjectCreatePage.tsx
 * author         : Song
 * date           : 2026-07-07
 * description    : 관리자 프로젝트 등록 페이지
 *                  - 프로젝트 등록용 초기 폼 상태 관리
 *                  - 공통 프로젝트 폼 컴포넌트 사용
 *                  - 등록 요청 데이터 변환 및 API 호출
 *                  - 등록 완료 후 관리자 프로젝트 상세 페이지 이동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-07        Song       최초 생성
 * 2026-07-09        Song       프로젝트 등록/수정 공통 폼 컴포넌트 적용
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createAdminProject } from '../../api/adminProjectApi'
import AdminProjectForm from '../../components/admin/project/AdminProjectForm'
import type {
  AdminProjectCreateRequest,
  AdminProjectFormState,
} from '../../types/project'
import styles from './AdminProjectCreatePage.module.css'

// 관리자 프로젝트 등록 폼 초기값
const initialForm: AdminProjectFormState = {
  title: '',
  slug: '',
  summary: '',
  description: null,
  projectType: 'TEAM',
  startDate: null,
  endDate: null,
  teamName: null,
  role: null,
  displayOrder: 0,
  published: false,

  thumbnailImage: {
    projectImageId: null,
    imageType: 'THUMBNAIL',
    imageUrl: '',
    caption: null,
    displayOrder: 1,
  },
  heroImages: [],
  deletedImageIds: [],

  sections: [],
  deletedSectionIds: [],

  techStacks: [],
  deletedTechIds: [],

  links: [],
  deletedLinkIds: [],
}

// 공통 폼 상태를 프로젝트 등록 API 요청 형식으로 변환
function toCreateRequest(
  form: AdminProjectFormState,
): AdminProjectCreateRequest {
  return {
    title: form.title,
    slug: form.slug,
    summary: form.summary,
    description: form.description,
    projectType: form.projectType,
    startDate: form.startDate,
    endDate: form.endDate,
    teamName: form.teamName,
    role: form.role,
    displayOrder: form.displayOrder,
    published: form.published,

    thumbnailImage: form.thumbnailImage
      ? {
          imageType: form.thumbnailImage.imageType,
          imageUrl: form.thumbnailImage.imageUrl,
          caption: form.thumbnailImage.caption,
          displayOrder: form.thumbnailImage.displayOrder,
        }
      : null,

    heroImages: form.heroImages.map((image) => ({
      imageType: image.imageType,
      imageUrl: image.imageUrl,
      caption: image.caption,
      displayOrder: image.displayOrder,
    })),

    techStacks: form.techStacks.map((tech) => ({
      techName: tech.techName,
      techCategory: tech.techCategory,
      displayOrder: tech.displayOrder,
    })),

    sections: form.sections.map((section) => ({
      sectionType: section.sectionType,
      title: section.title,
      content: section.content,
      displayOrder: section.displayOrder,

      images: section.images.map((image) => ({
        imageType: image.imageType,
        imageUrl: image.imageUrl,
        caption: image.caption,
        displayOrder: image.displayOrder,
      })),
    })),

    links: form.links.map((link) => ({
      linkType: link.linkType,
      linkName: link.linkName,
      url: link.url,
      displayOrder: link.displayOrder,
    })),
  }
}

function AdminProjectCreatePage() {
  // ============================================================================
  // 1) hooks
  // ----------------------------------------------------------------------------
  const navigate = useNavigate()

  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  )

  // ============================================================================
  // 3. 이벤트 함수 
  // - 관리자 프로젝트 등록 처리
  // ----------------------------------------------------------------------------
  async function handleCreate(
    form: AdminProjectFormState,
  ) {
    try {
      setSubmitting(true)
      setErrorMessage(null)

      const request = toCreateRequest(form)
      const result = await createAdminProject(request)

      navigate(`/admin/projects/${result.projectId}`)
    } catch (error) {
      console.error(error)

      setErrorMessage(
        error instanceof Error
          ? error.message
          : '프로젝트를 등록하지 못했습니다.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <Link
        to="/admin/projects"
        className={styles.backLink}
      >
        ← 관리자 프로젝트 목록으로 돌아가기
      </Link>

      <header>
        <h1 className={styles.title}>Create Project</h1>

        <p className={styles.description}>
          프로젝트 기본 정보와 상세 콘텐츠를 등록합니다.
        </p>
      </header>

      {errorMessage && (
        <div className={styles.error}>
          {errorMessage}
        </div>
      )}

      <AdminProjectForm
        mode="create"
        initialValue={initialForm}
        submitting={submitting}
        cancelTo="/admin/projects"
        onSubmit={handleCreate}
      />
    </div>
  )
}

export default AdminProjectCreatePage