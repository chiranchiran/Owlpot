import React, { useState } from 'react';
import Pagination from '../common/Pagination'; // 假设分页组件路径如此，根据实际情况调整
import './index.css';

// 模拟套餐数据
const mockSetmeals = [
  {
    id: 1,
    name: 'a',
    image: 'default-image.png',
    category: '',
    price: 11,
    status: '启售',
    lastOperateTime: '2025-05-31 22:38'
  },
  // 可添加更多套餐数据
];

const Setmeal = () => {
  const [setmeals, setSetmeals] = useState(mockSetmeals);
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // 处理搜索
  const handleSearch = () => {
    let filteredSetmeals = mockSetmeals;
    if (searchName) {
      filteredSetmeals = filteredSetmeals.filter(setmeal => setmeal.name.includes(searchName));
    }
    if (searchCategory) {
      filteredSetmeals = filteredSetmeals.filter(setmeal => setmeal.category === searchCategory);
    }
    if (searchStatus) {
      filteredSetmeals = filteredSetmeals.filter(setmeal => setmeal.status === searchStatus);
    }
    setSetmeals(filteredSetmeals);
  };

  // 分页逻辑
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentSetmeals = setmeals.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(setmeals.length / ordersPerPage);

  return (
    <div className="setmeal-management">
      <div className="search-bar">
        <label htmlFor="searchName">套餐名称:</label>
        <input
          type="text"
          id="searchName2"
          placeholder="请填写套餐名称"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <label htmlFor="searchCategory" className="dish1">套餐分类:</label>
        <select
          id="searchCategory"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
          <option value="">请选择</option>
          {/* 这里应根据实际分类动态生成选项，目前写死示例 */}
          <option value="人气套餐">人气套餐</option>
          <option value="商务套餐">商务套餐</option>
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
        <button className="search-button search-button2" onClick={handleSearch}>查询</button>
        <button className="batch-delete-button">批量删除</button>
        <button className="add-setmeal-button">+ 新建套餐</button>
      </div>
      <table className="setmeal-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>套餐名称</th>
            <th>图片</th>
            <th>套餐分类</th>
            <th>套餐价</th>
            <th>售卖状态</th>
            <th>最后操作时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {currentSetmeals.map((setmeal, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              <td>{setmeal.name}</td>
              <td><img src={setmeal.image} alt={setmeal.name} className="setmeal-image" /></td>
              <td>{setmeal.category}</td>
              <td>¥{setmeal.price}</td>
              <td>
                {setmeal.status === '启售' ? (
                  <span className="status-enabled">● 启售</span>
                ) : (
                  <span className="status-disabled">● 停售</span>
                )}
              </td>
              <td>{setmeal.lastOperateTime}</td>
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
        totalItems={setmeals.length}
        itemsPerPage={ordersPerPage}
        initialPage={currentPage}
        onPageChange={setCurrentPage}
        className="my-custom-pagination"
        activeClassName="my-active-page"
      />
    </div>
  );
};

export default Setmeal;