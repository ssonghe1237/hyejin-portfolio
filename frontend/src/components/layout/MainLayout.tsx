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
 */

import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

function MainLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fff',
        color: '#111',
      }}
    >
      <Header />

      <main
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '40px 24px 0',
        }}
      >
        
        {/* 주소창(URL)에 입력 된 경로에 따라 알맞은 자식 컴포넌트를 이 자리에 끼워 넣어라 */}
        <Outlet />
        
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout