import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="error-container">
        <div className="error-code">404</div>
        <div className="error-message">抱歉，您访问的页面不存在</div>
        <div className="error-description">
          您可以检查URL是否正确，或返回首页重新开始浏览
        </div>
        <Link to="/">
          <button className="home-button">返回首页</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;