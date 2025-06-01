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

const UserStatistics = ({ startDate, endDate }) => {
  // 模拟数据
  const labels = ['5/24', '5/25', '5/26', '5/27', '5/28', '5/29', '5/30'];
  const totalUsers = [1250, 1300, 1350, 1400, 1450, 1500, 1550];
  const newUsers = [50, 50, 50, 50, 50, 50, 50];

  const chartData = {
    labels,
    datasets: [
      {
        label: '用户总量',
        data: totalUsers,
        borderColor: '#5e72e4',
        backgroundColor: 'rgba(94, 114, 228, 0.1)',
        pointBackgroundColor: '#5e72e4',
        tension: 0.3
      },
      {
        label: '新增用户',
        data: newUsers,
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
          precision: 0,
          font: {
            size: 11
          }
        }
      }
    }
  };

  // 计算新增用户总量
  const newUsersTotal = newUsers.reduce((sum, current) => sum + current, 0);

  return (
    <div className="statistics-card">
      <div className="card-header">
        <h3>用户统计</h3>
      </div>

      {/* 顶部高亮区域 - 显示新增用户总量 */}
      <div className="user-highlight">
        <div className="user-value">{newUsersTotal.toLocaleString()}</div>
        <div className="user-metrics">
          <div className="metric">
            <span>新增用户总量</span>
          </div>
        </div>
      </div>


      <div className="chart-container" style={{ height: '180px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default UserStatistics;