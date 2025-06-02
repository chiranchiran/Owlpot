import React, { useState } from 'react';
import { useNotification } from '../common/NotificationContext';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/slices/userSlice';
import { useLogin } from '../../hooks/useAuth'; // 假设你的自定义钩子在这个文件中，需要替换成实际路径
import { useQueryClient, useMutation } from '@tanstack/react-query'; // 如果没有导入，需要添加


const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const loginMutation = useLogin();
  const isLoginLoading = loginMutation.isPending; // v5 使用 isPending

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

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      // 修改：等待 mutation 完成并获取返回数据
      const userData = await loginMutation.mutateAsync({ username, password });

      // 直接使用返回数据更新 Redux（不再需要 queryClient 获取）
      dispatch(loginUser({
        token: userData.data.token,
        roles: userData.data.user.role,   // 注意数据结构
        username: userData.data.user.username
      }));

      navigate('/dashboard', { state: { user: userData.data.user } });
    } catch (error) {
      handleLoginError(error.message || '登录失败，请重试');
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    handleLogin();
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
          />
        </div>

        <button
          type="submit"
          className={`login-button ${isLoginLoading || isLoading ? 'loading' : ''}`}
          disabled={isLoginLoading || isLoading}
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