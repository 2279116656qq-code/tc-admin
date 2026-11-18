import type { App } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const store = createPinia();
store.use(piniaPluginPersistedstate); // 给所有仓库启用持久化

// 老朋友了：和 setupRouter 一样的组装风格
export function setupStore(app: App) {
  app.use(store);
}
