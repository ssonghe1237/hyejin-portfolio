/**
 * packageName    : frontend.src.components.layout
 * fileName       : Header.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 공통 푸터 전용 컴포넌트
 *                  - 포트폴리오 사이트 하단 내비 영역 출력
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       CSS Module 스타일 분리
 * 2026-08-03        Song       사용자 페이지 구조 변경
 */

import { Link, useLocation } from 'react-router-dom'
import styles from './Footer.module.css'

function Footer() {
  const location = useLocation()

  if (location.pathname.startsWith('/admin')) {
    return <footer className={styles.adminFooter}>
            <div className={styles.adminInner}>
              © 2026 Song Hyejin. Backend-focused portfolio.
            </div>
          </footer>
  }

  return <footer className={styles.footer}>
          <div className={styles.inner}>
            <div className={styles.identity}>
              <Link to="/admin" className={styles.brand}>SONG HYEJIN</Link>

              <p>Backend Developer</p>

              <p>© 2026 Song Hyejin. Backend-focused portfolio.</p>
            </div>

            <div className={styles.footerRight}>
              <p className={styles.thankYou}>THANK YOU</p>

              <nav className={styles.footerNav} aria-label="Contact navigation">
                <a href="/contact#contact-email">Email</a>
                <a href="/contact#contact-github">GitHub</a>
                <a href="/contact#contact-resume-title">Resume</a>
              </nav>
            </div>
          </div>
        </footer>
}
export default Footer
