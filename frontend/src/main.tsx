import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

/**
 * packageName    : frontend.src
 * fileName       : main.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : React 애플리케이션 진입점
 *                  - root DOM 요소에 App 컴포넌트 렌더링
 *                  - React StrictMode 적용
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 */

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('root element를 찾을 수 없습니다.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)