import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // 根据模式加载对应的环境配置
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@styles': path.resolve(__dirname, '../styles')
      },
    },
    server: {
      port: 5173,
      open: true,
      // 开发环境代理配置
      proxy: {
        '/api': {
          // 开发环境使用本地 Node.js 服务器
          target: env.API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          // 如果 VERCEL_URL 存在（生产环境），不代理
          bypass: (req) => {
            if (env.VERCEL_URL) {
              return req.url
            }
          }
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    },
    define: {
      // 只将需要的环境变量传递给前端（防止泄露敏感信息）
      'import.meta.env.APP_NAME': JSON.stringify(env.APP_NAME || 'EasyFolio'),
      'import.meta.env.APP_VERSION': JSON.stringify(env.APP_VERSION || '1.0.0'),
      'import.meta.env.NODE_ENV': JSON.stringify(mode)
    }
  }
})
