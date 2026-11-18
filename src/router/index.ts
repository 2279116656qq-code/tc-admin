import type { App } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/layout/index.vue";

// 路由表：网址 → 页面 的对照表
const routes = [
  {
    path: "/",
    component: Layout, // 父路由：页面外壳
    redirect: "/home", // 访问 / 时自动跳到 /home
    children: [
      // 子路由：渲染在壳中间
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: { title: "首页" },
      },
      {
        path: "user",
        name: "user",
        component: () => import("@/views/user/index.vue"),
        meta: { title: "用户管理" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(), // hash 模式：网址带 # 号，部署最省心
  routes,
});

// 仿 chmc-web 的组装风格：导出安装函数，在 main.ts 里统一装配
export function setupRouter(app: App) {
  app.use(router);
}

export { router };
