// src/components/DataCards.js
import React from 'react';
import './index.css'; // 确保你有相应的CSS样式文件
const TodayData = () => {
  const stats = [
    { title: '营业额', value: '¥2,856', change: '+12.5%' },
    { title: '有效订单', value: '128', change: '+8.3%' },
    { title: '订单完成率', value: '96.2%', change: '+2.1%' },
    { title: '平均客单价', value: '¥78.5', change: '+5.2%' },
    { title: '新增用户', value: '42', change: '+15.6%' },
  ];

  return (
    <div className="data-cards">
      <div className="section-header">
        <h2>今日数据</h2>
        <div className="management-button">
          详细数据 &gt;
        </div>
      </div>

      <div className="cards-container">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-change positive">{stat.change}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayData;