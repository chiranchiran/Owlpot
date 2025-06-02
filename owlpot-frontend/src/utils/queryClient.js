import { QueryClient } from '@tanstack/react-query';
// 创建全局 QueryClient 实例
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟缓存
      retry: 1, // 失败时重试1次
      refetchOnWindowFocus: false,
    },
    mutations: {

    }
  }
});

// 注意：移除了对 useNotification 的依赖