// src/hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../components/common/NotificationContext';
import { login, logout, refreshUserToken, updatePassword } from '../api/auth';
import { getToken, setToken, getRefreshToken, setRefreshToken, removeToken, removeRefreshToken } from '../utils/cookies';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.data.token);
      setRefreshToken(data.data.refreshToken);
      queryClient.setQueryData(['user'], data.data.user);
      showNotification('登录成功', 'success');
    },
    onError: (error) => {
      showNotification(`登录失败: ${error.message}`, 'error');
    }
  });
};

export const useLogout = () => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // 清除本地存储
      removeToken();
      removeRefreshToken();

      // 清除缓存数据
      queryClient.clear();

      showNotification('已成功登出', 'success');
    },
    onError: (error) => {
      showNotification(`登出失败: ${error.message}`, 'error');
    }
  });
};

export const useRefreshToken = () => {
  const { showNotification } = useNotification();
  return useMutation({
    mutationFn: () => refreshUserToken(getRefreshToken()),
    onSuccess: (data) => {
      setToken(data.data.token);
      setRefreshToken(data.data.refreshToken);
    },
    onError: (error) => {
      showNotification(`令牌刷新失败: ${error.message}`, 'error');
    }
  });
};

export const useUpdatePassword = () => {
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: ({ id, passwordData }) => updatePassword(id, passwordData),
    onSuccess: () => {
      showNotification('密码更新成功', 'success');
    },
    onError: (error) => {
      showNotification(`密码更新失败: ${error.message}`, 'error');
    }
  });
};

// 获取当前登录用户
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => null, // 初始数据
    enabled: !!getToken(),
    initialData: null,
    staleTime: 5 * 60 * 1000,
  });
};