import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesTop10 = ({ startDate, endDate }) => {
  // 模拟数据
  const salesData = [
    { name: '宫保鸡丁', sales: 150 },
    { name: '鱼香肉丝', sales: 130 },
    { name: '糖醋排骨', sales: 120 },
    { name: '麻婆豆腐', sales: 110 },
    { name: '回锅肉', sales: 100 },
    { name: '东坡肘子', sales: 90 },
    { name: '水煮鱼', sales: 80 },
    { name: '夫妻肺片', sales: 70 },
    { name: '口水鸡', sales: 60 },
    { name: '青椒肉丝', sales: 50 },
  ];

  const chartData = {
    labels: salesData.map(item => item.name),
    datasets: [
      {
        label: '销量 (份)',
        data: salesData.map(item => item.sales),
        backgroundColor: '#5e72e4',
        borderRadius: 4,
        barThickness: 16,
      }
    ]
  };

  const options = {
    indexAxis: 'y', // 水平柱状图
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
          label: (context) => `${context.parsed.x}份`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#525f7f',
          precision: 0
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: '#32325d',
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div className="statistics-card">
      <div className="card-header">
        <h3>销量排名TOP10</h3>
      </div>
      <div className="chart-container" style={{ height: '300px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesTop10;