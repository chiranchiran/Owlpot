import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../common/Pagination';
import { getCategories } from '../../api/category';
import './category.css'; // 确保你有相应的CSS样式文件
import AddModal from './AddModal';
import { useDeleteCategory, useAddCategory, useUpdateCategory, useCategory } from '../../hooks/useCategory';
import { useNotification } from '../common/NotificationContext';
import { useSelect } from '../../hooks/useSelect';
import ConfirmationModal from '../common/ConfirmationModal';
const Category = () => {
  const { showNotification } = useNotification(); // 添加这行
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null });
  const [statusModal, setStatusModal] = useState({ isOpen: false, category: null });
  const [comboModalVisible, setComboModalVisible] = useState(false)
  const [dishModalVisible, setDishModalVisible] = useState(false)
  const [updateDish, setUpdateDish] = useState(false)
  const [updateSetmeal, setUpdateSetmeal] = useState(false)
  // 使用useSelect获取分类数据
  const categoriesQuery = useSelect("categories", getCategories);

  // 删除分类Mutation
  const deleteMutation = useDeleteCategory();
  // 更新状态Mutation
  const statusMutation = useUpdateCategory();

  // 处理搜索
  const handleSearch = () => {
    categoriesQuery.setParams({ name: searchName, type: searchType });
  };

  // 打开删除确认对话框
  const openDeleteModal = (category) => {
    setDeleteModal({ isOpen: true, category });
  };

  // 关闭删除确认对话框
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, category: null });
  };

  // 确认删除
  const confirmDelete = () => {
    if (deleteModal.category) {
      deleteMutation.mutate(deleteModal.category.id, {
        onSuccess: () => {
          closeDeleteModal();
        },
      });
    }
  };

  // 打开状态切换确认对话框
  const openStatusModal = (category) => {
    setStatusModal({ isOpen: true, category });
  };

  // 关闭状态切换确认对话框
  const closeStatusModal = () => {
    setStatusModal({ isOpen: false, category: null });
  };

  // 确认切换状态
  const confirmToggleStatus = () => {
    if (statusModal.category) {
      const newStatus = statusModal.category.status === 1 ? 0 : 1;
      statusMutation.mutate({
        id: statusModal.category.id,
        status: newStatus
      }, {
        onSuccess: () => {
          showNotification(`分类已${newStatus === 1 ? '启用' : '禁用'}`, 'success'); // 添加通知
          categoriesQuery.refetch();
          closeStatusModal();
        },
        onError: () => {
          showNotification('状态更新失败', 'error'); // 添加错误通知
        }
      });
    }
  };
  const handleUpdate = status => {
    if (status > 0) {
      setUpdateSetmeal(true)
      return;
    }
    setUpdateDish(true);
  }

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
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <label htmlFor="searchType1" className="type">分类类型:</label>
        <select
          id="searchType1"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="">请选择</option>
          <option value={0}>菜品</option>
          <option value={1}>套餐</option>
        </select>
        <button className="search-button1" onClick={handleSearch}>查询</button>
        <button
          className="add-dish-category-button"
          onClick={() => setDishModalVisible(true)}
        >
          + 新增菜品分类
        </button>
        <button
          className="add-combo-category-button"
          onClick={() => setComboModalVisible(true)}
        >
          + 新增套餐分类
        </button>
      </div>
      <table className="category-table management">
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
          {categoriesQuery.isLoading ? (
            <tr>
              <td colSpan="6">加载中...</td>
            </tr>
          ) : categoriesQuery.isError ? (
            <tr>
              <td colSpan="6">加载失败</td>
            </tr>
          ) : categoriesQuery.data?.records.length === 0 ? (
            <tr>
              <td colSpan="6">暂无数据</td>
            </tr>
          ) : (
            categoriesQuery.data?.records.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.type > 0 ? "套餐" : "菜品"}</td>
                <td>{category.orderNumber}</td>
                <td>
                  {category.status > 0 ? (
                    <span className="status-enabled">● 启用</span>
                  ) : (
                    <span className="status-disabled">● 禁用</span>
                  )}
                </td>
                <td>{category.updateTime}</td>
                <td>
                  <span
                    className="operation"
                    onClick={() => handleUpdate(category.id)}
                  >
                    修改
                  </span>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  <span
                    className="operation"
                    onClick={() => openStatusModal(category)}
                  >
                    {category.status === 1 ? '禁用' : '启用'}
                  </span>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  <span
                    className="operation delete"
                    onClick={() => openDeleteModal(category)}
                  >
                    删除
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {categoriesQuery.data && (
        <Pagination
          total={categoriesQuery.data.total}
          pageSize={categoriesQuery.pageSize}
          currentPage={categoriesQuery.currentPage}
          onPageChange={categoriesQuery.setCurrentPage}
        />
      )}
      {/* 删除确认对话框 */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="删除分类"
        message={`确定要删除分类\"${deleteModal.category?.name}\"吗？`}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />

      {/* 状态切换确认对话框 */}
      <ConfirmationModal
        isOpen={statusModal.isOpen}
        title={statusModal.category?.status === 1 ? "禁用分类" : "启用分类"}
        message={`确定要${statusModal.category?.status === 1 ? '禁用' : '启用'}分类\"${statusModal.category?.name}\"吗？`}
        onConfirm={confirmToggleStatus}
        onCancel={closeStatusModal}
      />
      {dishModalVisible && <AddModal onClose={() => setDishModalVisible(false)} title="新建菜品分类" data={null} />}
      {comboModalVisible && <AddModal onClose={() => setComboModalVisible(false)} title="新建套餐分类" data={null} />}
      {updateDish && <AddModal onClose={() => setUpdateDish(false)} title="修改菜品分类" data={null} />}
      {updateSetmeal && <AddModal onClose={() => setUpdateSetmeal(false)} title="修改套餐分类" data={null} />}
    </div>
  );
};
export default Category;