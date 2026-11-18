import { ref } from "vue";
import { defineStore } from "pinia";

// 用户模块：全局共享的登录信息（顶栏、请求、守卫都要用）
export const useUserStore = defineStore(
  "user", // 仓库名（唯一标识）
  () => {
    // ── state：仓库里存的数据（用 ref 包起来）──
    const token = ref(""); // 登录凭证，第5步请求、第7步守卫都要用
    const userName = ref("");

    // ── action：修改数据的动作（函数）──
    function login(name: string) {
      // 暂时写死假登录，第 7 步换成真接口
      userName.value = name;
      token.value = "mock-token-" + Date.now();
    }

    function logout() {
      token.value = "";
      userName.value = "";
    }

    // state 和 action 都要 return 出去，外界才拿得到
    return { token, userName, login, logout };
  },
  {
    persist: true, // ★ 持久化：自动同步到 localStorage，刷新不丢
  },
);
