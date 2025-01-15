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
        admin: resolve(__dirname, 'src/adminManagement.html'),
        privacy: resolve(__dirname, 'src/privacy-policy.html'),
        review: resolve(__dirname, 'src/js/Review.js') // React 컴포넌트 추가
      },
      output: {
        entryFileNames: '[name].js' // React 파일을 구분하기 쉽게 이름 설정
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
