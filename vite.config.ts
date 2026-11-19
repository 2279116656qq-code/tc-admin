import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig, type Plugin } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createMockMiddleware } from "./src/mock/server";
import { mockRoutes } from "./src/mock";

// 假后端插件：拦截 /api 请求，交给 mock 引擎处理
function mockApiPlugin(): Plugin {
  return {
    name: "mock-api",
    configureServer(server) {
      server.middlewares.use("/api", createMockMiddleware(mockRoutes));
    },
  };
}

export default defineConfig({
  plugins: [
    vue(),
    mockApiPlugin(),
    // 搬运工A：模板里写 <el-xxx> 自动引入组件
    Components({
      resolvers: [ElementPlusResolver()],
      dts: "src/components.d.ts", // 自动生成的"组件点名册"
    }),
    // 搬运工B：script 里直接写 ElMessage 这类函数自动引入
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: "src/auto-imports.d.ts", // 自动生成的"函数点名册"
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
