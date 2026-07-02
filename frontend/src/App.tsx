import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import WorkPage from './pages/WorkPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import MainLayout from './components/layout/MainLayout'

/**
 * packageName    : frontend.src
 * fileName       : App.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프론트엔드 라우팅 설정 컴포넌트
 *                  - React Router 기반 페이지 라우팅 관리
 *                  - 공통 MainLayout 적용
 *                  - Work 목록 페이지 및 프로젝트 상세 페이지 연결
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       Work 목록/상세 페이지 라우팅 추가
 * 2026-07-02        Song       공통 MainLayout 적용
 */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* React Router Outlet 기반 하위 페이지 렌더링 */}
        <Route element={<MainLayout />}>
          {/* 전부 MainLayout의 <Outlet /> 자리에 치환 */}
          <Route path='/' element={<Navigate to="/work" replace/>} />
          <Route path='/work' element={<WorkPage/>} />
          <Route path='/work/:slug' element={<ProjectDetailPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App