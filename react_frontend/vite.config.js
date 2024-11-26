import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: '/', // 기본 경로를 루트로 설정 (Vercel에서 자동 처리)
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
      },
      port: 5173,
      open: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // @를 src 디렉토리로 매핑
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'], // 확장자 자동 인식
    },
    build: {
      outDir: 'dist', // 빌드 출력 디렉토리
      sourcemap: true, // 소스맵 활성화 (디버깅에 유용)
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'], // 번들 분리 (React 관련)
          },
        },
      },
    },
  };
});
