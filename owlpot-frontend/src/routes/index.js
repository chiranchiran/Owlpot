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
import { useAuthenticated } from '../hooks/useAuth'; // 假设你有一个useAuthenticated钩子来检查登录状态

import MainLayout from '../components/common/MainLayout'; // 添加布局组件

// 路由守卫组件
const ProtectedRoute = ({ children }) => {
  const flag = useAuthenticated();
  return flag ? children : <Navigate to="/login" replace />;
};

// 主布局组件
const MainLayoutWrapper = ({ children }) => {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};

const RouterConfig = () => {
  return useRoutes([
    { path: '/login', element: <LoginPage /> },
    { path: '/', element: <Navigate to="/login" replace /> },

    // 需要登录的路由
    {
      element: <ProtectedRoute><MainLayoutWrapper /></ProtectedRoute>,
      children: [
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/order', element: <Order /> },

        // 套餐管理
        {
          path: '/setmeal',
          element: <Setmeal />,
        }, {
          path: '/setmeal/add',
          element: <AddSetmeal />
        }, {
          path: '/setmeal/edit/:id',
          element: <AddSetmeal />
        },

        // 菜品管理
        {
          path: '/dish',
          element: <Dish />,
        }, {
          path: '/dish/add',
          element: <AddDish />
        }, {
          path: '/dish/edit/:id',
          element: <AddDish />
        },


        // 分类管理
        { path: '/category', element: <Category /> },

        // 员工管理
        {
          path: '/employee',
          element: <Employee />,
        }, {
          path: '/employee/add',
          element: <AddEmployee />
        }, {
          path: '/employee/edit/:id',
          element: <AddEmployee />
        },


        { path: '/data', element: <Data /> }
      ]
    },

    // 兜底路由
    { path: '*', element: <NotFoundPage /> }
  ]);
};

export default RouterConfig;