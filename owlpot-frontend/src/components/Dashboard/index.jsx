import React, { useState } from 'react';
import TodayData from './TodayData';
import OrderManagement from './OrderManagement';
import DishOverview from './DishOverview';
import OrderOverview from './OrderOverview';
import './index.css'; // 确保你有相应的CSS样式文件

const Dashboard = () => {
  return (
    <div class="card">
      <TodayData />
      <OrderOverview />
      <DishOverview />
      <OrderManagement />
    </div>
  );
};

export default Dashboard;