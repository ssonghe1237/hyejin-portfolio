/**
 * packageName    : frontend.src.types
 * fileName       : about.ts
 * author         : Song
 * date           : 2026-08-07
 * description    : About 도메인 Frontend 타입 정의
 *                  - 사용자·관리자 About 응답 타입 제공
 *                  - 프로필·경력·학력·수상·역량·기술 및 저장 요청 구조 정의
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 * 2026-08-24        Song       프로필·경력·학력·수상·기술 타입 확장
 */

export type AboutSectionType = 'TECHNICAL_STACK' | 'TROUBLESHOOTING' | 'STORY'
export type AboutEducationType = 'SCHOOL' | 'TRAINING'
export type AboutEmploymentType = 'FULL_TIME' | 'FREELANCE' | 'INTERN' | 'CONTRACT'

export interface AboutCompetencyResponse {
  title: string;
  description: string;
  displayOrder: number
}

export interface AboutSectionResponse { 
  title: string;
  contentHtml: string;
  sectionType: AboutSectionType | null;
  displayOrder: number
}

export interface AboutEducationResponse {
  educationType: AboutEducationType;
  institutionName: string;
  courseName: string;
  startDate: string;
  endDate: string | null;
  status: string | null;
  description: string | null;
  displayOrder: number
}

export interface AboutAwardResponse { title: string; issuer: string; awardedDate: string; description: string | null; displayOrder: number }

export interface AboutWorkExperienceResponse { companyName: string; positionTitle: string; employmentType: AboutEmploymentType; startDate: string; endDate: string | null; descriptionHtml: string; displayOrder: number }

export interface AboutSkillResponse { name: string; logoUrl: string | null; description: string | null; displayOrder: number }

export interface AboutSkillCategoryResponse { title: string; description: string | null; displayOrder: number; skills: AboutSkillResponse[] }

export interface AboutResponse {
  heading: string; summary: string
  nameKo: string | null; nameEn: string | null; profileImageUrl: string | null; birthDate: string | null
  position: string | null; background: string | null; currentFocus: string | null; location: string | null; interests: string | null
  ctaLabel: string; ctaUrl: string; updatedAt: string
  competencies: AboutCompetencyResponse[]; sections: AboutSectionResponse[]
  educations: AboutEducationResponse[]; awards: AboutAwardResponse[]; workExperiences: AboutWorkExperienceResponse[]
  skillCategories: AboutSkillCategoryResponse[]
}

export interface AdminAboutCompetencyResponse extends AboutCompetencyResponse { competencyId: number }
export interface AdminAboutSectionResponse extends AboutSectionResponse { sectionId: number }
export interface AdminAboutEducationResponse extends AboutEducationResponse { educationId: number }
export interface AdminAboutAwardResponse extends AboutAwardResponse { awardId: number }
export interface AdminAboutWorkExperienceResponse extends AboutWorkExperienceResponse { experienceId: number }
export interface AdminAboutSkillResponse extends AboutSkillResponse { skillId: number }
export interface AdminAboutSkillCategoryResponse extends AboutSkillCategoryResponse { skillCategoryId: number; skills: AdminAboutSkillResponse[] }

export interface AdminAboutDetailResponse {
  aboutId: number; heading: string; summary: string
  nameKo: string | null; nameEn: string | null; profileImageUrl: string | null; birthDate: string | null
  position: string | null; background: string | null; currentFocus: string | null; location: string | null; interests: string | null
  ctaLabel: string; ctaUrl: string; published: boolean; createdAt: string; updatedAt: string
  competencies: AdminAboutCompetencyResponse[]; sections: AdminAboutSectionResponse[]
  educations: AdminAboutEducationResponse[]; awards: AdminAboutAwardResponse[]; workExperiences: AdminAboutWorkExperienceResponse[]
  skillCategories: AdminAboutSkillCategoryResponse[]
}

export type AdminAboutCompetencyRequest = AboutCompetencyResponse
export interface AdminAboutSectionRequest { title: string; contentHtml: string; sectionType: AboutSectionType; displayOrder: number }
export type AdminAboutEducationRequest = AboutEducationResponse
export type AdminAboutAwardRequest = AboutAwardResponse
export type AdminAboutWorkExperienceRequest = AboutWorkExperienceResponse
export type AdminAboutSkillRequest = AboutSkillResponse
export type AdminAboutSkillCategoryRequest = AboutSkillCategoryResponse

export interface AdminAboutUpsertRequest {
  heading: string; summary: string
  nameKo: string | null; nameEn: string | null; profileImageUrl: string | null; birthDate: string | null
  position: string | null; background: string | null; currentFocus: string | null; location: string | null; interests: string | null
  ctaLabel: string; ctaUrl: string; published: boolean
  competencies: AdminAboutCompetencyRequest[]; sections: AdminAboutSectionRequest[]
  educations: AdminAboutEducationRequest[]; awards: AdminAboutAwardRequest[]; workExperiences: AdminAboutWorkExperienceRequest[]
  skillCategories: AdminAboutSkillCategoryRequest[]
}
