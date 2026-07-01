import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 설정 시작!
export default defineConfig({
  // React를 사용할 수 있게 플러그인 장착
  plugins: [react()],
  
  // 프론트엔드 개발(로컬) 서버 관련 설정
  server: {
    // ★ 프록시(대리인) 주머니 설정
    proxy: {
      // [조건] 브라우저가 요청하는 주소가 '/api'로 시작하면 발동해라!
      '/api': {
        // [목적지] 그 요청을 가로채서 진짜 백엔드 서버인 여기로 토스해라!
        target: 'http://localhost:8081',
        
        // [출처 위조] 백엔드 서버가 거부감 없이 요청을 받도록 
        // 요청을 보낸 주소(Origin)를 백엔드 주소(localhost:8081)인 것처럼 속여주는 옵션
        changeOrigin: true,
      },
    },
  },
})