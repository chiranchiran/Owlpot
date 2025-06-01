import React, { useState, useMemo } from 'react';
import { useNotification } from '../../common/NotificationContext';
import './index.css';
import Pagination from '../../common/Pagination';

const OrderManagement = () => {
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const { showNotification } = useNotification();

  // 模拟订单数据
  const orders = Array.from({ length: 35 }, (_, i) => ({
    id: `ORD20250530${1000 + i}`,
    dishes: [
      '麻辣小龙虾 x2',
      '炭烤生蚝 x1',
      '啤酒 x3',
      '烤羊肉串 x5',
      '蒜蓉茄子 x1',
      '炒河粉 x1'
    ].slice(0, Math.floor(Math.random() * 4) + 2),
    address: `上海市浦东新区张江高科技园区博云路${100 + i}号夜宵大厦${i + 1}层${i + 1}室`,
    deliveryTime: `2025-05-31 ${Math.floor(Math.random() * 5) + 1}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
    note: i % 3 === 0 ? '请多给几双筷子，需要微辣，不要香菜' :
      i % 4 === 0 ? '请放在前台，到了打电话，不要敲门，谢谢' :
        i % 5 === 0 ? '请尽快送达，肚子饿了！需要发票，公司抬头：夜宵科技有限公司' :
          '无备注',
    amount: (Math.random() * 100 + 20).toFixed(2)
  }));

  // 处理排序
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const timeA = new Date(a.deliveryTime);
      const timeB = new Date(b.deliveryTime);
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });
  }, [sortOrder, orders]);

  // 分页逻辑
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // 切换排序
  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleAcceptOrder = (orderId) => {
    showNotification(`已接单: ${orderId}`, 'success');
  };

  return (
    <div className="order-management">
      <div className="section-header">
        <h2>订单管理</h2>
        <div className="tabs">
          <div className="tab active">待接单 <span className="count">12</span></div>
          <div className="tab">待配送 <span className="count">8</span></div>
          <div className="tab">已完成 <span className="count">128</span></div>
          <div className="tab">已取消 <span className="count">5</span></div>
          <div className="tab">全部订单 <span className="count">153</span></div>
        </div>
      </div>

      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>订单菜品</th>
              <th>地址</th>
              <th>
                预计送达时间
                <button className="sort-button" onClick={toggleSort}>
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </th>
              <th>实收金额</th>
              <th>备注</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={index}>
                <td className="order-id">{order.id}</td>
                <td className="ellipsis" title={order.dishes.join(', ')}>
                  {order.dishes.join(', ')}
                </td>
                <td className="ellipsis" title={order.address}>{order.address}</td>
                <td>{order.deliveryTime.split(' ')[1]}</td>
                <td>¥{order.amount}</td>
                <td className="ellipsis" title={order.note}>{order.note}</td>
                <td>
                  <button
                    className="action-button accept"
                    onClick={() => handleAcceptOrder(order.id)}
                  >
                    接单
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 正确绑定分页组件 */}
        <Pagination
          totalItems={sortedOrders.length} // 使用实际数据总数
          onPageChange={setCurrentPage} // 直接传入页码设置函数
          className="my-custom-pagination"
          activeClassName="my-active-page"
        />
      </div>
    </div>
  );
};

export default OrderManagement;