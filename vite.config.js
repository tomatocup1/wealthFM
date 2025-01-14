import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        login: resolve(__dirname, 'src/login.html'),
        layout: resolve(__dirname, 'src/layout.html'),
        customerData: resolve(__dirname, 'src/customer Data.html'),
        errorLogs: resolve(__dirname, 'src/error_logs.html'),
        adminManagement: resolve(__dirname, 'src/adminManagement.html'),
        privacyPolicy: resolve(__dirname, 'src/privacy-policy.html'),
        webmasterRegistration: resolve(__dirname, 'src/webmasterRegistration.html')
      }
    }
  },
  server: {
    port: 3000
  },
  publicDir: 'public'
})