
/**
 * packageName    : frontend.src
 * fileName       : App.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프론트엔드 라우팅 설정 컴포넌트
 *                  - React Router 기반 페이지 라우팅 관리
 *                  - 공통 MainLayout 적용
 *                  - Work 목록 페이지 및 프로젝트 상세 페이지 연결
 *                  - 관리자 프로젝트 등록/상세/수정 페이지 연결
 *                  - Research 상세 페이지 연결
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       Work 목록/상세 페이지 라우팅 추가
 * 2026-07-02        Song       공통 MainLayout 적용
 * 2026-07-04        Song       관리자 페이지 라우팅 추가
 * 2026-07-09        Song       관리자 프로젝트 수정 페이지 라우팅 추가
 * 2026-08-04        Song       Research 상세 페이지 라우팅 추가
 * 2026-08-04        Song       관리자 Research 등록 페이지 라우팅 추가
 * 2026-08-04        Song       관리자 Research 상세 페이지 라우팅 추가
 * 2026-08-04        Song       관리자 Research 수정 페이지 라우팅 추가
 * 2026-08-04        Song       사용자 Research 전체 목록 페이지 라우팅 추가
 * 2026-08-05        Song       관리자 About 콘텐츠 편집 페이지 라우팅 추가
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import WorkPage from './pages/WorkPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import MainLayout from './components/layout/MainLayout'
import AdminLayout from './components/admin/AdminLayout'

import AdminProjectDetailPage from './pages/admin/AdminProjectDetailPage'
import AdminProjectListPage from './pages/admin/AdminProjectListPage'
import AdminProjectCreatePage from './pages/admin/AdminProjectCreatePage'
import AdminProjectUpdatePage from './pages/admin/AdminProjectUpdatePage'

import AdminResearchListPage  from './pages/admin/AdminResearchListPage'
import AdminResearchDetailPage  from './pages/admin/AdminResearchDetailPage'
import AdminResearchCreatePage  from './pages/admin/AdminResearchCreatePage'
import AdminResearchUpdatePage from './pages/admin/AdminResearchUpdatePage'
import AdminAboutPage from './pages/admin/AdminAboutPage'
import AdminContactPage from './pages/admin/AdminContactPage'

import HomePage from './pages/HomePage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import ResearchListPage from './pages/ResearchListPage'
import ResearchDetailPage from './pages/ResearchDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* React Router Outlet 기반 하위 페이지 렌더링 */}
        <Route element={<MainLayout />}>
          {/* 진입 페이지 */}
          <Route path="/" element={<HomePage />} />

          {/* 사용자 페이지 */}
          <Route path="/work" element={<WorkPage />} />

          <Route path="/work/:slug" element={<ProjectDetailPage />} />

          <Route path="/research/:slug" element={<ResearchDetailPage />} />
          <Route path="/research" element={<ResearchListPage />}/>

          <Route path='/about' element={<AboutPage />}/>

          <Route path='/contact' element={<ContactPage />} />
          
        </Route>

        {/* 관리자 페이지 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="projects" replace />} />
          <Route path="projects" element={<AdminProjectListPage />} />
          <Route path="projects/new" element={<AdminProjectCreatePage />} />
          <Route path="projects/:projectId/edit" element={<AdminProjectUpdatePage />} />
          <Route path="projects/:projectId" element={<AdminProjectDetailPage />} />

          <Route path="research" element={<AdminResearchListPage />}/>
          <Route path="research/:researchId" element={<AdminResearchDetailPage />}/>
          <Route path="research/new" element={<AdminResearchCreatePage />}/>
          <Route path="research/:researchId/edit" element={<AdminResearchUpdatePage />}/>

          <Route path="about" element={<AdminAboutPage />}/>
          <Route path="contact" element={<AdminContactPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
