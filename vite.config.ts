import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig, type Plugin } from 'vite'
import { createMockMiddleware } from './src/mock/server'
import { mockRoutes } from './src/mock'

// 假后端插件：拦截 /api 请求，交给 mock 引擎处理
function mockApiPlugin(): Plugin {
  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use('/api', createMockMiddleware(mockRoutes))
    }
  }
}

export default defineConfig({
  plugins: [vue(), mockApiPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
