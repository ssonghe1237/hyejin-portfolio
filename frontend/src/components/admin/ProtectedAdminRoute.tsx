/**
 * packageName    : frontend.src.components.admin
 * fileName       : ProtectedAdminRoute.tsx
 * author         : Song
 * date           : 2026-08-26
 * description    : 관리자 Route 인증 Guard
 *                  - Backend Session 인증 상태 확인
 *                  - 비로그인 사용자를 관리자 로그인 페이지로 이동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-26        Song               최초 생성
 */

import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import useAuth from '../../auth/useAuth'

function ProtectedAdminRoute() {

  const location = useLocation()

  const { status } = useAuth()


  if (status === 'loading') {
    return (
      <div>
        관리자 인증 상태를 확인하고 있습니다.
      </div>
    )
  }


  /*
   * API 장애와 비로그인을 동일하게 처리하지 않는다.
   *
   * 서버 장애인데 Login 페이지로 Redirect하면
   * 사용자는 비밀번호가 틀린 것으로 오해할 수 있다.
   */
  if (status === 'error') {
    return (
      <div>
        관리자 인증 상태를 확인하지 못했습니다.
      </div>
    )
  }


  if (status === 'anonymous') {

    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    )
  }


  return <Outlet />
}

export default ProtectedAdminRoute