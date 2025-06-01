// src/components/Dashboard/OrderOverview/index.jsx
import React from 'react';
const OrderOverview = () => {
  // 订单状态数据
  const orderStats = {
    pending: 0,
    delivering: 0,
    completed: 0,
    cancelled: 0,
    all: 0
  };

  return (
    <div className="overview-container">
      {/* 订单管理部分 */}
      <div className="order-overview">
        <div className="section-header">
          <h2>订单管理</h2>
          <div className="management-button">
            订单明细 &gt;
          </div>
        </div>

        <div className="status-tabs">
          <div className="status-tab">
            <div className="status-title">待接单</div>
            <div className="status-value">{orderStats.pending}</div>
          </div>
          <div className="status-tab">
            <div className="status-title">待派送</div>
            <div className="status-value">{orderStats.delivering}</div>
          </div>
          <div className="status-tab">
            <div className="status-title">已完成</div>
            <div className="status-value">{orderStats.completed}</div>
          </div>
          <div className="status-tab">
            <div className="status-title">已取消</div>
            <div className="status-value">{orderStats.cancelled}</div>
          </div>
          <div className="status-tab">
            <div className="status-title">全部订单</div>
            <div className="status-value">{orderStats.all}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderOverview;