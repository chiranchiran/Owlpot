import React from 'react';
import { useEffect } from 'react';
import './index.css';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, isCollapsed }) => {
  const location = useLocation();

  // 确保初始渲染时就有活动状态
  useEffect(() => {
    // 如果父组件没有传递活动状态，根据当前路径设置
    if (!activeTab) {
      const pathSegments = location.pathname.split('/');
      const currentTab = pathSegments[1] || 'dashboard';
      // 这里可以调用 setActiveTab 如果组件接收这个prop
    }
  }, [activeTab, location.pathname]);
  const menuItems = [
    { id: 'dashboard', label: '工作台', icon: 'fa-dashboard' },
    { id: 'data', label: '数据统计', icon: 'fa-bar-chart' },
    { id: 'order', label: '订单管理', icon: 'fa-list-alt' },
    { id: 'setmeal', label: '套餐管理', icon: 'fa-cutlery' },
    { id: 'dish', label: '菜品管理', icon: 'fa-coffee' },
    { id: 'category', label: '分类管理', icon: 'fa-folder' },
    { id: 'employee', label: '员工管理', icon: 'fa-users' },
  ];

  return (
    <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🌙</span>
            <span className="logo-text">夜宴食铺</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map(item => (
            <NavLink to={`/${item.id}`} className={({ isActive }) => isActive ? "active menu-item" : "menu-item"} onClick={() => setActiveTab(item.id)} key={item.id}>
              <i className={`fa ${item.icon} menu-icon`}></i>
              <span className="menu-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;    