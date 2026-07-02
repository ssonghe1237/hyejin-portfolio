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

import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}
      >
        <p className={styles.copy}>
          © 2026 Song Hyejin. Backend-focused portfolio.
        </p>
      </div>
    </footer>
  )
}

export default Footer