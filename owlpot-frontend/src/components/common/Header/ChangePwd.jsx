import React, { useState } from 'react';
import { useUpdatePassword } from '../../../hooks/useAuth';
import { useNotification } from '../../common/NotificationContext';

const ChangePwd = ({ onClose, title, id, username }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { showNotification } = useNotification();
  const { mutate: updatePasswordMutation, isLoading } = useUpdatePassword();
  const handleSubmit = (e) => {
    e.preventDefault();

    // 密码格式校验
    if (!oldPassword.trim()) {
      showNotification('旧密码不能为空', 'error');
      return;
    }
    if (!newPassword.trim()) {
      showNotification('新密码不能为空', 'error');
      return;
    }
    if (!confirmNewPassword.trim()) {
      showNotification('请再次输入新密码', 'error');
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 20) {
      showNotification('新密码长度必须是6-20位', 'error');
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&]).+$/.test(newPassword)) {
      showNotification('新密码必须包含大写字母、小写字母、数字和特殊符号(!@#$%^&)', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showNotification('两次输入的新密码不一致', 'error');
      return;
    }
    // 发送网络请求
    updatePasswordMutation({
      id,
      oldPassword,
      newPassword,
    });
  };

  return (
    <div className="add-category-modal">
      <div className="modal-header">
        <h3>{title}</h3>
        <span className="close-button" onClick={onClose}>×</span>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit} autoComplete="new-password">
          {/* 隐藏的用户名输入框，用于密码管理器识别当前用户 */}
          <input
            type="hidden"
            name="username"
            value={username}
            autoComplete="username"
            aria-hidden="false"
          />

          <div className="form-group">
            <label htmlFor="oldPassword">* 旧密码:</label>
            <input
              type="password"
              id="oldPassword"
              placeholder="请输入旧密码"
              value={oldPassword}
              autoComplete="current-password"
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">* 新密码:</label>
            <input
              type="password"
              id="newPassword"
              placeholder="请输入新密码"
              value={newPassword}
              autoComplete="new-password"
              onChange={(e) => setNewPassword(e.target.value)}
              minLength="6"
              maxLength="20"
              // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$"
              required
            />
            <p className="password-hint">长度6-20位，包含大写字母、小写字母、数字和特殊符号(!@#$%^&)</p>
          </div>

          <div className="form-group">
            <label htmlFor="confirmNewPassword">* 再次输入新密码:</label>
            <input
              type="password"
              id="confirmNewPassword"
              placeholder="请再次输入新密码"
              value={confirmNewPassword}
              autoComplete="new-password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>

          {/* 表单提交按钮移至表单内部 */}
          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>取消</button>
            <button
              className="confirm-button"
              type="submit"
            >
              {isLoading ? '修改中...' : '确认修改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePwd;