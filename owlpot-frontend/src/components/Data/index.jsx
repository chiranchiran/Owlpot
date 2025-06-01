import React, { useState } from 'react';
import './index.css';
import RevenueStatistics from './RevenueStatistics';
import UserStatistics from './UserStatistics';
import OrderStatistics from './OrderStatistics';
import SalesTop10 from './SalesTop10';

const Data = () => {
  const [selectedTime, setSelectedTime] = useState('近7日');
  const [startDate, setStartDate] = useState('2025-05-24');
  const [endDate, setEndDate] = useState('2025-05-30');

  const handleTimeTabClick = (time) => {
    setSelectedTime(time);
    // 根据不同时间选项设置对应日期范围
    if (time === '昨日') {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      setStartDate(yesterday.toISOString().split('T')[0]);
      setEndDate(yesterday.toISOString().split('T')[0]);
    }
  };
  const handleExportData = () => {
    // 模拟数据
    const revenueData = [
      { date: '2025-05-24', revenue: 1200 },
      { date: '2025-05-25', revenue: 1900 },
      { date: '2025-05-26', revenue: 1500 },
      { date: '2025-05-27', revenue: 2100 },
      { date: '2025-05-28', revenue: 1800 },
      { date: '2025-05-29', revenue: 2300 },
      { date: '2025-05-30', revenue: 2500 },
    ];

    const userData = [
      { date: '2025-05-24', totalUsers: 1250, newUsers: 50 },
      { date: '2025-05-25', totalUsers: 1300, newUsers: 50 },
      { date: '2025-05-26', totalUsers: 1350, newUsers: 50 },
      { date: '2025-05-27', totalUsers: 1400, newUsers: 50 },
      { date: '2025-05-28', totalUsers: 1450, newUsers: 50 },
      { date: '2025-05-29', totalUsers: 1500, newUsers: 50 },
      { date: '2025-05-30', totalUsers: 1550, newUsers: 50 },
    ];

    const orderData = [
      { date: '2025-05-24', totalOrders: 60, validOrders: 55 },
      { date: '2025-05-25', totalOrders: 80, validOrders: 75 },
      { date: '2025-05-26', totalOrders: 70, validOrders: 65 },
      { date: '2025-05-27', totalOrders: 90, validOrders: 85 },
      { date: '2025-05-28', totalOrders: 75, validOrders: 70 },
      { date: '2025-05-29', totalOrders: 100, validOrders: 95 },
      { date: '2025-05-30', totalOrders: 110, validOrders: 105 },
    ];
    console.log(1)
    // 生成CSV内容
    const generateCsv = (data, headers) => {
      const headerLine = headers.join(',') + '\n';
      const content = data.map(row =>
        headers.map(header => row[header] || '').join(',')
      ).join('\n');
      return headerLine + content;
    };

    // 创建工作簿
    const createWorkbook = () => {
      const workbook = {
        '营业额统计': generateCsv(revenueData, ['date', 'revenue']),
        '用户统计': generateCsv(userData, ['date', 'totalUsers', 'newUsers']),
        '订单统计': generateCsv(orderData, ['date', 'totalOrders', 'validOrders']),
        '销量排名TOP10': '菜品名称,销量\n宫保鸡丁,150\n鱼香肉丝,130\n糖醋排骨,120\n麻婆豆腐,110\n回锅肉,100\n东坡肘子,90\n水煮鱼,80\n夫妻肺片,70\n口水鸡,60\n青椒肉丝,50'
      };

      return workbook;
    };

    // 使用原生方法导出CSV
    const exportExcel = () => {
      const workbook = createWorkbook();
      let excelData = [];

      for (const [sheetName, content] of Object.entries(workbook)) {
        excelData.push(`\n\n工作表: ${sheetName}\n`);
        excelData.push(content);
      }

      const csvContent = excelData.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      // 创建下载链接
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', 'business_statistics.csv');
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 释放URL对象
      URL.revokeObjectURL(url);
    };
    console.log(3)
    debugger;

  };
  return (
    <div className="statistics">
      <div className="time-tabs">
        <button
          className={`time-tab ${selectedTime === '昨日' ? 'active' : ''}`}
          onClick={() => handleTimeTabClick('昨日')}
        >
          昨日
        </button>
        <button
          className={`time-tab ${selectedTime === '近7日' ? 'active' : ''}`}
          onClick={() => handleTimeTabClick('近7日')}
        >
          近7日
        </button>
        <button
          className={`time-tab ${selectedTime === '近30日' ? 'active' : ''}`}
          onClick={() => handleTimeTabClick('近30日')}
        >
          近30日
        </button>
        <button
          className={`time-tab ${selectedTime === '本周' ? 'active' : ''}`}
          onClick={() => handleTimeTabClick('本周')}
        >
          本周
        </button>
        <button
          className={`time-tab ${selectedTime === '本月' ? 'active' : ''}`}
          onClick={() => handleTimeTabClick('本月')}
        >
          本月
        </button>
        <span>已选时间: {startDate} 至 {endDate}</span>

      </div>
      <button className="export-button" onClick={handleExportData}>
        数据导出
      </button>
      <div className="statistic-panels">
        <RevenueStatistics startDate={startDate} endDate={endDate} />
        <UserStatistics startDate={startDate} endDate={endDate} />
        <OrderStatistics startDate={startDate} endDate={endDate} />
        <SalesTop10 startDate={startDate} endDate={endDate} />
      </div>
    </div>
  );
}
export default Data;