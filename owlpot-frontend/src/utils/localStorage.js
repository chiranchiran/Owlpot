import { useSelector } from "react-redux";


// 侧边栏状态
const sidebarStatusKey = 'sidebar';
export const getSidebarStatus = () => localStorage.getItem(sidebarStatusKey);
export const setSidebarStatus = (status) => localStorage.setItem(sidebarStatusKey, status);

// 用户Token
const tokenKey = 'token';
export const getToken = () => localStorage.getItem(tokenKey);
export const setToken = (token) => localStorage.setItem(tokenKey, token);
export const removeToken = () => localStorage.removeItem(tokenKey);

// 检查是否已认证


// // 打印信息（存储为JSON）
// const printKey = 'print_info';
// export const getPrint = () => {
//   const value = localStorage.getItem(printKey);
//   return value ? JSON.parse(value) : null;
// };

// export const setPrint = (info) => {
//   localStorage.setItem(printKey, JSON.stringify(info));
// };

// export const removePrint = () => {
//   localStorage.removeItem(printKey);
// };