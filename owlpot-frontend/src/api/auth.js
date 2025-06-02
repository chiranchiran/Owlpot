
import http from '../utils/http';
// 员工登录
export const login = (credentials) => {
  return http.post('/employees/login', credentials, { isLoginRequest: true });
};
// 员工登出
export const logout = () => {
  return http.post('/logout');
};

// 刷新令牌
export const refreshUserToken = (refreshToken) => {
  return http.post('/user/refresh', { refreshToken: refreshToken });
};

// 修改密码
export const updatePassword = (id, passwordData) => {
  return http.put(`/employees/${id}`, passwordData);
};