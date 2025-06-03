import React, { useState, useEffect } from 'react';
import './index.css'; // 确保你有相应的CSS样式文件
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, setStatus, } from '../../../redux/slices/index'; // 导入 Redux actions
import { useLogout } from '../../../hooks/useAuth';
import { useShopStatus, useUpdateShopStatus } from '../../../hooks/useShop'; // 引入封装的hook
import { updatePassword } from '../../../api';

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const businessStatus = useSelector(state => state.app.status); // 从 Redux 获取营业状态
  const { id, role, name } = useSelector(state => state.user); // 从 Redux 获取用户信息
  const [selectedStatus, setSelectedStatus] = useState(businessStatus);
  const dispatch = useDispatch();
  const { data: shopStatusData, isLoading: isStatusLoading } = useShopStatus();
  const { mutate: updateStatus, isLoading: isUpdatingStatus } = useUpdateShopStatus();

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
    if (shopStatusData !== undefined) {
      setSelectedStatus(shopStatusData);
      dispatch(setStatus(shopStatusData));
    }
  }, [shopStatusData, dispatch]);

  const openBusinessModal = () => {
    setShowBusinessModal(true);
  };

  const closeBusinessModal = () => {
    setShowBusinessModal(false);
  };

  const confirmBusinessStatusChange = () => {
    updateStatus(selectedStatus);
    closeBusinessModal();
  };

  const changePwd = () => {
    // 这里可以添加修改密码的逻辑
    // updatePassword(id, { id, oldPwd, newPwd })
    console.log('修改密码');
  }

  return (
    <div className="header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="business-status">
          {isStatusLoading ? (
            <span>加载中...</span>
          ) : (
            <>
              <span className={`status-dot ${shopStatusData === 1 ? 'open' : 'closed'}`}></span>
              <span>{shopStatusData === 1 ? '营业中' : '打烊中'}</span>
              <button className="change-status" onClick={openBusinessModal} disabled={isUpdatingStatus}>
                {isUpdatingStatus ? '更新中...' : '设置营业状态'}
              </button>
            </>
          )}
        </div>
        <div className="current-datetime">
          {currentDateTime}
        </div>
      </div>

      <div className="header-right"
        onMouseEnter={() => setDropdownVisible(true)}
        onMouseLeave={() => setDropdownVisible(false)}>
        <div className="admin-info">
          <div className="admin-avatar">{role === 1 ? "A" : "E"}</div>
          <div className="admin-name">{name}</div>
        </div>

        {dropdownVisible && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={changePwd}>修改密码</div>
            <div className="dropdown-item" onClick={useLogout}>退出登录</div>
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
                  checked={selectedStatus === 1}
                  onChange={() => setSelectedStatus(1)}
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
                  checked={selectedStatus === 0}
                  onChange={() => setSelectedStatus(0)}
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
              <button className="modal-button confirm" onClick={confirmBusinessStatusChange} disabled={isUpdatingStatus}>
                {isUpdatingStatus ? '更新中...' : '确定'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;