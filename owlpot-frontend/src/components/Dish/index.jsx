import React, { useState } from 'react';
import Pagination from '../common/Pagination'; // 假设分页组件路径如此，根据实际情况调整
import './index.css';

// 模拟菜品数据
const mockDishes = [
  {
    id: 1,
    name: '平菇豆腐汤',
    image: 'dish1.png', // 这里用字符串表示图片路径，实际需替换为真实路径
    category: '汤类',
    price: 6,
    status: '启售',
    lastOperateTime: '2022-06-10 10:55'
  },
  {
    id: 2,
    name: '鸡蛋汤',
    image: 'dish2.png',
    category: '汤类',
    price: 4,
    status: '启售',
    lastOperateTime: '2022-06-10 10:54'
  },
  // 可添加更多菜品数据
];

const Dish = () => {
  const [dishes, setDishes] = useState(mockDishes);
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // 处理搜索
  const handleSearch = () => {
    let filteredDishes = mockDishes;
    if (searchName) {
      filteredDishes = filteredDishes.filter(dish => dish.name.includes(searchName));
    }
    if (searchCategory) {
      filteredDishes = filteredDishes.filter(dish => dish.category === searchCategory);
    }
    if (searchStatus) {
      filteredDishes = filteredDishes.filter(dish => dish.status === searchStatus);
    }
    setDishes(filteredDishes);
  };

  // 分页逻辑
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentDishes = dishes.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(dishes.length / ordersPerPage);

  return (
    <div className="dish-management">
      <div className="search-bar">
        <label htmlFor="searchName" >菜品名称:</label>
        <input
          type="text"
          id="searchName2"
          placeholder="请填写菜品名称"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <label htmlFor="searchCategory" className="dish1">菜品分类:</label>
        <select
          id="searchCategory"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
          <option value="" >请选择</option>
          {/* 这里应根据实际分类动态生成选项，目前写死示例 */}
          <option value="汤类">汤类</option>
          <option value="蜀味烤鱼">蜀味烤鱼</option>
          <option value="蜀味牛蛙">蜀味牛蛙</option>
        </select>
        <label htmlFor="searchStatus" className="dish2">售卖状态:</label>
        <select
          id="searchStatus"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">请选择</option>
          <option value="启售">启售</option>
          <option value="停售">停售</option>
        </select>
        <button className="search-button search-button2 " onClick={handleSearch}>查询</button>
        <button className="batch-delete-button">批量删除</button>
        <button className="add-dish-button">+ 新建菜品</button>
      </div>
      <table className="dish-table management">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>菜品名称</th>
            <th>图片</th>
            <th>菜品分类</th>
            <th>售价</th>
            <th>售卖状态</th>
            <th>最后操作时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {currentDishes.map((dish, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              <td>{dish.name}</td>
              <td><img src={dish.image} alt={dish.name} className="dish-image" /></td>
              <td>{dish.category}</td>
              <td>¥{dish.price}</td>
              <td>
                {dish.status === '启售' ? (
                  <span className="status-enabled">● 启售</span>
                ) : (
                  <span className="status-disabled">● 停售</span>
                )}
              </td>
              <td>{dish.lastOperateTime}</td>
              <td>
                <span className="operation">修改</span> |
                <span className="operation">删除</span> |
                <span className="operation">停售</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalItems={dishes.length}
        itemsPerPage={ordersPerPage}
        initialPage={currentPage}
        onPageChange={setCurrentPage}
        className="my-custom-pagination"
        activeClassName="my-active-page"
      />
    </div>
  );
};

export default Dish;