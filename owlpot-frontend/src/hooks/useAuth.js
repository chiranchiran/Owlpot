// src/hooks/useAuth.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../components/common/NotificationContext';
import { login, logout, updatePassword } from '../api/auth';
import { loginUser, logoutUser } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeToken, setToken } from '../utils/localStorage';

export const useLogin = () => {
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
      setToken(data.data.token);
      showNotification('登录成功', 'success');
      navigate('/dashboard')
    }
  });
};


export const useLogout = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(logoutUser())
      removeToken();
      showNotification('已成功退出', 'success');
      navigate('/login')
    }
  })
};

export const useUpdatePassword = () => {
  const { showNotification } = useNotification();

  return useMutation({
    mutationFn: updatePassword,
    onSuccess: (data) => {
      if (data.code === 0) {
        throw new Error(data.msg || '密码修改失败');
      }
      showNotification('密码修改成功', 'success');
    },
  });
};
export const useAuthenticated = () => {
  const token = useSelector(state => state.user.token)
  return token !== null
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