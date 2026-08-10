/**
 * packageName    : frontend.src.types
 * fileName       : contact.ts
 * author         : Song
 * date           : 2026-08-09
 * description    : Contact 페이지 TypeScript 타입 정의
 *                  - 사용자 공개 Contact 응답 타입 정의
 *                  - 관리자 Contact 상세 응답 타입 정의
 *                  - 관리자 Contact 저장 요청 타입 정의
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-09        Song               최초 생성
 */

// 사용자 공개 Contact 응답
// 백엔드 ContactResponseDto와 구조 동일
export interface ContactResponse {
  heading: string
  description: string
  email: string
  githubUrl: string
  linkedinUrl: string | null
  resumeLabel: string
  resumeFileUrl: string | null
}

// 관리자 Contact 상세 응답
// 백엔드 AdminContactDetailResponseDto와 구조 동일
export interface AdminContactDetailResponse {
  contactId: number
  heading: string
  description: string
  email: string
  githubUrl: string
  linkedinUrl: string | null
  resumeLabel: string
  resumeFileUrl: string | null
  resumeOriginalFileName: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

// 관리자 Contact 생성·수정 요청
// 백엔드 AdminContactUpsertRequestDto와 구조 동일
export interface AdminContactUpsertRequest {
  heading: string
  description: string
  email: string
  githubUrl: string
  linkedinUrl: string
  resumeLabel: string
  published: boolean
}