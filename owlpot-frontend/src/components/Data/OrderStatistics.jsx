import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OrderStatistics = ({ startDate, endDate }) => {
  // 模拟数据
  const labels = ['5/24', '5/25', '5/26', '5/27', '5/28', '5/29', '5/30'];
  const totalOrders = [60, 80, 70, 90, 75, 100, 110];
  const validOrders = [55, 75, 65, 85, 70, 95, 105];

  const chartData = {
    labels,
    datasets: [
      {
        label: '订单总数',
        data: totalOrders,
        borderColor: '#5e72e4',
        backgroundColor: 'rgba(94, 114, 228, 0.1)',
        pointBackgroundColor: '#5e72e4',
        tension: 0.3
      },
      {
        label: '有效订单',
        data: validOrders,
        borderColor: '#2dce89',
        backgroundColor: 'rgba(45, 206, 137, 0.1)',
        pointBackgroundColor: '#2dce89',
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#32325d',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#32325d',
        bodyColor: '#525f7f',
        borderColor: '#e9ecef',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#525f7f'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#525f7f',
          precision: 0
        }
      }
    }
  };

  // 计算订单完成率
  const totalSum = totalOrders.reduce((a, b) => a + b, 0);
  const validSum = validOrders.reduce((a, b) => a + b, 0);
  const completionRate = ((validSum / totalSum) * 100).toFixed(1);

  return (
    <div className="statistics-card">
      <div className="card-header">
        <h3>订单统计</h3>
      </div>
      <div className="order-metrics">
        <div className="metric">
          <span>订单完成率</span>
          <span className="rate">{completionRate}%</span>
        </div>
        <div className="metric-detail">
          <span>{validSum}</span>
          <span>/</span>
          <span>{totalSum}</span>
        </div>
      </div>
      <div className="chart-container" style={{ height: '250px' }}>
        <Line data={chartData} options={options} />
      </div>

    </div>
  );
};

export default OrderStatistics;