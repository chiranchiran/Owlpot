import React, { use, useState, useEffect } from 'react';
import api from './api'; // 确保你有一个 API 文件
import LoginPage from './components/LoginPage';
import { NotificationProvider } from './components/common/NotificationContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import './App.css';
import RouterConfig from './routes';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { removeToken, removeRefreshToken } from './utils/cookies';
import { useSelector } from 'react-redux';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = useSelector(state => state.app.sidebar.opened)
  const isLoginPage = location.pathname === '/login' || location.pathname === '/';
  const handleLogout = () => {
    removeToken();
    removeRefreshToken()
    navigate('/login'); // 重定向到登录页面
  };

  return (
    <NotificationProvider>
      <div className="app">
        {/* 在非登录页面显示侧边栏和头部 */}
        {!isLoginPage && (
          <div className="dashboard">
            <Sidebar />
            <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
              <Header
                onLogout={handleLogout}
              />
              <div className="card">
                <RouterConfig /> {/* 路由内容 */}
                <Outlet />
              </div>
            </div>
          </div>
        )}
        {/* 在登录页面显示登录表单 */}
        {isLoginPage && <LoginPage />}
      </div>

    </NotificationProvider>
  );
}

export default App;