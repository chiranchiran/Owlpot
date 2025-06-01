import React, { useState, useEffect } from 'react';
import './index.css'; // 确保你有相应的CSS样式文件

const Header = ({ onLogout, onToggleSidebar, businessStatus, onChangeBusinessStatus }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(businessStatus);

  // 更新当前日期时间
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short'
      });
      const timeStr = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
      setCurrentDateTime(`${dateStr} ${timeStr}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 60000);

    return () => clearInterval(timer);
  }, []);

  // 初始化选中状态
  useEffect(() => {
    setSelectedStatus(businessStatus);
  }, [businessStatus]);

  const openBusinessModal = () => {
    setShowBusinessModal(true);
  };

  const closeBusinessModal = () => {
    setShowBusinessModal(false);
  };

  const confirmBusinessStatusChange = () => {
    onChangeBusinessStatus(selectedStatus);
    closeBusinessModal();
  };

  return (
    <div className="header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          ☰
        </button>
        <div className="business-status">
          <span className={`status-dot ${businessStatus === '营业中' ? 'open' : 'closed'}`}></span>
          <span>{businessStatus}</span>
          <button className="change-status" onClick={openBusinessModal}>
            设置营业状态
          </button>
        </div>
        <div className="current-datetime">
          {currentDateTime}
        </div>
      </div>

      <div className="header-right"
        onMouseEnter={() => setDropdownVisible(true)}
        onMouseLeave={() => setDropdownVisible(false)}>
        <div className="admin-info">
          <div className="admin-avatar">A</div>
          <div className="admin-name">admin</div>
        </div>

        {dropdownVisible && (
          <div className="dropdown-menu">
            <div className="dropdown-item">修改密码</div>
            <div className="dropdown-item" onClick={onLogout}>退出登录</div>
          </div>
        )}
      </div>

      {/* 营业状态设置弹窗 - 严格按照图片设计 */}
      {showBusinessModal && (
        <div className="modal-overlay">
          <div className="business-modal">
            <h3>营业状态设置</h3>

            <div className="status-option">
              <label className="radio-container">
                <input
                  type="radio"
                  name="business-status"
                  checked={selectedStatus === '营业中'}
                  onChange={() => setSelectedStatus('营业中')}
                />
                <span className="checkmark"></span>
                <div className="option-content">
                  <div className="option-title">营业中</div>
                  <div className="option-description">
                    当前餐厅处于营业状态，自动接收任何订单，可点击打烊进入店铺打烊状态。
                  </div>
                </div>
              </label>
            </div>

            <div className="status-option">
              <label className="radio-container">
                <input
                  type="radio"
                  name="business-status"
                  checked={selectedStatus === '打烊中'}
                  onChange={() => setSelectedStatus('打烊中')}
                />
                <span className="checkmark"></span>
                <div className="option-content">
                  <div className="option-title">打烊中</div>
                  <div className="option-description">
                    当前餐厅处于打烊状态，仅接受营业时间内的预定订单，可点击营业中手动恢复营业状态。
                  </div>
                </div>
              </label>
            </div>

            <div className="modal-actions">
              <button className="modal-button cancel" onClick={closeBusinessModal}>取消</button>
              <button className="modal-button confirm" onClick={confirmBusinessStatusChange}>确定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;