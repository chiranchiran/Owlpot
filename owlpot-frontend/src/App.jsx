import React, { use, useState, useEffect } from 'react';
import api from './api'; // 确保你有一个 API 文件
import LoginPage from './components/LoginPage';
import { NotificationProvider } from './components/common/NotificationContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import './App.css';
import RouterConfig from './routes';
import { useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function App() {
  const location = useLocation();
  const collapsed = useSelector(state => state.app.sidebar.closed)
  const isLoginPage = location.pathname === '/login' || location.pathname === '/';
  return (
    <NotificationProvider>
      <div className="app">
        <RouterConfig /> {/* 路由内容 */}
      </div>
    </NotificationProvider>
  );
}

export default App;