
import http from '../utils/http';
// 员工登录
export const login = (credentials) => {
  return http.post('/employees/login', credentials, { isLoginRequest: true });
};
// 员工登出
export const logout = () => {
  return http.post('/logout');
};


// 修改密码
export const updatePassword = (params) => {
  return http.put(`/employees/${params.id}/password`, params);
};