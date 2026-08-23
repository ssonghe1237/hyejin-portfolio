/**
 * packageName    : frontend.src.api
 * fileName       : adminAboutApi.ts
 * author         : Song
 * date           : 2026-08-05
 * description    : 관리자 About API 요청 모듈
 *                  - 관리자 About 상세 조회
 *                  - 관리자 About 생성·수정
 *                  - 프로필 이미지 및 기술 로고 업로드
 *                  - About 미등록 상태의 204 응답 처리
 *                  - 백엔드 /api/admin/about 엔드포인트와 연동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-05        Song               최초 생성
 * 2026-08-24        Song               About 프로필·이력·기술 저장 및 이미지 업로드 연동
 */

import type {
    AdminAboutDetailResponse,
    AdminAboutUpsertRequest,

 } from "../types/about"

interface ApiErrorResponse {
    detail?: string
    message?: string
    error?: string
}

export interface AboutProfileImageUploadResponse {
    imageUrl: string
    originalFileName: string
    storedFileName: string
}

// 실패한 API 응답에서 서버 오류 메시지를 추출
async function throwApiError(
    response:Response,
    fallbackMessage:string
):Promise<never> {
    let errorMessage = `${fallbackMessage}: ${response.status}`

    try {
        const errorResponse = await response.json() as ApiErrorResponse

        errorMessage = 
            errorResponse.detail ??
            errorResponse.message ??
            errorResponse.error ??
            errorMessage
    } catch {
        // JSON 응답이 아니면 기본 오류 메시지를 사용
    } 

    throw new Error(errorMessage)
}

// =====================================================================================
// 조회
// =====================================================================================

// 관리자 About 상세 조회
export async function getAdminAbout():
Promise<AdminAboutDetailResponse | null> {
    const response = await fetch("/api/admin/about")

    // 204 응답에는 본문이 없으므로 response.json() 호출하면 파싱 오류 발생
    if(response.status === 204) {
        return null
    }

    if(!response.ok) {
        return throwApiError(
            response,
            '관리자 About 정보를 불러오지 못했습니다.'
        )
    }

    return response.json()
}

// =====================================================================================
// 저장
// =====================================================================================
export async function upsertAdminAbout(
    request:AdminAboutUpsertRequest
): Promise<AdminAboutDetailResponse> {
    const response = await fetch(
        "/api/admin/about",
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }
    )

    if(!response.ok) {
        return throwApiError(
            response,
            'About 콘텐츠를 저장하지 못했습니다.'
        )
    }

    return response.json()
}

export async function uploadAdminAboutProfileImage(
    file: File,
): Promise<AboutProfileImageUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/admin/about/profile-image/upload', {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        return throwApiError(response, '프로필 이미지를 업로드하지 못했습니다.')
    }

    return response.json()
}

export async function uploadAboutSkillLogo(
    file: File,
): Promise<AboutProfileImageUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/api/admin/about/skill-logo/upload', { method: 'POST', body: formData })
    if (!response.ok) return throwApiError(response, '기술 로고를 업로드하지 못했습니다.')
    return response.json()
}
