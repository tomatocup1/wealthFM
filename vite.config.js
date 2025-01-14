import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'  // 추가

export default defineConfig({
  plugins: [react()],  // 추가
  root: 'src', // src 디렉토리를 루트로 설정
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        customer_data: resolve(__dirname, 'src/customer_data.html'),
        error_logs: resolve(__dirname, 'src/error_logs.html'),
        login: resolve(__dirname, 'src/login.html'),
        layout: resolve(__dirname, 'src/layout.html'),
        admin: resolve(__dirname, 'src/adminManagement.html'),
        privacy: resolve(__dirname, 'src/privacy-policy.html')
      }
    },
    outDir: '../dist', // 빌드 출력 디렉토리를 프로젝트 루트의 dist로 설정
    emptyOutDir: true
  },
  server: {
    port: 3000
  },
  define: {
    'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
  }
})