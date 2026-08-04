import type {
  ResearchDetailResponse,
  ResearchListResponse,
} from '../types/research'

/**
 * packageName    : frontend.src.api
 * fileName       : researchApi.ts
 * author         : Song
 * date           : 2026-08-03
 * description    : 사용자 Research API 요청 모듈
 *                  - 공개 Research 목록 조회 API 호출
 *                  - slug 기준 공개 Research 상세 조회 API 호출
 *                  - 백엔드 /api/research 엔드포인트와 연동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song               최초 생성
 */

// 사용자 공개 Research 목록 조회
export async function getResearchList(): Promise<ResearchListResponse[]> {
    const response = await fetch('/api/research')

    if(!response.ok) {
        throw new Error(
            `Research 목록 조회 실패: ${response.status}`
        )
    }

    return response.json()   
}

// Work 페이지 최근 수정 공개 Research 최대 5개 조회
export async function getRecentResearchList():
Promise<ResearchListResponse[]> {
    const response = await fetch('/api/research/highlights/recent')
    
    if(!response.ok) {
        throw new Error(
            `최근 Research 목록 조회 실패: ${response.status}`
        )
    }

    return response.json()
}

// 사용자 공개 Research 상세 조회
export async function getResearchDetail(
    slug:string
): Promise<ResearchDetailResponse> {
    const encodedSlug = encodeURIComponent(slug)

    const response = await fetch(`/api/research/${encodedSlug}`)

    if(!response.ok) {
        throw new Error(
            `Research 상세 조회 실패: ${response.status}`
        )
    }

    return response.json()
    
}