import type { MockRoute } from './server'

// ── 内存"数据库" ──
let nextId = 9
const users = [
  { id: 1, name: '张三', phone: '13800000001', role: '管理员' },
  { id: 2, name: '李四', phone: '13800000002', role: '运营' },
  { id: 3, name: '王五', phone: '13800000003', role: '运营' },
  { id: 4, name: '赵六', phone: '13800000004', role: '访客' },
  { id: 5, name: '孙七', phone: '13800000005', role: '管理员' },
  { id: 6, name: '周八', phone: '13800000006', role: '访客' },
  { id: 7, name: '吴九', phone: '13800000007', role: '运营' },
  { id: 8, name: '郑十', phone: '13800000008', role: '访客' }
]

// ── 规则表：像写路由表一样写接口 ──
export const userRoutes: MockRoute[] = [
  {
    path: '/users',
    method: 'GET',
    handler: ({ query }) => {
      // 列表：关键词过滤 + 分页
      const keyword = query.keyword || ''
      const page = Number(query.page || 1)
      const size = Number(query.size || 10)
      const filtered = users.filter(
        (u) => !keyword || u.name.includes(keyword) || u.phone.includes(keyword)
      )
      return {
        list: filtered.slice((page - 1) * size, page * size),
        total: filtered.length
      }
    }
  },
  {
    path: '/users',
    method: 'POST',
    handler: ({ body }) => {
      // 新增（插到最前面，方便看到效果）
      users.unshift({ id: nextId++, ...body })
      return null
    }
  },
  {
    path: '/users/:id',
    method: 'PUT',
    handler: ({ params, body }) => {
      // 修改
      const idx = users.findIndex((u) => u.id === Number(params.id))
      if (idx > -1) users[idx] = { ...users[idx], ...body }
      return null
    }
  },
  {
    path: '/users/:id',
    method: 'DELETE',
    handler: ({ params }) => {
      // 删除
      const idx = users.findIndex((u) => u.id === Number(params.id))
      if (idx > -1) users.splice(idx, 1)
      return null
    }
  }
]
