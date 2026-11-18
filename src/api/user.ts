import { request } from '@/request'

// 用户数据的类型约定（TS 的价值：字段名写错编辑器立刻红线）
export interface UserItem {
  id: number
  name: string
  phone: string
  role: string
}

export interface UserListResult {
  list: UserItem[]
  total: number
}

// 查：分页 + 关键词
export function getUserList(params: { page: number; size: number; keyword?: string }) {
  return request<UserListResult>({ url: '/users', method: 'get', params })
}

// 增
export function addUser(data: Omit<UserItem, 'id'>) {
  return request<null>({ url: '/users', method: 'post', data })
}

// 改
export function updateUser(id: number, data: Partial<UserItem>) {
  return request<null>({ url: `/users/${id}`, method: 'put', data })
}

// 删
export function deleteUser(id: number) {
  return request<null>({ url: `/users/${id}`, method: 'delete' })
}
