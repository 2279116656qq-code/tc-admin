import { createApp } from "vue";
import App from "./App.vue";
import { setupRouter } from "@/router";
import "@/styles/index.scss";

function main() {
  const app = createApp(App);
  setupRouter(app); // 装配路由（仿 chmc-web 的组装风格）
  app.mount("#app");
}

main();
// index.html 指路给 main.ts
//   → main.ts 创建 App 应用、装上路由、挂载上墙
//     → App.vue 只留一个出口，路由往里塞 Layout 外壳
//       → Layout 中间再留一个出口，往里塞子页面 home / user
