import React, { use, useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import { NotificationProvider } from './components/common/NotificationContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import RouterConfig from './routes';
import { useNavigate, useLocation } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [businessStatus, setBusinessStatus] = useState('营业中');
  // 根据当前路由路径更新活动标签
  useEffect(() => {
    // 从路径中提取当前标签
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    let currentTab = '';

    // 定义有效的主菜单路径
    const mainMenuPaths = [
      'dashboard', 'order', 'setmeal',
      'dish', 'category', 'employee', 'data'
    ];

    // 检查当前路径是否匹配主菜单
    if (pathSegments.length > 0) {
      if (mainMenuPaths.includes(pathSegments[0])) {
        currentTab = pathSegments[0];
      }
    }

    // 特殊处理：如果路径是根路径，默认为dashboard
    if (location.pathname === '/' || location.pathname === '/dashboard') {
      currentTab = 'dashboard';
    }

    // 更新活动标签
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [location.pathname, activeTab]);
  // 检查当前是否是登录页面
  const isLoginPage = location.pathname === ('/login' || '/');

  // 检查用户是否已登录（通过localStorage）
  const isAuthenticated = localStorage.getItem('authToken');

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const changeBusinessStatus = (status) => {
    setBusinessStatus(status);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // 清除登录状态
    navigate('/login'); // 重定向到登录页面
  };

  return (
    <NotificationProvider>
      <div className="app">
        {/* 在非登录页面显示侧边栏和头部 */}
        {!isLoginPage && isAuthenticated && (
          <div className="dashboard">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isCollapsed={collapsed}
            />
            <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
              <Header
                onLogout={handleLogout}
                onToggleSidebar={toggleSidebar}
                businessStatus={businessStatus}
                onChangeBusinessStatus={changeBusinessStatus}
              />
              <div className="card">
                <RouterConfig /> {/* 路由内容 */}
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