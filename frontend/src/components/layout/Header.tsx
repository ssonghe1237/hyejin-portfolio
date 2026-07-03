/**
 * packageName    : frontend.src.components.layout
 * fileName       : Header.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 공통 헤더 전용 컴포넌트
 *                  - 포트폴리오 사이트 상단 브랜드 영역 출력
 *                  - 주요 페이지 네비게이션 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       CSS Module 스타일 분리
 */

import { NavLink } from "react-router-dom"
import styles from "./Header.module.css"

function Header() {
    return(
        <header className={styles.header}>
            <div className={styles.inner}>
                <NavLink to="/work" className={styles.brand}>
                    SONG HYEJIN
                </NavLink>

                <nav aria-label="주요 메뉴" className={styles.nav}
                >
                    <NavLink
                        to="/work"
                        className={({ isActive }) => 
                            isActive
                                ? `${styles.navLink} ${styles.navLinkActive}`
                                : styles.navLink
                        }
                    >
                        Work
                    </NavLink>

                    <NavLink
                        to="/admin/projects"
                        className={({ isActive }) =>
                            isActive
                            ? `${styles.navLink} ${styles.navLinkActive}`
                            : styles.navLink
                        }
                        >
                        Admin
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}

export default Header