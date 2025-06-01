import React from 'react';

const DishOverview = () => {
  // 菜品总览数据
  const dishStats = {
    enabled: 24,
    disabled: 0
  };

  // 套餐总览数据
  const comboStats = {
    enabled: 0,
    disabled: 0
  };

  return (
    <div className="overview-container">
      {/* 菜品总览部分 */}
      <div className="dish-overview">
        <div className="section-header">
          <h2>菜品总览</h2>
          <div className="actions">
            <button className="management-button">菜品管理 &gt;</button>
            <button className="add-button">新增菜品</button>
          </div>
        </div>

        <div className="status-cards">
          <div className="status-card">
            <div className="status-title">已启售</div>
            <div className="status-value">{dishStats.enabled}</div>
          </div>
          <div className="status-card">
            <div className="status-title">已停售</div>
            <div className="status-value">{dishStats.disabled}</div>
          </div>
        </div>
      </div>

      {/* 套餐总览部分 */}
      <div className="combo-overview">
        <div className="section-header">
          <h2>套餐总览</h2>
          <div className="actions">
            <button className="management-button">套餐管理 &gt;</button>
            <button className="add-button">新增套餐</button>
          </div>
        </div>

        <div className="status-cards">
          <div className="status-card">
            <div className="status-title">已启售</div>
            <div className="status-value">{comboStats.enabled}</div>
          </div>
          <div className="status-card">
            <div className="status-title">已停售</div>
            <div className="status-value">{comboStats.disabled}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishOverview;