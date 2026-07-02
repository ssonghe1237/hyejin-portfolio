/**
 * packageName    : frontend.src.components.layout
 * fileName       : Header.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 공통 헤더 컴포넌트
 *                  - 포트폴리오 사이트 상단 브랜드 영역 출력
 *                  - 주요 페이지 네비게이션 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 */

import { NavLink } from "react-router-dom"

function Header() {
    return(
        <header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #eee',
            }}    
        >
            <div
                style={{
                   maxWidth: '1120px',
                    margin: '0 auto',
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px', 
                 }}  
            >
                <NavLink
                    to="/work"
                    style={{
                        textDecoration: 'none',
                        color: '#111',
                        fontWeight: 800,
                        fontSize: '20px',
                        letterSpacing: '-0.04em',
                    }}
                >
                    SONG HYEJIN
                </NavLink>

                <nav
                    aria-label="주요 메뉴"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                    }}
                >
                    <NavLink
                        to="/work"
                        style={({ isActive }) => ({
                            textDecoration: 'none',
                            color: isActive ? '#111' : '#777',
                            fontWeight: isActive ? 700 : 500,
                        })}
                    >
                        Work
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}

export default Header