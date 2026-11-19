import { userRoutes } from './user'
import { authRoutes } from './auth'

// 汇总所有模块的规则。以后加模块两步：import 进来 + 展开进数组
// 例：import { farmRoutes } from './farm'
export const mockRoutes = [...userRoutes, ...authRoutes]
