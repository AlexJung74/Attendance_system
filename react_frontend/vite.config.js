// react_frontend/vite.config.js

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Vite의 모드에 따라 환경 변수 로드
  const env = loadEnv(mode, process.cwd());

  return {
    base: '/react_frontend/', // 애플리케이션의 기본 경로 설정

    plugins: [react()],
    server: {
      // 서버 설정
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL, // 환경 변수에서 백엔드 API 서버 주소 로드
          changeOrigin: true, // 대상의 Origin 헤더 변경
          secure: false, // HTTPS 인증서 무시
        },
      },
      port: 5173, // 개발 서버 포트 설정
      open: true, // 개발 서버 실행 시 브라우저 자동 열기
    },
    define: {
      'process.env': { ...env }, // process.env에 환경 변수 주입
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // @를 src 디렉토리로 매핑
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'], // 확장자 처리
    },
    build: {
      outDir: 'dist', // 빌드 출력 디렉토리
      sourcemap: true, // 디버깅을 위한 소스맵 활성화
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'], // React 관련 라이브러리 분리
          },
        },
      },
    },
  };
});
