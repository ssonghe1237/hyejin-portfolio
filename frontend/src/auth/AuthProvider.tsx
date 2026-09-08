/**
 * packageName    : frontend.src.auth
 * fileName       : AuthProvider.tsx
 * author         : Song
 * date           : 2026-08-26
 * description    : 관리자 인증 상태 Provider
 *                  - Backend Session을 기준으로 로그인 상태 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-26        Song               최초 생성
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import AuthContext, {
  type AuthContextValue,
  type AuthStatus,
} from './AuthContext'

import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from '../api/authApi'

import type {
  AdminAuthResponse,
  AdminLoginRequest,
} from '../types/auth'

interface AuthProviderProps {
  children: ReactNode
}

function AuthProvider({
  children,
}: AuthProviderProps) {

  const [admin, setAdmin] =
    useState<AdminAuthResponse | null>(null)

  const [status, setStatus] =
    useState<AuthStatus>('loading')


  /**
   * Backend Session 기준 로그인 상태 확인
   */
  const refreshAuth = useCallback(async () => {

    setStatus('loading')

    try {

      const currentAdmin =
        await getCurrentAdmin()

      if (currentAdmin) {

        setAdmin(currentAdmin)
        setStatus('authenticated')

        return
      }

      setAdmin(null)
      setStatus('anonymous')

    } catch (error) {

      console.error(
        '관리자 인증 상태 확인 실패',
        error,
      )

      setAdmin(null)
      setStatus('error')
    }

  }, [])


  useEffect(() => {

    let cancelled = false

    async function initializeAuth() {

      try {

        const currentAdmin =
          await getCurrentAdmin()

        if (cancelled) {
          return
        }

        if (currentAdmin) {
          setAdmin(currentAdmin)
          setStatus('authenticated')
          return
        }

        setAdmin(null)
        setStatus('anonymous')

      } catch (error) {

        if (cancelled) {
          return
        }

        console.error(
          '관리자 초기 인증 상태 확인 실패',
          error,
        )

        setAdmin(null)
        setStatus('error')
      }
    }

    void initializeAuth()

    return () => {
      cancelled = true
    }

  }, [])


  /**
   * 관리자 로그인
   */
  const login = useCallback(
    async (
      request: AdminLoginRequest,
    ): Promise<AdminAuthResponse> => {

      const authenticatedAdmin =
        await loginAdmin(request)

      setAdmin(authenticatedAdmin)
      setStatus('authenticated')

      return authenticatedAdmin

    },
    [],
  )


  /**
   * 관리자 로그아웃
   */
  const logout = useCallback(async () => {

    await logoutAdmin()

    setAdmin(null)
    setStatus('anonymous')

  }, [])


  const value = useMemo<AuthContextValue>(
    () => ({
      admin,
      status,
      login,
      logout,
      refreshAuth,
    }),
    [
      admin,
      status,
      login,
      logout,
      refreshAuth,
    ],
  )


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider