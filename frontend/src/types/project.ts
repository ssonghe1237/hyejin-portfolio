/**
 * packageName    : frontend.src.types
 * fileName       : project.ts
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 관련 TypeScript 타입 정의
 *                  - 프로젝트 목록/상세 응답 타입 관리
 *                  - 프로젝트 이미지, 섹션, 링크, 기술스택 타입 관리
 *                  - 백엔드 DTO 응답 구조와 프론트 타입 매핑
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       프로젝트 목록/상세 응답 타입 추가
 * 2026-07-02        Song       heroImages 및 섹션 별 images 구조 반영
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

  // 프로젝트 목록 응답
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

// 프로젝트 상세 응답
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