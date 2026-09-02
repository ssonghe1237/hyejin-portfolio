/**
 * packageName    : frontend.src.api
 * fileName       : apiClient.ts
 * author         : Song
 * date           : 2026-08-26
 * description    : 공통 API 요청 Client
 *                  - Session Cookie 기반 요청 처리
 *                  - CSRF Token 조회 및 상태 변경 요청 Header 적용
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-26        Song               최초 생성
 */

import type { CsrfTokenResponse } from "../types/auth"

let cachedCsrfToken: CsrfTokenResponse | null = null

const SAFE_HTTP_METHODS = new Set([
    'GET',
    'HEAD',
    'OPTIONS',
])

function requiresCsrf(method?: string): boolean {
    const normalizedMethod = (method ?? 'GET').toUpperCase()

    return !SAFE_HTTP_METHODS.has(normalizedMethod)
}

// CSRF Token 조회
// forceRefresh=true이면 기존 Cache를 사용하지 않고
// Server에서 다시 Token을 가져온다.
export async function getCsrfToken(
    forceRefresh = false
): Promise<CsrfTokenResponse> {

    if(!forceRefresh && cachedCsrfToken) {
        return cachedCsrfToken
    }

    const response = await fetch("/api/auth/csrf", {
        method: "GET",
        credentials: 'same-origin'
    })

    if(!response.ok) {
        throw new Error(
            `CSRF Token 조회 실패: ${response.status}`
        )
    }

    const csrfToken =
        (await response.json()) as CsrfTokenResponse


    cachedCsrfToken = csrfToken

    return csrfToken

}


// 현재 Frontend가 보관 중인 CSRF Token 제거
export function clearCsrfToken(): void {
  cachedCsrfToken = null
}


/**
 * 공통 API 요청
 *
 * POST / PUT / PATCH / DELETE 요청인 경우
 * CSRF Header를 자동으로 추가한다.
 *
 * FormData 요청에서도 Content-Type을 강제로 설정하지 않는다.
 */
export async function apiFetch(
    input: RequestInfo | URL, // fetch()의 첫번째 인자 => 요청할 주소 문자열 또는 URL
    init: RequestInit = {}    // fetch()의 두번째 인자 => 어떻게 요청할 것인가(method, headers 등등)
): Promise<Response> {

    const headers = new Headers(init.headers)

    if (requiresCsrf(init.method)) {
        const csrfToken = await getCsrfToken()

        headers.set(
        csrfToken.headerName,
        csrfToken.token,
        )
    }

    return fetch(
        input,
        {
            ...init,
            headers,
            credentials: 'same-origin',
        }
    )
}