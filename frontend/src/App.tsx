import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import WorkPage from './pages/WorkPage'
import ProjectDetailPage from './pages/ProjectDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Navigate to="/work" replace/>} />
          <Route path='/work' element={<WorkPage/>} />
          <Route path='/work/:slug' element={<ProjectDetailPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App