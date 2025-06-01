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

const RevenueStatistics = ({ startDate, endDate }) => {
  // 模拟数据
  const labels = ['5/24', '5/25', '5/26', '5/27', '5/28', '5/29', '5/30'];
  const data = [1200, 1900, 1500, 2100, 1800, 2300, 2500];

  // 计算最大值
  const maxValue = Math.max(...data);

  const chartData = {
    labels,
    datasets: [
      {
        label: '营业额 (元)',
        data,
        borderColor: '#5e72e4',
        backgroundColor: 'rgba(94, 114, 228, 0.1)',
        pointBackgroundColor: '#5e72e4',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointRadius: 4,
        tension: 0.3,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#32325d',
        bodyColor: '#525f7f',
        borderColor: '#e9ecef',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: (context) => `¥${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#525f7f',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#525f7f',
          callback: (value) => `¥${value.toLocaleString()}`,
          font: {
            size: 11
          }
        }
      }
    }
  };
  // 计算
  const totalRevenue = data.reduce((acc, current) => acc + current, 0);
  return (
    <div className="statistics-card">
      <div className="card-header">
        <h3>营业额统计</h3>
      </div>
      <div className="revenue-highlight">
        <div className="revenue-value">¥{totalRevenue}</div>
      </div>

      <div className="chart-container" style={{ height: '180px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RevenueStatistics;