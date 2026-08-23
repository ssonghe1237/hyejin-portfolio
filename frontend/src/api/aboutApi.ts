/**
 * packageName    : frontend.src.api
 * fileName       : aboutApi.ts
 * author         : Song
 * date           : 2026-08-05
 * description    : 사용자 About API 요청 모듈
 *                  - 공개 About 콘텐츠 조회
 *                  - 백엔드 /api/about 엔드포인트와 연동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-05        Song               최초 생성
 */

import type { AboutCompetencyResponse, AboutResponse } from "../types/about"

interface ApiErrorResponse {
    detail?: string
    message?: string
    error?: string
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

// 사용자 공개 About 조회
export async function getAbout():
Promise<AboutResponse> {
    const response = await fetch("/api/about")

    if(!response.ok) {
        return throwApiError(
            response,
            'About 콘텐츠를 불러오지 못했습니다.'
        )
    }
    
    return response.json()
}

// 사용자 공개 핵심 역량 목록 조회
export async function getAboutCompetencies():
Promise<AboutCompetencyResponse[]> {
    
    const result = await fetch("/api/about/competencies")

    if (!result.ok) {
        throwApiError(
            result,
            '핵심 역량을 불러오지 못했습니다.'
        )
    }

    return result.json()
}
