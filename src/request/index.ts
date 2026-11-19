import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { useUserStore } from "@/store/modules/user";

// 后端约定的统一响应格式：{ code, message, data }
export interface ApiResponse<T = any> {
  code: number; // 0 = 成功，其他 = 失败
  message: string;
  data: T;
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, // '/api'，从环境变量读
  timeout: 50000, // 5秒超时
});

// ── 请求拦截器：每个请求出门前，自动塞 token ──
service.interceptors.request.use((config) => {
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`;
  }
  return config;
});

// ── 响应拦截器：每个响应进门时，统一验货 ──
service.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse;
    if (res.code !== 0) {
      // 失败：统一提示（第6步换成 Element Plus 的优雅提示）
      ElMessage.error(res.message || "请求出错");
      return Promise.reject(new Error(res.message));
    }
    return res.data; // 成功：剥壳！调用方直接拿到业务数据
  },
  (error) => {
    ElMessage.error("网络异常，请稍后重试");
    return Promise.reject(error);
  },
);

// 对外的统一出口：泛型让 TS 知道"这次请求返回什么类型的数据"
export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return service(config) as Promise<T>;
}

/**
 * axios 是前后端沟通的工具，内置负责“组装请求+发送+解析响应”；
 * 而带 token 和剥壳拿业务数据，是我们自己写的两个拦截器加上的能力——这套组合
 * 就叫“axios 封装”。
 */
