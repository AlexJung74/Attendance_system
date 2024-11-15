import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    // 서버 설정
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // 백엔드 API 서버 주소
        changeOrigin: true, // 대상의 Origin 헤더 변경
        secure: false, // HTTPS 인증서 무시
      },
    },
    port: 5173, // 개발 서버 포트 설정
    open: true, // 개발 서버 실행 시 브라우저 자동 열기
  },
  resolve: {
    // 경로 및 확장자 설정
    extensions: ['.js', '.jsx'], // .js, .jsx 확장자 처리
    alias: {
      '@': '/src', // @를 src 디렉토리로 매핑
    },
  },
  build: {
    // 빌드 설정
    outDir: 'dist', // 빌드 출력 디렉토리
    sourcemap: true, // 디버깅을 위한 소스맵 활성화
    rollupOptions: {
      // 번들링 최적화 설정
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // React 관련 라이브러리 분리
        },
      },
    },
  },
})
