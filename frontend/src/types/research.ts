/**
 * packageName    : frontend.src.types
 * fileName       : research.ts
 * author         : Song
 * date           : 2026-08-03
 * description    : Research 도메인 TypeScript 타입 정의
 *                  - 사용자 공개 Research 목록 응답 타입
 *                  - 사용자 공개 Research 상세 응답 타입
 *                  - 관리자 Research 목록/상세 응답 타입
 *                  - 관리자 Research 등록/수정 요청 타입
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song               최초 생성
 * 2026-08-04        Song               관리자 Research 타입 추가
 */

// =====================================================================================
// 사용자 Research 응답 타입
// =====================================================================================

// 사용자 공개 Research 목록 응답
// 백엔드 ResearchListResponseDto 필드와 구조 일치
// 목록에는 본문 HTML을 사용하지 않으므로 contentHtml 미포함
export interface ResearchListResponse {
    researchId: number,
    title: string,
    slug: string,
    summary: string,
    category: string,
    displayOrder: number,
    publishedAt: string,
    updatedAt: string

}

// 사용자 공개 Research 상세 응답
// 백엔드 ResearchDetailResponseDto 필드와 구조 일치
export interface ResearchDetailResponse {
    researchId: number,
    title: string,
    slug: string,
    summary: string,
    contentHtml: string,
    category: string,
    publishedAt: string,
    updatedAt: string
}

// =====================================================================================
// 관리자 Research 응답 타입
// =====================================================================================
// 관리자 Ressearch 목록 응답
// 백엔드 AdminResearchListResponseDto 필드와 구조 일치
export interface AdminResearchListResponse {
    researchId: number,
    title: string,
    slug: string,
    summary: string,
    category: string,
    displayOrder: number,
    published: boolean,
    createdAt: string,
    updatedAt: string,
    publishedAt: string | null
}

// 관리자 Ressearch 상세 응답
// 백엔드 AdminResearchDetailResponseDto 필드와 구조 일치
export interface AdminResearchDetailResponse {
    researchId: number,
    title: string,
    slug: string,
    summary: string,
    contentHtml: string,
    category: string,
    displayOrder: number,
    published: boolean,
    createdAt: string,
    updatedAt: string,
    publishedAt: string | null
}

// =====================================================================================
// 관리자 Research 요청 타입
// =====================================================================================

// 관리자 Ressearch 등록 요청
// 백엔드 AdminResearchCreateRequestDto 필드와 구조 일치
export interface AdminResearchCreateRequest {
    title: string,
    slug: string,
    summary: string,
    contentHtml: string,
    category: string,
    displayOrder: number,
    published: boolean,
}

// 관리자 Ressearch 수정 요청
// 백엔드 AdminResearchUpdateRequestDto 필드와 구조 일치
export interface AdminResearchUpdateRequest {
  title: string
  slug: string
  summary: string
  contentHtml: string
  category: string
  displayOrder: number
  published: boolean
}

// 관리자 Research 공개 상태 변경 요청
// 백엔드 AdminResearchPublicationUpdateRequestDto와 필드 구조 일치
export interface AdminResearchPublicationUpdateRequest {
  published: boolean
}
    