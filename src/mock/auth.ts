import type { MockRoute } from './server'

// ── 登录：第 7 步前端接上。mock 阶段测试密码 123456 ──
export const authRoutes: MockRoute[] = [
  {
    path: '/login',
    method: 'POST',
    handler: ({ body }) => {
      const { username, password } = body
      if (username && password === '123456') {
        return {
          token: 'mock-token-' + Date.now(),
          userName: username,
          role: 'admin'
        }
      }
      // 抛错 = 后端报业务错误，引擎会接住并包成 code:1 的失败响应
      throw new Error('用户名或密码错误')
    }
  }
]
