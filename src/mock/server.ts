import type { Connect } from 'vite'

// 一条规则的形状：什么路径 + 什么方法 → 返回什么数据
export interface MockRoute {
  path: string // 如 '/users' 或带占位符的 '/users/:id'
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  handler: (ctx: MockContext) => unknown
}

// handler 里能拿到的东西
export interface MockContext {
  query: Record<string, string> // ?page=1&size=10 的参数
  params: Record<string, string> // /users/:id 里的 { id: '3' }
  body: any // POST/PUT 的请求体
}

// 引擎：把规则表变成能干活的请求处理器（机制写一次，以后不动）
export function createMockMiddleware(routes: MockRoute[]): Connect.NextHandleFunction {
  return (req, res) => {
    const url = req.url || ''
    const method = (req.method || 'GET').toUpperCase()
    const [path, queryStr = ''] = url.split('?')

    // POST/PUT 有请求体，先攒齐再处理
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      // 拿着请求去规则表里逐条匹配
      for (const route of routes) {
        const params = matchPath(route.path, path)
        if (params && route.method === method) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          try {
            // handler 正常 return → 成功响应
            const data = route.handler({
              params,
              query: Object.fromEntries(new URLSearchParams(queryStr)),
              body: body ? JSON.parse(body) : {}
            })
            res.end(JSON.stringify({ code: 0, message: 'ok', data }))
          } catch (err) {
            // handler 抛 Error → 失败响应（后端报业务错误的统一出口）
            const message = err instanceof Error ? err.message : '服务异常'
            res.end(JSON.stringify({ code: 1, message, data: null }))
          }
          return
        }
      }
      // 一条都没匹配上 → 接口不存在
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ code: 404, message: '接口不存在', data: null }))
    })
  }
}

// 匹配路径：规则 '/users/:id' vs 实际 '/users/3' → 匹配成功返回 { id: '3' }，否则 null
function matchPath(rule: string, real: string): Record<string, string> | null {
  const ruleParts = rule.split('/')
  const realParts = real.split('/')
  if (ruleParts.length !== realParts.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < ruleParts.length; i++) {
    if (ruleParts[i].startsWith(':')) {
      params[ruleParts[i].slice(1)] = realParts[i]
    } else if (ruleParts[i] !== realParts[i]) {
      return null
    }
  }
  return params
}
