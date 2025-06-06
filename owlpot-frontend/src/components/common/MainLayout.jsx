import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const collapsed = useSelector(state => state.app.sidebar.closed);

  // 检查是否是登录页面
  const isLoginPage = location.pathname === '/login' || location.pathname === '/';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <Header />
        <div className="card">
          {/* 使用 Outlet 渲染嵌套路由 */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;