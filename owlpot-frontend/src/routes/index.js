import { useRoutes, Navigate } from 'react-router-dom';
import React from 'react';
import LoginPage from '../components/LoginPage';
import Dashboard from '../components/Dashboard';
import Order from '../components/Order';
import Setmeal from '../components/Setmeal';
import AddSetmeal from '../components/AddSetmeal';
import Dish from '../components/Dish';
import AddDish from '../components/AddDish';
import Category from '../components/Category';
import Employee from '../components/Employee';
import AddEmployee from '../components/AddEmployee';
import Data from '../components/Data';
import NotFoundPage from '../components/NotFoundPage';
import { useSelector } from 'react-redux';

// 路由守卫组件
const ProtectedRoute = ({ children }) => {
  // 从 Redux 中获取 token
  const token = useSelector((state) => state.user.token);
  return token ? children : <Navigate to="/login" replace />;
};

const RouterConfig = () => {
  return useRoutes([
    { path: '/login', element: <LoginPage /> },
    { path: '/', element: <Navigate to="/dashboard" replace /> },

    // 需要登录的路由
    {
      path: '/dashboard',
      element: <ProtectedRoute><Dashboard /></ProtectedRoute>
    },
    {
      path: '/order',
      element: <ProtectedRoute><Order /></ProtectedRoute>
    },

    // 套餐管理
    {
      path: '/setmeal',
      element: <ProtectedRoute><Setmeal /></ProtectedRoute>,
      children: [
        { path: 'add', element: <AddSetmeal /> },
        { path: ':id', element: <AddSetmeal /> } // 复用编辑组件
      ]
    },

    // 菜品管理
    {
      path: '/dish',
      element: <ProtectedRoute><Dish /></ProtectedRoute>,
      children: [
        { path: 'add', element: <AddDish /> },
        { path: ':id', element: <AddDish /> }
      ]
    },

    // 分类管理
    {
      path: '/category',
      element: <ProtectedRoute><Category /></ProtectedRoute>,
    },

    // 员工管理
    {
      path: '/employee',
      element: <ProtectedRoute><Employee /></ProtectedRoute>,
      children: [
        { path: 'add', element: <AddEmployee /> },
        { path: ':id', element: <AddEmployee /> } // 编辑路由
      ]
    },

    {
      path: '/data',
      element: <ProtectedRoute><Data /></ProtectedRoute>
    },

    // 兜底路由
    { path: '*', element: <NotFoundPage /> }
  ]);
};

export default RouterConfig;