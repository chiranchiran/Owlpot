// src/utils/http.js
import axios from 'axios';
import { getToken } from './cookies';
// 创建 Axios 实例
export const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  timeout: 15000, // 15秒超时
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 Token
http.interceptors.request.use(
  (config) => {
    // 检查是否为登录请求，如果是则跳过添加 Authorization 头
    if (!config.isLoginRequest) {
      // 获取访问令牌
      const accessToken = getToken('token');

      // 如果存在令牌，添加到请求头
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    // 添加请求时间戳防止缓存
    config.headers['X-Request-Timestamp'] = Date.now();

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理 Token 刷新
http.interceptors.response.use(
  (response) => {
    // 直接返回响应数据
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // 401 未授权错误处理 - 尝试刷新令牌
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {

        if (newToken) {
          // 更新请求头中的令牌
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // 重试原始请求
          return http(originalRequest);
        }
      } catch (refreshError) {
        // 刷新令牌失败，执行登出操作
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 封装常用 HTTP 方法
const httpService = {
  get: (url, params, config = {}) => http.get(url, { ...config, params }),
  post: (url, data, config = {}) => http.post(url, data, config),
  put: (url, data, config = {}) => http.put(url, data, config),
  patch: (url, data, config = {}) => http.patch(url, data, config),
  delete: (url, config = {}) => http.delete(url, config),
  request: (config) => http.request(config),
};

export default httpService;