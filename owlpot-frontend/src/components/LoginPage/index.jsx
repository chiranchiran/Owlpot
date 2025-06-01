import React, { useState } from 'react';
import { useNotification } from '../common/NotificationContext';
import './index.css'; // 确保你有相应的CSS样式文件
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { showNotification } = useNotification();


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showNotification('用户名和密码不能为空', 'error');
      return;
    }

    if (username === 'admin' && password === '123456') {
      localStorage.setItem('authToken', 'your-auth-token'); // 模拟登录成功，存储token
      navigate('/dashboard'); // 登录成功后重定向到仪表盘
      showNotification('登录成功！欢迎回来', 'success');
    } else {
      showNotification('用户名或密码错误', 'error');
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
          />
        </div>

        <button type="submit" className="login-button">登录</button>
      </form>

      <div className="login-footer">
        <p>© 2025 夜宴食铺管理系统 | 技术支持: 482020095@qq.com</p>
      </div>
    </div>
  );
};

export default LoginPage;