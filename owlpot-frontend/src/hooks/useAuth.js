// src/hooks/useAuth.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../components/common/NotificationContext';
import { login, logout, updatePassword } from '../api/auth';
import { loginUser, logoutUser } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleApiError } from '../utils/errorhandler';
import { removeToken, setToken } from '../utils/cookies';
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.code === 0) {
        throw new Error(data.msg || '登录失败');
      }
      dispatch(loginUser(data.data))
      queryClient.setQueryData(['user'], data.data);
      setToken(data.data.token);
      showNotification('登录成功', 'success');
      navigate('/dashboard')
    },
    onError: (error) => {
      const message = handleApiError(error);
      showNotification(message || '登录失败，请重试');
    }
  });
};


export const useLogout = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(logoutUser())
      removeToken();
      // 清除缓存数据
      queryClient.clear();
      showNotification('已成功登出', 'success');
      navigate('/login')
    },
    onError: (error) => {
      showNotification(`登出失败: ${error.message}`, 'error');
    }
  });
};

export const useUpdatePassword = () => {
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      showNotification('密码更新成功', 'success');
    },
    onError: (error) => {
      showNotification(`密码更新失败: ${error.message}`, 'error');
    }
  });
};

// // 获取当前登录用户
// export const useCurrentUser = () => {
//   return useQuery({
//     queryKey: ['user'],
//     queryFn: () => { }, // 初始数据
//     enabled: !!getToken(),
//     initialData: null,
//     staleTime: 5 * 60 * 1000,
//   });
// };