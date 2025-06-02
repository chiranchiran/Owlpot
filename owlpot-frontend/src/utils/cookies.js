import Cookies from 'js-cookie';
// 侧边栏状态
const sidebarStatusKey = 'sidebar_status';
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey);
export const setSidebarStatus = (status) => Cookies.set(sidebarStatusKey, status);


// 用户Token
const tokenKey = 'token';
export const getToken = () => Cookies.get(tokenKey);
export const setToken = (token) => Cookies.set(tokenKey, token);
export const removeToken = () => Cookies.remove(tokenKey);

// 检查是否已认证
export const isAuthenticated = () => {
  return !!getToken('token');
};

// // 打印信息（存储为JSON）
// const printKey = 'print_info';
// export const getPrint = () => {
//   const value = Cookies.get(printKey);
//   return value ? JSON.parse(value) : null;
// };

// export const setPrint = (info) => {
//   Cookies.set(printKey, JSON.stringify(info));
// };

// export const removePrint = () => {
//   Cookies.remove(printKey);
// };

