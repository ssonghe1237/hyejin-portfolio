/**
 * packageName    : frontend.src.types
 * fileName       : about.ts
 * author         : Song
 * date           : 2026-08-05
 * description    : About 도메인 TypeScript 타입 정의
 *                  - 사용자 공개 About 응답 타입
 *                  - 관리자 About 상세 응답 타입
 *                  - 관리자 About 생성·수정 요청 타입
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-05        Song               최초 생성
 */

// =====================================================================================
// 사용자 About 응답 타입
// =====================================================================================
// 사용자 공개 About 핵심 역량 응답
// 백엔드 AboutCompetencyResponseDto 필드 구조 일치
export interface AboutCompetencyResponse {
    title: string,
    description: string,
    displayOrder: number
}

// 사용자 공개 About 섹션 응답
// 백엔드 AboutSectionResponseDto 필드 구조 일치
export interface AboutSectionResponse {
    title: string,
    contentHtml: string,
    displayOrder: number
}

// 사용자 공개 About 응답
// 백엔드 AboutResponseDto 필드 구조 일치
export interface AboutResponse {
    heading: string, 
    summary: string,
    ctaLabel: string,
    ctaUrl: string,
    updatedAt: string,
    competencies: AboutCompetencyResponse[],
    sections: AboutSectionResponse[]
}

// =====================================================================================
// 관리자 About 응답 타입
// =====================================================================================
// 관리자 핵심 역량 섹션 응답
// 백엔드 AdminAboutCompetencyResponseDto 필드 구조 일치
export interface AdminAboutCompetencyResponse
    extends AboutCompetencyResponse {
        competencyId: number
}

// 관리자 About 섹션 응답
// 백엔드 AdminAboutSectionResponseDto 필드 구조 일치
export interface AdminAboutSectionResponse
    extends AboutSectionResponse { //extends : 상속 받고 새로운 값 추가
        sectionId: number
    }

// 관리자 About 응답
// 백엔드 AdminAboutDetailResponseDto 필드 구조 일치
export interface AdminAboutDetailResponse {
    aboutId: number,
    heading: string,
    summary: string,
    ctaLabel: string,
    ctaUrl: string,
    published: boolean,
    createdAt: string,
    updatedAt: string,
    competencies: AdminAboutCompetencyResponse[],
    sections: AdminAboutSectionResponse[]
}

// =====================================================================================
// 관리자 About 요청 타입
// =====================================================================================

// 관리자 핵심 역량 저장 요청
// 백엔드 AdminAboutCompetencyRequestDto 필드 구조 일치
export interface AdminAboutCompetencyRequest {
    title: string,
    description: string
    displayOrder: number
}

// 관리자 About 섹션 저장 요청
// 백엔드 AdminAboutSectionRequestDto 필드 구조 일치
export interface AdminAboutSectionRequest {
    title: string,
    contentHtml: string,
    displayOrder: number
}

// 관리자 About 섹션 수정.저장 요청
// 백엔드 AdminAboutUpsertRequestDto 필드 구조 일치
export interface AdminAboutUpsertRequest {
    heading: string,
    summary: string,
    ctaLabel: string,
    ctaUrl: string,
    published: boolean,
    competencies: AdminAboutCompetencyRequest[],
    sections: AdminAboutSectionRequest[]
}