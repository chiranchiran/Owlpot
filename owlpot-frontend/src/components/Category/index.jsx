import React, { useState } from 'react';
import Pagination from '../common/Pagination';
import './category.css'; // 确保你有相应的CSS样式文件
import AddModal from './AddModal';

// 模拟分类数据
const mockCategories = [
  {
    id: 1,
    name: '蜀味烤鱼',
    type: '菜品分类',
    sort: 4,
    status: '启用',
    operateTime: '2022-08-31 14:27'
  },
  // 可添加更多分类数据
];

const Category = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [isDishModalVisible, setIsDishModalVisible] = useState(false);
  const [isComboModalVisible, setIsComboModalVisible] = useState(false);

  // 处理搜索
  const handleSearch = () => {
    let filteredCategories = mockCategories;
    if (searchName) {
      filteredCategories = filteredCategories.filter(category => category.name.includes(searchName));
    }
    if (searchType) {
      filteredCategories = filteredCategories.filter(category => category.type === searchType);
    }
    setCategories(filteredCategories);
  };

  // 分页逻辑
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentCategories = categories.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(categories.length / ordersPerPage);

  return (
    <div className="category-list">
      <div className="search-bar">
        <label htmlFor="searchName">分类名称:</label>
        <input
          type="text"
          id="searchName"
          placeholder="请填写分类名称"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <label htmlFor="searchType1" className="type">分类类型:</label>
        <select
          id="searchType1"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="">请选择</option>
          <option value="菜品分类">菜品分类</option>
          <option value="套餐分类">套餐分类</option>
        </select>
        <button className="search-button1" onClick={handleSearch}>查询</button>
        <button
          className="add-dish-category-button"
          onClick={() => setIsDishModalVisible(true)}
        >
          + 新增菜品分类
        </button>
        <button
          className="add-combo-category-button"
          onClick={() => setIsComboModalVisible(true)}
        >
          + 新增套餐分类
        </button>
      </div>
      <table className="category-table">
        <thead>
          <tr>
            <th>分类名称</th>
            <th>分类类型</th>
            <th>排序</th>
            <th>状态</th>
            <th>操作时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {currentCategories.map((category, index) => (
            <tr key={index}>
              <td>{category.name}</td>
              <td>{category.type}</td>
              <td>{category.sort}</td>
              <td>
                {category.status === '启用' ? (
                  <span className="status-enabled">● 启用</span>
                ) : (
                  <span className="status-disabled">● 禁用</span>
                )}
              </td>
              <td>{category.operateTime}</td>
              <td>
                <span className="operation">修改</span>&nbsp; &nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                <span className="operation">删除</span>&nbsp;&nbsp;&nbsp; |&nbsp;&nbsp;&nbsp;
                <span className="operation">禁用</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalItems={categories.length}
        itemsPerPage={ordersPerPage}
        initialPage={currentPage}
        onPageChange={setCurrentPage}
        className="my-custom-pagination"
        activeClassName="my-active-page"
      />
      {isDishModalVisible && <AddModal onClose={() => setIsDishModalVisible(false)} title="新建菜品分类" />}
      {isComboModalVisible && <AddModal onClose={() => setIsComboModalVisible(false)} title="新建套餐分类" />}
    </div>
  );
};

export default Category;