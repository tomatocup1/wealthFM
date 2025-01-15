import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        customer_data: resolve(__dirname, 'src/customer_data.html'),
        error_logs: resolve(__dirname, 'src/error_logs.html'),
        login: resolve(__dirname, 'src/login.html'),
        layout: resolve(__dirname, 'src/layout.html'),
        auth: resolve(__dirname, 'src/js/auth.js'),// 추가
        admin: resolve(__dirname, 'src/adminManagement.html'),
        privacy: resolve(__dirname, 'src/privacy-policy.html'),
        review: resolve(__dirname, 'src/js/Review.jsx') // 수정된 경로
      },
      external: ['/dist/review.js'], // 외부 모듈로 설정
      output: {
        entryFileNames: '[name].js', // 빌드된 파일 이름 설정
        chunkFileNames: 'chunks/[name]-[hash].js', // 추가 번들 파일 처리
        assetFileNames: 'assets/[name]-[hash][extname]' // 자산 파일 설정
      }
    },
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 3000
  },
  define: {
    'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
  }
});