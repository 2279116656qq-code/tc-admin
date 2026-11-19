# tc-admin 接口文档

> 这份文档是前后端之间的"合同"：前端照它开发页面，后端照它实现接口。
> 当前后端是 mock 假后端（src/mock/，数据在内存里，dev server 重启后还原）；将来学 Node 时照这份合同把真后端亲手写一遍，前端零改动。

## 通用约定

| 项 | 约定 |
|---|---|
| 基准地址 | `/api`（来自 .env.development 的 VITE_BASE_API） |
| 数据格式 | 请求和响应都是 JSON |
| 登录凭证 | 登录成功后，后续所有请求带请求头 `Authorization: Bearer <token>`（前端拦截器自动加；mock 阶段后端不校验，真后端要校验） |
| 超时 | 50 秒（前端 axios 实例配置） |

### 统一响应外壳

所有接口（无论成败）HTTP 状态码都是 200，业务成败看 body：

```json
{ "code": 0, "message": "ok", "data": { } }
```

| 字段 | 类型 | 说明 |
|---|---|---|
| code | number | 0 = 成功；非 0 = 失败 |
| message | string | 失败时给人看的错误信息 |
| data | any | 业务数据，成功时才有内容 |

> 前端的 request 封装已自动剥壳并校验 code：页面代码里拿到的直接是 `data`，失败自动弹错。

---

## 一、用户模块

用户对象 UserItem：

| 字段 | 类型 | 说明 |
|---|---|---|
| id | number | 用户 id，后端自增生成 |
| name | string | 姓名 |
| phone | string | 手机号 |
| role | string | 角色（管理员 / 运营 / 访客） |

### 1. 用户列表

`GET /api/users`

**Query 参数**（拼在地址后，`?key=value&key=value`）：

| 名 | 类型 | 必填 | 说明 |
|---|---|---|---|
| page | number | 否 | 页码，默认 1 |
| size | number | 否 | 每页条数，默认 10 |
| keyword | string | 否 | 关键词，模糊匹配**姓名或手机号** |

**响应 data**：

| 字段 | 类型 | 说明 |
|---|---|---|
| list | UserItem[] | 当前页的数据（已按 page/size 切片） |
| total | number | 筛选后的总条数（不是全部条数） |

**示例**：`GET /api/users?page=1&size=5&keyword=张`

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [{ "id": 1, "name": "张三", "phone": "13800000001", "role": "管理员" }],
    "total": 1
  }
}
```

### 2. 新增用户

`POST /api/users`

**Body**（不要传 id，后端生成；新用户插到列表最前面）：

```json
{ "name": "新用户", "phone": "13800000099", "role": "运营" }
```

**响应 data**：`null`

### 3. 修改用户

`PUT /api/users/:id`（id 拼在路径上，如 `/api/users/3`）

**Body**（传什么字段改什么字段）：

```json
{ "name": "张三丰", "role": "管理员" }
```

**响应 data**：`null`

### 4. 删除用户

`DELETE /api/users/:id`

**响应 data**：`null`

---

## 二、登录模块（第 7 步使用）

### 5. 登录

`POST /api/login`

**Body**：

| 名 | 类型 | 必填 | 说明 |
|---|---|---|---|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**成功响应 data**：

| 字段 | 类型 | 说明 |
|---|---|---|
| token | string | 登录凭证，前端存进 Pinia 持久化 |
| userName | string | 展示用的用户名 |
| role | string | 角色 |

**失败**：`{ "code": 1, "message": "用户名或密码错误", "data": null }`

**mock 阶段测试账号**：任意用户名 + 密码 `123456`

---

## 三、错误码汇总

| code | 含义 |
|---|---|
| 0 | 成功 |
| 1 | 业务失败（message 说明原因） |
| 404 | 接口不存在（路径或方法写错） |

---

## 四、给未来写真后端的你

- 这份文档就是合同：路径、字段名、行为都要一致，前端才能零改动接入
- mock 的数据在内存里、dev server 重启就还原；真后端要把 users 存进 MySQL
- mock 的 token 是拼的字符串；真后端用 JWT 签发和校验（第 6 个月学）
- 真后端还欠一笔账：校验每个请求的 token，过期时返回约定信号让前端踢回登录页（第 7 步会先在前端把这条逻辑写好）
