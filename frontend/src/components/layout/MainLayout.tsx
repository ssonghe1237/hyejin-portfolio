/**
 * packageName    : frontend.src.components.layout
 * fileName       : MainLayout.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 공통 레이아웃 컴포넌트
 *                  - Header, Footer, 페이지 본문 영역 조립
 *                  - React Router Outlet 기반 하위 페이지 렌더링
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       CSS Module 스타일 분리
 */

import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
import styles from './MainLayout.module.css'

function MainLayout() {
  const location = useLocation()
  const isHomeRoute = location.pathname === '/'
  const isWorkRoute = location.pathname === '/work'
  const isResearchRoute = location.pathname === '/research'
  const isProjectDetailRoute = location.pathname.startsWith('/work/')
  const isAboutRoute = location.pathname === '/about'
  const isContactRoute = location.pathname === '/contact'
  const publicMainClassName = isHomeRoute
    ? `${styles.main} ${styles.homeMain}`
      : isWorkRoute
        ? `${styles.main} ${styles.workMain}`
        : isResearchRoute
          ? `${styles.main} ${styles.researchMain}`
        : isProjectDetailRoute
        ? `${styles.main} ${styles.projectDetailMain}`
        : isAboutRoute
          ? `${styles.main} ${styles.aboutMain}`
        : isContactRoute
          ? `${styles.main} ${styles.contactMain}`
        : styles.main

  return (
    <div className={styles.pageBackground}>
      <div className={styles.siteShell}>
        <Header />
        <main className={publicMainClassName}><Outlet /></main>
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout
