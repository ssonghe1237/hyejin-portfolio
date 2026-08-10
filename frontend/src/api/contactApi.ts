/**
 * packageName    : frontend.src.api
 * fileName       : contactApi.ts
 * author         : Song
 * date           : 2026-08-09
 * description    : 사용자 Contact API
 *                  - 공개 Contact 콘텐츠 조회
 *                  - 연락 정보 및 이력서 PDF URL 조회
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-09        Song               최초 생성
 */

import type { ContactResponse } from '../types/contact'

interface ApiErrorResponse {
    message?: string
    detail?: string
    error?: string
}

async function throwApiError(
    response:Response,
    defaultMessage: string
): Promise<never> {
    let errorMessage = defaultMessage

    try {
        const errorBody =
            (await response.json()) as ApiErrorResponse

        errorMessage =
            errorBody.message ??
                errorBody.detail ??
                    errorBody.error ??
                        defaultMessage
    } catch {
        // 응답 body가 json이 아닌 경우 기본 메시지 사용
    }
    
    throw new Error(errorMessage)    
}

// 사용자 공개 Contact 조회
export async function getContact(): Promise<ContactResponse> {
    const response = await fetch("/api/contact")

    if (!response.ok) {
        return throwApiError(
            response,
            'Contact 정보를 불러오지 못했습니다.'
        )
    }

    return response.json()
}