// src/utils/http.js
import axios from 'axios';
import { getToken } from './cookies';
import { handleApiError } from './errorhandler';
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
    // console.log(`发送请求: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('请求发出:', config.data);
    debugger;
    // 跳过登录请求的 Token 添加
    if (!config.isLoginRequest) {
      const accessToken = getToken('token');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        console.warn('未找到 Token，但请求不是登录请求');
      }
    }
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 
http.interceptors.response.use(
  (response) => {
    console.log(`请求成功: ${response.config.url}`, response.status);
    return response.data;
  },
  (error) => {
    const originalRequest = error.config;
    // 错误处理增强
    const errorInfo = {
      message: error.message,
      code: error.code,
      config: error.config,
      response: error.response,
    };

    console.error('请求错误:', errorInfo);

    // 处理 401 未授权错误
    if (error.response?.status === 401) {

      // 如果是登录请求的 401，不跳转（由页面处理错误）
      if (!originalRequest.isLoginRequest) {

        // 非登录请求的 401，重定向到登录页
        window.location.href = '/login';
      }
      return Promise.reject(new Error('未授权，请重新登录'));
    }
    // 处理其他错误
    return Promise.reject(new Error(handleApiError(error)));
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