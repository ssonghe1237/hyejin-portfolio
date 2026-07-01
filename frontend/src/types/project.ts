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
  techStacks: ProjectTechResponse[]
  images: ProjectImageResponse[]
  sections: ProjectSectionResponse[]
  links: ProjectLinkResponse[]
}