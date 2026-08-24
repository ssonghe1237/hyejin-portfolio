/**
 * packageName    : frontend.src.components.admin
 * fileName       : AdminHeader.tsx
 * author         : Song
 * date           : 2026-08-24
 * description    : 관리자 페이지 공통 헤더 컴포넌트
 *                  - Projects, Research, About, Contact 관리자 네비게이션 제공
 *                  - 현재 Route 기반 Active 상태 표시
 *                  - 사용자 사이트 이동 기능 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-24        Song       최초 생성
 */

import { NavLink, Link } from 'react-router-dom'
import styles from './AdminHeader.module.css'

const adminNavigation = [
  { label: 'Projects', to: '/admin/projects' },
  { label: 'Research', to: '/admin/research' },
  { label: 'About', to: '/admin/about' },
  { label: 'Contact', to: '/admin/contact' },
]

function AdminHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/admin/projects" className={styles.brand}>
          SONG HYEJIN <span>/ ADMIN</span>
        </Link>

        <div className={styles.navigationRow}>
          <nav className={styles.navigation} aria-label="관리자 메뉴">
            {adminNavigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/" className={styles.viewSite}>
            View Site <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
