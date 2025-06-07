import React, { useEffect, useState } from 'react';
import { useSelect } from '../../hooks/useSelect';
import { getDishes } from '../../api/dish';
import { useDeleteDish, useDeleteDishes, useUpdateDish } from '../../hooks/useDish';
import { getCategories } from '../../api/category';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useNotification } from '../../components/common/NotificationContext';
import './index.css';

const Dish = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [params, setParams] = useState({ name: "", type: "", status: "" });
  const [category, setCategory] = useState([]);
  const [deleteSingleModal, setDeleteSingleModal] = useState({ isOpen: false, dish: null }); // 单个删除模态框状态
  const [deleteBatchModal, setDeleteBatchModal] = useState({ isOpen: false, dishes: [] }); // 批量删除模态框状态
  const [statusModal, setStatusModal] = useState({ isOpen: false, dish: null });
  const [isAllChecked, setIsAllChecked] = useState(false); // 新增全选状态
  const [checkedIds, setCheckedIds] = useState([]); // 新增选中的id数组状态

  // 使用useSelect获取菜品数据
  const dishesQuery = useSelect("dishes", getDishes);
  const categoriesQuery = useSelect("categories", getCategories);

  useEffect(() => {
    setCategory(categoriesQuery.data?.records);
  }, [categoriesQuery.data?.records]);

  // 删除单个菜品Mutation
  const deleteSingleMutation = useDeleteDish();
  // 批量删除菜品Mutation
  const deleteBatchMutation = useDeleteDishes();
  // 更新状态Mutation
  const statusMutation = useUpdateDish();

  // 处理搜索
  const handleSearch = () => {
    dishesQuery.setParams(params);
  };

  // 打开单个删除确认对话框
  const openDeleteSingleModal = (dish) => {
    setDeleteSingleModal({ isOpen: true, dish });
  };

  // 关闭单个删除确认对话框
  const closeDeleteSingleModal = () => {
    setDeleteSingleModal({ isOpen: false, dish: null });
  };

  // 确认单个删除
  const confirmSingleDelete = () => {
    if (deleteSingleModal.dish.status > 0) {
      showNotification("已启售的菜品不可删除", "error")
      return
    }
    if (deleteSingleModal.dish) {
      const id = deleteSingleModal.dish.id;
      deleteSingleMutation.mutate(id, {
        onSuccess: () => {
          closeDeleteSingleModal();
          setCheckedIds([]); // 删除成功后清空选中状态
          setIsAllChecked(false);
        },
      });
    }
  };

  // 打开批量删除确认对话框
  const openDeleteBatchModal = () => {
    setDeleteBatchModal({ isOpen: true, dishes: dishesQuery.data?.records.filter(dish => checkedIds.includes(dish.id)) || [] });
  };

  // 关闭批量删除确认对话框
  const closeDeleteBatchModal = () => {
    setDeleteBatchModal({ isOpen: false, dishes: [] });
  };

  // 确认批量删除
  const confirmBatchDelete = () => {
    const ids = deleteBatchModal.dishes.map(item => item.id);
    deleteBatchMutation.mutate(ids, {
      onSuccess: () => {
        closeDeleteBatchModal();
        setCheckedIds([]); // 删除成功后清空选中状态
        setIsAllChecked(false);
      },
    });
  };

  // 打开状态切换确认对话框
  const openStatusModal = (dish) => {
    setStatusModal({ isOpen: true, dish });
  };

  // 关闭状态切换确认对话框
  const closeStatusModal = () => {
    setStatusModal({ isOpen: false, dish: null });
  };

  // 确认切换状态
  const confirmToggleStatus = () => {
    if (statusModal.dish) {
      const newStatus = statusModal.dish.status === 1 ? 0 : 1;
      statusMutation.mutate({
        id: statusModal.dish.id,
        status: newStatus
      }, {
        onSuccess: () => {
          showNotification(`菜品已${newStatus === 1 ? '启用' : '禁用'}`, 'success');
          dishesQuery.refetch();
          closeStatusModal();
        }
      });
    }
  };

  // 处理全选复选框的点击事件
  const handleAllCheck = (e) => {
    const isChecked = e.target.checked;
    setIsAllChecked(isChecked);
    if (isChecked) {
      setCheckedIds(dishesQuery.data?.records.map(dish => dish.id) || []);
    } else {
      setCheckedIds([]);
    }
  };

  // 处理每行复选框的点击事件
  const handleRowCheck = (dishId, isChecked) => {
    if (isChecked) {
      setCheckedIds([...checkedIds, dishId]);
    } else {
      setCheckedIds(checkedIds.filter(id => id !== dishId));
    }
    // 更新全选状态
    setIsAllChecked(checkedIds.length === (dishesQuery.data?.records.length || 0));
  };

  return (
    <div className="dish-management">
      <div className="search-bar">
        <label htmlFor="searchName">菜品名称:</label>
        <input
          type="text"
          id="searchName2"
          placeholder="请填写菜品名称"
          value={params.name}
          onChange={(e) => setParams({ name: e.target.value })}
        />
        <label htmlFor="searchCategory" className="dish1">菜品分类:</label>
        <select
          id="searchCategory"
          value={params.type}
          onChange={(e) => setParams({ name: parseInt(e.target.value) })}
        >
          <option value="">全部</option>
          {category && category.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
        <label htmlFor="searchStatus" className="dish2">售卖状态:</label>
        <select
          id="searchStatus"
          value={params.status}
          onChange={(e) => setParams({ status: parseInt(e.target.value) })}
        >
          <option value="">全部</option>
          <option value={1}>启售</option>
          <option value={0}>停售</option>
        </select>
        <button className="search-button search-button2 " onClick={handleSearch}>查询</button>
        <button className="batch-delete-button" onClick={openDeleteBatchModal}>批量删除</button>
        <button className="add-dish-button" onClick={() => navigate('/dish/add')}>+ 新建菜品</button>
      </div>
      <table className="dish-table management">
        <thead>
          <tr>
            <th><input type="checkbox" onChange={handleAllCheck} checked={isAllChecked} /></th>
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
          {dishesQuery.isLoading ? (
            <tr>
              <td colSpan="6">加载中...</td>
            </tr>
          ) : dishesQuery.isError ? (
            <tr>
              <td colSpan="6">加载失败</td>
            </tr>
          ) : dishesQuery.data?.records.length === 0 ? (
            <tr>
              <td colSpan="6">暂无数据</td>
            </tr>
          ) : (
            dishesQuery.data?.records.map(dish => (
              <tr key={dish.id}>
                <td><input type="checkbox" onChange={(e) => handleRowCheck(dish.id, e.target.checked)} checked={checkedIds.includes(dish.id)} /></td>
                <td>{dish.name}</td>
                <td><img src={dish.image} alt={dish.name} className="dish-image" /></td>
                <td>{dish.categoryId}</td>
                <td>¥{dish.price}</td>
                <td>
                  {dish.status > 0 ? (
                    <span className="status-enabled">● 启售</span>
                  ) : (
                    <span className="status-disabled">● 停售</span>
                  )}
                </td>
                <td>{dish.updateTime}</td>
                <td>
                  <span
                    className="operation"
                    onClick={() => navigate(`/dish/edit/${dish.id}`)}
                  >
                    修改
                  </span>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  <span
                    className="operation"
                    onClick={() => openStatusModal(dish)}
                  >
                    {dish.status === 1 ? '禁用' : '启用'}
                  </span>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  <span
                    className="operation delete"
                    onClick={() => openDeleteSingleModal(dish)}
                  >
                    删除
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {dishesQuery.data && (
        <Pagination
          total={dishesQuery.data.total}
          pageSize={dishesQuery.pageSize}
          currentPage={dishesQuery.currentPage}
          onPageChange={dishesQuery.setCurrentPage}
        />
      )}
      {/* 单个删除确认对话框 */}
      <ConfirmationModal
        isOpen={deleteSingleModal.isOpen}
        title="删除菜品"
        message={deleteSingleModal.dish ? `确定要删除菜品\"${deleteSingleModal.dish['name']}\"吗？` : ""}
        onConfirm={confirmSingleDelete}
        onCancel={closeDeleteSingleModal}
      />
      {/* 批量删除确认对话框 */}
      <ConfirmationModal
        isOpen={deleteBatchModal.isOpen}
        title="批量删除菜品"
        message={deleteBatchModal.dishes.length > 0 ? `确定删除选中的${deleteBatchModal.dishes.length}个菜品吗？` : ""}
        onConfirm={confirmBatchDelete}
        onCancel={closeDeleteBatchModal}
      />
      {/* 状态切换确认对话框 */}
      <ConfirmationModal
        isOpen={statusModal.isOpen}
        title={statusModal.dish?.status === 1 ? "禁用菜品" : "启用菜品"}
        message={`确定要${statusModal.dish?.status === 1 ? '禁用' : '启用'}菜品\"${statusModal.dish?.name}\"吗？`}
        onConfirm={confirmToggleStatus}
        onCancel={closeStatusModal}
      />
    </div>
  );
};

export default Dish;