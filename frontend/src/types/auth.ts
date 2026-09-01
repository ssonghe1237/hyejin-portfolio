/**
 * packageName    : frontend.src.types
 * fileName       : auth.ts
 * author         : Song
 * date           : 2026-08-26
 * description    : 관리자 인증 관련 타입 정의
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-26        Song               최초 생성
 */

export interface AdminLoginRequest {
  username: string
  password: string
}

export interface AdminAuthResponse {
  authenticated: boolean
  username: string
  role: string
}

export interface CsrfTokenResponse {
  token: string
  headerName: string
  parameterName: string
}