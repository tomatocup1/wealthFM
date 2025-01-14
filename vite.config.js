import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        layout: resolve(__dirname, 'layout.html'),
        customerData: resolve(__dirname, 'customer_data.html'),  // 파일명 변경
        errorLogs: resolve(__dirname, 'error_logs.html'),
        adminManagement: resolve(__dirname, 'adminManagement.html'),
        privacyPolicy: resolve(__dirname, 'privacy-policy.html'),
        webmasterRegistration: resolve(__dirname, 'webmasterRegistration.html')
      }
    },
    outDir: 'dist',
    assetsDir: 'assets'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000
  },
  define: {
    'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
  }
})