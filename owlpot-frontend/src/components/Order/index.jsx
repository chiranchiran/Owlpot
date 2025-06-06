
import React, { useState } from 'react';
import './index.css';
import OrderDetailModal from './OrderDetailModal';
import Pagination from '../common/Pagination'; // 确保你安装了 react-js-pagination
// 模拟订单数据
const mockOrders = [
  {
    id: 12,
    orderNumber: '12',
    status: '待付款',
    username: 'adf',
    phone: '12345678908',
    address: 'faedf gfd',
    orderTime: '2024-05-24 21:47',
    amount: 23
  },
  // 可添加更多订单数据
];

const Order = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('全部订单');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const handleSearch = () => {
    let filteredOrders = mockOrders;
    if (searchOrderNumber) {
      filteredOrders = filteredOrders.filter(order => order.orderNumber.includes(searchOrderNumber));
    }
    if (searchPhone) {
      filteredOrders = filteredOrders.filter(order => order.phone.includes(searchPhone));
    }
    if (startDate && endDate) {
      filteredOrders = filteredOrders.filter(order => {
        const orderTime = new Date(order.orderTime);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return orderTime >= start && orderTime <= end;
      });
    }
    setOrders(filteredOrders);
  };
  // 分页逻辑
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  return (
    <div className="order-list">
      <div className="tab-bar">
        <button
          className={`tab-button ${activeTab === '全部订单' ? 'active' : ''}`}
          onClick={() => handleTabClick('全部订单')}
        >
          全部订单
        </button>
        <button
          className={`tab-button ${activeTab === '待接单' ? 'active' : ''}`}
          onClick={() => handleTabClick('待接单')}
        >
          待接单
        </button>
        <button
          className={`tab-button ${activeTab === '待派送' ? 'active' : ''}`}
          onClick={() => handleTabClick('待派送')}
        >
          待派送
        </button>
        <button
          className={`tab-button ${activeTab === '派送中' ? 'active' : ''}`}
          onClick={() => handleTabClick('派送中')}
        >
          派送中
        </button>
        <button
          className={`tab-button ${activeTab === '已完成' ? 'active' : ''}`}
          onClick={() => handleTabClick('已完成')}
        >
          已完成
        </button>
        <button
          className={`tab-button ${activeTab === '已取消' ? 'active' : ''}`}
          onClick={() => handleTabClick('已取消')}
        >
          已取消
        </button>
      </div>
      <div className="search-bar">
        <label htmlFor="searchOrderNumber">订单号:</label>
        <input
          type="text"
          id="searchOrderNumber"
          placeholder="请填写订单号"
          value={searchOrderNumber}
          onChange={(e) => setSearchOrderNumber(e.target.value)}
        />
        <label htmlFor="searchPhone">手机号:</label>
        <input
          type="text"
          id="searchPhone"
          placeholder="请填写手机号"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <label htmlFor="startDate">下单时间:</label>
        <input
          className="date-input"
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span>至</span>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>查询</button>
      </div>
      <table className="order-table management">
        <thead>
          <tr>
            <th>订单号</th>
            <th>订单状态</th>
            <th>用户名</th>
            <th>手机号</th>
            <th>地址</th>
            <th>下单时间</th>
            <th>实收金额</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order.orderNumber}</td>
              <td>{order.status}</td>
              <td>{order.username}</td>
              <td>{order.phone}</td>
              <td>{order.address}</td>
              <td>{order.orderTime}</td>
              <td>¥{order.amount}</td>
              <td>
                <span className="operation" onClick={() => handleViewOrder(order)}>查看&nbsp;&nbsp;&nbsp;</span>
                {order.status === '待付款' && (
                  <span className="operation cancel" onClick={() => { }}>&nbsp; &nbsp; &nbsp; 取消</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalVisible && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setIsModalVisible(false)}
        />
      )}
      <Pagination
        totalItems={orders.length}
        itemsPerPage={ordersPerPage}
        initialPage={currentPage}
        onPageChange={setCurrentPage}
        className="my-custom-pagination"
        activeClassName="my-active-page"
      />
    </div>
  );
};

export default Order;