/**
 * packageName    : frontend.src.components.layout
 * fileName       : Footer.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 공통 푸터 컴포넌트
 *                  - 포트폴리오 사이트 하단 정보 출력
 *                  - 저작권 및 간단한 소개 문구 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       CSS Module 스타일 분리
 */

import { useLocation } from 'react-router-dom'
import styles from './Footer.module.css'

function Footer() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  if (isAdminRoute) {
    return (
      <footer className={styles.adminFooter}>
        <div className={styles.adminInner}>
          <p className={styles.adminCopy}>
            © 2026 Song Hyejin. Backend-focused portfolio.
          </p>
        </div>
      </footer>
    )
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.identity}>
          <p className={styles.brand}>
            <span className={styles.marker} aria-hidden="true" />
            SONG HYEJIN
          </p>

          <p className={styles.role}>Backend Developer</p>
        </div>

        <p className={styles.copy}>
          © 2026 Song Hyejin. Backend-focused portfolio.
        </p>
      </div>
    </footer>
  )
}

export default Footer
