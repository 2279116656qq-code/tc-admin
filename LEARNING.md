# tc-admin 学习档案（AI 助手请先读我）

> 这个文件是给"任何一台电脑上的 AI 助手"的交接文档。换电脑继续学习时，让 AI 先读完本文件，即可无缝接上。

## 项目背景

- 学习者：前端新手，全职自学（每天 8 小时），目标 6 个月全栈（后端选 Node.js）
- 项目：仿公司项目 chmc-web（参考项目在原电脑 D:\YG\chmc-web，换电脑后无需它，结构已定）搭建的后台管理系统骨架
- 技术栈：Vue3 + TypeScript + Vite + SCSS + Pinia(持久化) + vue-router(hash) + axios + 自研 mock 假后端
- 仓库：https://github.com/2279116656qq-code/tc-admin

## 教学约定（重要）

1. **AI 只讲解 + 给指令，学习者自己动手执行**（不代写不代跑，除非学习者明确说"这段你直接写"）
2. 解释用大白话 + 生活类比（毛坯房/剧院银幕/海关等类比已被验证有效）
3. 每条命令要说明"这是在干什么、为什么"
4. 报错时先教读报错（错误码 + 人话描述），再给解法
5. 每完成一步提醒 git 三连：`git add . && git commit -m "feat: xxx" && git push`
6. 学习者隔一段会问"这步干了什么"要回顾——用分层全景图 + 一句话复述

## 七步计划与进度

- ✅ 第1步：Vite 初始化 + 目录骨架 + @ 别名（vite.config.ts alias + tsconfig.app.json 的 paths；新版 TS 已弃用 baseUrl，不要加）
- ✅ 第2步：SCSS 样式系统（src/styles/：variables/reset/index，@use 语法）
- ✅ 第3步：路由 + Layout 布局（嵌套路由、懒加载、setupRouter 组装风格；两块银幕渲染链已透彻理解）
- ✅ 第4步：Pinia + pinia-plugin-persistedstate（store/modules/user.ts + store/index.ts；顶栏模拟登录/退出已跑通）
- ✅ 第5步：axios 封装 + mock 假后端
  - src/request/index.ts：请求拦截器自动带 Bearer token、响应拦截器剥壳 {code,message,data}、request<T> 泛型出口
  - src/mock/：server.ts 引擎（规则匹配 + :id 占位符）+ user.ts（8条假数据 + 增删改查4规则）+ index.ts 汇总；vite.config.ts 里 mockApiPlugin 接线（configureServer 拦截 /api）
  - src/api/user.ts：getUserList/addUser/updateUser/deleteUser 四函数
  - .env.development：VITE_BASE_API=/api
  - ⚠️ 若 git log 中无 "axios封装与mock假后端" 提交：先让学习者做三验证（Console 打印列表 / Network 看 Response 格式 / Request Headers 看 Authorization）再提交

## 接口文档工作流（2026-11-19 起，学习者本人提出）

- **后端（src/mock）和接口文档（docs/api.md）由 AI 负责维护**，学习者照文档开发前端（教学模式在后端部分豁免）
- 学习者的计划：前端学完后，学 Node 时照同一份 docs/api.md 亲手实现真后端（合同不变，换实现方）
- mock 引擎已升级：handler 抛 Error = 失败响应（code:1），正常 return = 成功（code:0）
- 已有接口：GET/POST /api/users、PUT/DELETE /api/users/:id、POST /api/login（测试密码 123456，第7步接）

## 待教步骤

- 🔶 第6步：用户管理 CRUD 页面
  - ✅ 6A：element-plus + unplugin 自动按需引入（src/ 下自动生成 components.d.ts / auto-imports.d.ts 点名册，要随仓库提交）
  - ✅ 6B：表格+搜索+分页（commit "用户列表页(表格+搜索+分页)"）；App.vue 用 el-config-provider 配中文包（可三层展开定制措辞）
  - ⏳ 6C：删除确认 → 新增/编辑弹窗 → alert 换 ElMessage
- ⏳ 第7步：登录页 + src/permission.ts 路由守卫（未登录跳登录页、白名单）、user store 的 login 换成真弹窗表单、响应拦截器加"登录过期跳转登录页"（chmc-web 的 code 901 同款逻辑）
- 加餐（7步学完后再说）：文件流下载、按状态码细分报错提示、svg 雪碧图、真·动态路由(addRoute)、多模块统一缓存清理

## 学习者特点

- 会犯的典型错：指令说"改造文件"却新建了文件；commit 忘带 -m 掉进 Vim（逃生：Esc → :q! → 回车）；跳步（没 init 就 push）
- GitHub 偶发 errno 10054 网络重置：重试即可，学习者电脑可连 GitHub
- 终端常见 ^C：提醒 pnpm dev 是否被误停
