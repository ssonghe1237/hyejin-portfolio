/**
 * packageName    : frontend.src.api
 * fileName       : authApi.ts
 * author         : Song
 * date           : 2026-08-26
 * description    : 관리자 인증 API 요청 모듈
 *                  - 관리자 로그인
 *                  - 현재 인증 상태 조회
 *                  - 관리자 로그아웃
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-26        Song               최초 생성
 */

import type {
  AdminAuthResponse,
  AdminLoginRequest,
} from '../types/auth'

import {
  apiFetch,
  clearCsrfToken,
  getCsrfToken,
} from './apiClient'


// 관리자 로그인
export async function loginAdmin(
  request: AdminLoginRequest,
): Promise<AdminAuthResponse> {

  /*
   * Session 만료 등으로 기존 Token이 남아있을 수 있으므로
   * 로그인 전에 새로운 CSRF Token을 확보한다.
   */
  clearCsrfToken()
  await getCsrfToken(true)

  const response = await apiFetch(
    '/api/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  )

  if (response.status === 401) {
    throw new Error(
      '아이디 또는 비밀번호를 확인해주세요.',
    )
  }

  if (!response.ok) {
    throw new Error(
      `관리자 로그인 실패: ${response.status}`,
    )
  }

  return response.json()
}


// 현재 관리자 로그인 상태 조회
export async function getCurrentAdmin()
: Promise<AdminAuthResponse | null> {

  const response = await fetch(
    '/api/auth/me',
    {
      method: 'GET',
      credentials: 'same-origin',
    },
  )

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    throw new Error(
      `관리자 인증 상태 조회 실패: ${response.status}`,
    )
  }

  return response.json()
}


// 관리자 로그아웃
export async function logoutAdmin(): Promise<void> {

  const response = await apiFetch(
    '/api/auth/logout',
    {
      method: 'POST',
    },
  )

  if (!response.ok) {
    throw new Error(
      `관리자 로그아웃 실패: ${response.status}`,
    )
  }

  /*
   * logout 시 Server Session이 제거되므로
   * 해당 Session에 대응하던 CSRF Token도 폐기한다.
   */
  clearCsrfToken()
}