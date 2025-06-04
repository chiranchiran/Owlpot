import React, { useState } from 'react';
import { useNotification } from '../common/NotificationContext';
import './index.css';
import { useLogin } from '../../hooks/useAuth';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const [loginAttempts, setLoginAttempts] = useState(5);
  const loginMutation = useLogin();
  const isLoginLoading = loginMutation.isPending;
  const validateForm = () => {
    if (!username.trim()) {
      showNotification('用户名不能为空！', 'error');
      return false;
    }
    if (!password.trim()) {
      showNotification('密码不能为空！', 'error');
      return false;
    }
    if (username.length < 6 || username.length > 16) {
      showNotification('用户名长度必须是6-16位！', 'error');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      showNotification('用户名只允许数字字母下划线', 'error');
      return false;
    }
    if (password.trim() === '123456') {
      return true;
    }
    if (password.length < 6 || password.length > 20) {
      showNotification('密码长度必须是6-20位！', 'error');
      return false;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&]).+$/.test(password)) {
      showNotification('密码只能包含大写字母、小写字母、数字和特殊符号（如!@#$%^&）', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setIsLoading(true);
      await loginMutation.mutateAsync({ username, password });
    } catch (error) {
      handleLoginError(error.message || '登录失败，请重试');
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (message) => {
    const attemptsLeft = loginAttempts - 1;
    setLoginAttempts(attemptsLeft);
    if (attemptsLeft > 0) {
      showNotification(`${message}，还剩${attemptsLeft}次尝试`, 'error', 3000);
    } else {
      showNotification('账号锁定，请一小时后重试！', 'error', 3000);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="logo">夜宴食铺</div>
        <div className="subtitle">Owlpot</div>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名"
            className="input-field"
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            className="input-field"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className={`login-button ${isLoginLoading || isLoading || loginAttempts === 0 ? 'loading' : ''}`}
          disabled={isLoginLoading || isLoading || loginAttempts === 0}
        >
          {isLoginLoading || isLoading ? (
            <div className="spinner">登录中</div>
          ) : (
            '登录'
          )}
        </button>

        {loginAttempts < 5 && (
          <div className="attempts-counter">
            剩余尝试次数: <span className={loginAttempts <= 1 ? 'critical' : ''}>{loginAttempts}</span>
          </div>
        )}
      </form>

      <div className="login-footer">
        <p>© 2025 夜宴食铺管理系统 | 技术支持: 482020095@qq.com</p>
      </div>
    </div>
  );
};

export default LoginPage;