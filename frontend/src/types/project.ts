/**
 * packageName    : frontend.src.types
 * fileName       : project.ts
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 관련 TypeScript 타입 정의
 *                  - 프로젝트 목록/상세 응답 타입 관리
 *                  - 프로젝트 이미지, 섹션, 링크, 기술스택 타입 관리
 *                  - 프로젝트 등록/수정 요청 타입 관리
 *                  - 관리자 프로젝트 공통 폼 상태 타입 관리
 *                  - 백엔드 DTO 응답 구조와 프론트 타입 매핑
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       프로젝트 목록/상세 응답 타입 추가
 * 2026-07-02        Song       heroImages 및 섹션별 images 구조 반영
 * 2026-07-09        Song       관리자 프로젝트 공통 폼 상태 타입 추가
 * 2026-07-09        Song       관리자 프로젝트 수정 요청 타입 추가
 * 2026-07-09        Song       하위 데이터 ID 필드명을 백엔드 DTO와 통일
 * 2026-07-28        Song       관리자 이미지 등록 요청 타입 추가
 */

export type ProjectType = 'TEAM' | 'PERSONAL'

export type ProjectImageType =
  | 'THUMBNAIL'
  | 'MAIN'
  | 'DETAIL'
  | 'ERD'
  | 'ARCHITECTURE'
  | 'SCREENSHOT'

export type ProjectSectionType =
  | 'CONTENTS'
  | 'OVERVIEW'
  | 'MY_ROLE'
  | 'TECH_STACK'
  | 'KEY_FEATURES'
  | 'ARCHITECTURE'
  | 'DATABASE_ERD'
  | 'WORKFLOW'
  | 'TROUBLESHOOTING'
  | 'RESULT'
  | 'LINKS'

export type ProjectLinkType =
  | 'GITHUB'
  | 'DEPLOY'
  | 'PDF'
  | 'NOTION'
  | 'RESUME'
  | 'SARAMIN'
  | 'ETC'

// ============================================================================
// 사용자 프로젝트 응답 타입
// ----------------------------------------------------------------------------

// 사용자 프로젝트 목록 응답
export interface ProjectListResponse {
  projectId: number
  title: string
  slug: string
  summary: string
  projectType: ProjectType
  startDate: string | null
  endDate: string | null
  periodText: string | null
  teamName: string | null
  role: string | null
  thumbnailUrl: string | null
  displayOrder: number
  techCategories: string[]
  myRoleTitles: string[]
}

// 프로젝트 기술스택 응답
export interface ProjectTechResponse {
  projectTechId: number
  techName: string
  techCategory: string | null
  displayOrder: number
}

// 프로젝트 이미지 응답
export interface ProjectImageResponse {
  projectImageId: number
  imageType: ProjectImageType
  imageUrl: string
  caption: string | null
  displayOrder: number
}

// 프로젝트 상세 섹션 응답
export interface ProjectSectionResponse {
  sectionId: number
  sectionType: ProjectSectionType
  title: string | null
  content: string | null
  displayOrder: number
  images: ProjectImageResponse[]
}

// 프로젝트 링크 응답
export interface ProjectLinkResponse {
  projectLinkId: number
  linkType: ProjectLinkType
  linkName: string
  url: string
  displayOrder: number
}

// 사용자 프로젝트 상세 응답
export interface ProjectDetailResponse {
  projectId: number
  title: string
  slug: string
  summary: string
  description: string | null
  projectType: ProjectType
  startDate: string | null
  endDate: string | null
  periodText: string | null
  teamName: string | null
  role: string | null
  displayOrder: number
  heroImages: ProjectImageResponse[]
  techStacks: ProjectTechResponse[]
  sections: ProjectSectionResponse[]
  links: ProjectLinkResponse[]
}

// ============================================================================
// 관리자 프로젝트 응답 타입
// ----------------------------------------------------------------------------

// 관리자 프로젝트 목록 응답
export interface AdminProjectListResponse {
  projectId: number
  title: string
  slug: string
  summary: string
  projectType: ProjectType
  startDate: string | null
  endDate: string | null
  teamName: string | null
  role: string | null
  displayOrder: number
  published: boolean
  createdAt: string
  updatedAt: string
}

// 관리자 프로젝트 상세 응답
export interface AdminProjectDetailResponse {
  projectId: number
  title: string
  slug: string
  summary: string
  description: string | null
  projectType: ProjectType
  startDate: string | null
  endDate: string | null
  teamName: string | null
  role: string | null
  displayOrder: number
  published: boolean
  createdAt: string
  updatedAt: string
  thumbnailImage: ProjectImageResponse | null
  heroImages: ProjectImageResponse[]
  techStacks: ProjectTechResponse[]
  sections: ProjectSectionResponse[]
  links: ProjectLinkResponse[]
}

// ============================================================================
// 관리자 프로젝트 등록 요청 타입
// ----------------------------------------------------------------------------

// 관리자 프로젝트 이미지 등록 요청
export interface AdminProjectImageRequest {
  imageType: ProjectImageType
  imageUrl: string
  caption: string | null
  displayOrder: number
}

// 관리자 프로젝트 기술스택 등록 요청
export interface AdminProjectTechRequest {
  techName: string
  techCategory: string | null
  displayOrder: number
}

// 관리자 프로젝트 섹션 등록 요청
export interface AdminProjectSectionRequest {
  sectionType: ProjectSectionType
  title: string | null
  content: string | null
  displayOrder: number
  images: AdminProjectImageRequest[]
}

// 관리자 프로젝트 링크 등록 요청
export interface AdminProjectLinkRequest {
  linkType: ProjectLinkType
  linkName: string
  url: string
  displayOrder: number
}

// 관리자 프로젝트 등록 요청
export interface AdminProjectCreateRequest {
  title: string
  slug: string
  summary: string
  description: string | null
  projectType: ProjectType
  startDate: string | null
  endDate: string | null
  teamName: string | null
  role: string | null
  displayOrder: number
  published: boolean
  thumbnailImage: AdminProjectImageRequest | null
  heroImages: AdminProjectImageRequest[]
  techStacks: AdminProjectTechRequest[]
  sections: AdminProjectSectionRequest[]
  links: AdminProjectLinkRequest[]
}

// ============================================================================
// 관리자 프로젝트 수정 요청 타입
// ----------------------------------------------------------------------------

/**
 * 관리자 프로젝트 이미지 수정 요청
 *
 * projectImageId가 있으면 기존 이미지 수정,
 * null이면 신규 이미지 등록으로 처리한다.
 */
export interface AdminProjectImageUpdateRequest {
  projectImageId: number | null
  imageType: ProjectImageType
  imageUrl: string
  caption: string | null
  displayOrder: number
}

/**
 * 관리자 프로젝트 섹션 수정 요청
 *
 * sectionId가 있으면 기존 섹션 수정,
 * null이면 신규 섹션 등록으로 처리한다.
 */
export interface AdminProjectSectionUpdateRequest {
  sectionId: number | null
  sectionType: ProjectSectionType
  title: string | null
  content: string | null
  displayOrder: number
  images: AdminProjectImageUpdateRequest[]
}

/**
 * 관리자 프로젝트 기술스택 수정 요청
 *
 * projectTechId가 있으면 기존 기술스택 수정,
 * null이면 신규 기술스택 등록으로 처리한다.
 */
export interface AdminProjectTechUpdateRequest {
  projectTechId: number | null
  techName: string
  techCategory: string | null
  displayOrder: number
}

/**
 * 관리자 프로젝트 링크 수정 요청
 *
 * projectLinkId가 있으면 기존 링크 수정,
 * null이면 신규 링크 등록으로 처리한다.
 */
export interface AdminProjectLinkUpdateRequest {
  projectLinkId: number | null
  linkType: ProjectLinkType
  linkName: string
  url: string
  displayOrder: number
}

/**
 * 관리자 프로젝트 수정 요청
 *
 * 기존 하위 데이터:
 * - ID를 포함하여 수정 요청
 *
 * 신규 하위 데이터:
 * - ID를 null로 전달
 *
 * 삭제할 하위 데이터:
 * - 각 deleted...Ids 배열에 기존 ID 전달
 */
export interface AdminProjectUpdateRequest {
  title: string
  slug: string
  summary: string
  description: string | null
  projectType: ProjectType
  startDate: string | null
  endDate: string | null
  teamName: string | null
  role: string | null
  displayOrder: number
  published: boolean

  thumbnailImage: AdminProjectImageUpdateRequest | null

  heroImages: AdminProjectImageUpdateRequest[]
  deletedImageIds: number[]

  sections: AdminProjectSectionUpdateRequest[]
  deletedSectionIds: number[]

  techStacks: AdminProjectTechUpdateRequest[]
  deletedTechIds: number[]

  links: AdminProjectLinkUpdateRequest[]
  deletedLinkIds: number[]
}

// ============================================================================
// 관리자 프로젝트 등록/수정 공통 폼 상태 타입
// ----------------------------------------------------------------------------

/**
 * 관리자 프로젝트 공통 폼 이미지 상태
 *
 * projectImageId가 있으면 서버에 저장된 기존 이미지,
 * null이면 아직 저장되지 않은 신규 이미지이다.
 */
export interface AdminProjectFormImage {
  projectImageId: number | null
  imageType: ProjectImageType
  imageUrl: string
  caption: string | null
  displayOrder: number
}

/**
 * 관리자 프로젝트 공통 폼 기술스택 상태
 *
 * projectTechId가 있으면 서버에 저장된 기존 기술스택,
 * null이면 아직 저장되지 않은 신규 기술스택이다.
 */
export interface AdminProjectFormTech {
  projectTechId: number | null
  techName: string
  techCategory: string | null
  displayOrder: number
}

/**
 * 관리자 프로젝트 공통 폼 섹션 상태
 *
 * sectionId가 있으면 서버에 저장된 기존 섹션,
 * null이면 아직 저장되지 않은 신규 섹션이다.
 */
export interface AdminProjectFormSection {
  sectionId: number | null
  sectionType: ProjectSectionType
  title: string | null
  content: string | null
  displayOrder: number
  images: AdminProjectFormImage[]
}

/**
 * 관리자 프로젝트 공통 폼 링크 상태
 *
 * projectLinkId가 있으면 서버에 저장된 기존 링크,
 * null이면 아직 저장되지 않은 신규 링크이다.
 */
export interface AdminProjectFormLink {
  projectLinkId: number | null
  linkType: ProjectLinkType
  linkName: string
  url: string
  displayOrder: number
}

/**
 * 관리자 프로젝트 등록/수정 공통 폼 상태
 */
export interface AdminProjectFormState {
  title: string
  slug: string
  summary: string
  description: string | null
  projectType: ProjectType
  startDate: string | null
  endDate: string | null
  teamName: string | null
  role: string | null
  displayOrder: number
  published: boolean

  thumbnailImage: AdminProjectFormImage | null
  heroImages: AdminProjectFormImage[]
  deletedImageIds: number[]

  sections: AdminProjectFormSection[]
  deletedSectionIds: number[]

  techStacks: AdminProjectFormTech[]
  deletedTechIds: number[]

  links: AdminProjectFormLink[]
  deletedLinkIds: number[]
}

// ============================================================================
// 이미지 등록
// ----------------------------------------------------------------------------

// 이미지 등록 요청
export interface ImageUploadResponse {
  imageUrl: string
  originalFileName: string
  storedFileName: string
}