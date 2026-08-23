/**
 * packageName    : frontend.src.components.admin
 * fileName       : AdminLayout.tsx
 * author         : Song
 * date           : 2026-08-24
 * description    : 관리자 페이지 공통 레이아웃 컴포넌트
 *                  - AdminHeader와 관리자 하위 페이지 조립
 *                  - React Router Outlet 기반 관리자 페이지 렌더링
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-24        Song       최초 생성
 */

import { Outlet } from 'react-router-dom'
import AdminHeader from './AdminHeader'
import styles from './AdminLayout.module.css'

function AdminLayout() {
  return (
    <div className={styles.layout}>
      <AdminHeader />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
