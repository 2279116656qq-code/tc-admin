<template>
  <div class="layout">
    <!-- 左侧边栏 -->
    <aside class="layout-sidebar">
      <div class="logo">TC-Admin</div>
      <nav>
        <router-link to="/home">🏠 首页</router-link>
        <router-link to="/user">👥 用户管理</router-link>
      </nav>
    </aside>
    <!-- 右侧：顶栏 + 内容区 -->
    <div class="layout-right">
      <header class="layout-header">
        <span>TC-Admin 管理系统</span>
        <div class="header-right">
          <!-- 已登录：显示用户名 + 退出 -->
          <template v-if="userStore.token">
            <span class="user-name">{{ userStore.userName }}</span>
            <button @click="userStore.logout()">退出登录</button>
          </template>
          <!-- 未登录：模拟登录按钮 -->
          <button v-else @click="userStore.login('李爽')">模拟登录</button>
        </div>
      </header>
      <main class="layout-content">
        <router-view />
        <!-- ★ 子页面在这里切换 -->
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";

// 拿到仓库的引用——从此这个组件可以随意读写仓库
const userStore = useUserStore();
</script>

<style scoped lang="scss">
@use "@/styles/variables.scss" as *;

.layout {
  display: flex;
  height: 100%;
}

.layout-sidebar {
  width: $sidebar-width; // ← 第2步定义的变量，用上了！
  background: #001529;
  .logo {
    height: $header-height;
    line-height: $header-height;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
  nav {
    display: flex;
    flex-direction: column;
    padding: 12px;
    a {
      color: rgba(255, 255, 255, 0.7);
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 4px;
      &:hover {
        // ← SCSS 嵌套：hover 直接写在 a 里面
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }
      &.router-link-active {
        // ← vue-router 自动给当前页链接加的类
        color: #fff;
        background: $primary-color;
      }
    }
  }
}

.layout-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-header {
  height: $header-height;
  background: #fff;
  border-bottom: 1px solid $border-color;
}
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;

  .user-name {
    color: $primary-color;
    font-weight: bold;
    margin-right: 12px;
  }
}
.layout-content {
  flex: 1;
  padding: 16px;
  background: $bg-color;
  overflow: auto;
}
</style>
