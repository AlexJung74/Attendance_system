import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: '/', // Vercel 배포 시 기본 경로를 루트로 설정

    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://attendance-backend-40491d7871de.herokuapp.com',
          changeOrigin: true,
          secure: false,
        },
      },
      port: 5173,
      open: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
  };
});
