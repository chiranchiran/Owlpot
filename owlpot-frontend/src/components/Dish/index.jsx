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
  const [deleteSingleModal, setDeleteSingleModal] = useState({ isOpen: false, dish: null });
  const [deleteBatchModal, setDeleteBatchModal] = useState({ isOpen: false });
  const [statusModal, setStatusModal] = useState({ isOpen: false, dish: null });
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]);

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
      showNotification("已启售的菜品不可删除", "error");
      return;
    }

    if (deleteSingleModal.dish) {
      const id = deleteSingleModal.dish.id;
      deleteSingleMutation.mutate(id, {
        onSuccess: () => {
          closeDeleteSingleModal();
          setCheckedIds(prevIds => prevIds.filter(id => id !== deleteSingleModal.dish.id));
        },
      });
    }
  };

  // 打开批量删除确认对话框
  const openDeleteBatchModal = () => {
    if (checkedIds.length === 0) {
      showNotification("请至少选择一个菜品", "warning");
      return;
    }

    // 检查选中的菜品中是否有启售的
    const selectedDishes = dishesQuery.data?.records.filter(dish =>
      checkedIds.includes(dish.id)
    ) || [];

    const hasEnabledDishes = selectedDishes.some(dish => dish.status > 0);

    if (hasEnabledDishes) {
      showNotification("选中的菜品中有已启售的，不可删除", "error");
      return;
    }

    setDeleteBatchModal({ isOpen: true });
  };

  // 关闭批量删除确认对话框
  const closeDeleteBatchModal = () => {
    setDeleteBatchModal({ isOpen: false });
  };

  // 确认批量删除 - 使用当前选中的ID
  const confirmBatchDelete = () => {
    if (checkedIds.length === 0) {
      showNotification("没有选中任何菜品", "warning");
      return;
    }

    // 再次确认选中的菜品中没有启售的（防止在打开对话框后状态改变）
    const selectedDishes = dishesQuery.data?.records.filter(dish =>
      checkedIds.includes(dish.id)
    ) || [];

    const hasEnabledDishes = selectedDishes.some(dish => dish.status > 0);

    if (hasEnabledDishes) {
      showNotification("选中的菜品中有已启售的，不可删除", "error");
      closeDeleteBatchModal();
      return;
    }

    deleteBatchMutation.mutate(checkedIds, {
      onSuccess: () => {
        closeDeleteBatchModal();
        setCheckedIds([]);
        setIsAllChecked(false);
        dishesQuery.refetch();
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
      // 只选中当前页的菜品
      const currentPageIds = dishesQuery.data?.records.map(dish => dish.id) || [];
      setCheckedIds(currentPageIds);
    } else {
      setCheckedIds([]);
    }
  };

  // 处理每行复选框的点击事件
  const handleRowCheck = (dishId, isChecked) => {
    let newCheckedIds;

    if (isChecked) {
      newCheckedIds = [...checkedIds, dishId];
    } else {
      newCheckedIds = checkedIds.filter(id => id !== dishId);
    }

    setCheckedIds(newCheckedIds);

    // 正确更新全选状态
    const currentPageIds = dishesQuery.data?.records.map(dish => dish.id) || [];
    const allChecked = currentPageIds.length > 0 &&
      currentPageIds.every(id => newCheckedIds.includes(id));

    setIsAllChecked(allChecked);
  };

  // 获取分类名称
  const getCategoryName = (categoryId) => {
    const found = category?.find(c => c.id === categoryId);
    return found ? found.name : categoryId;
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
          onChange={(e) => setParams({ ...params, name: e.target.value })}
        />
        <label htmlFor="searchCategory" className="dish1">菜品分类:</label>
        <select
          id="searchCategory"
          value={params.type}
          onChange={(e) => setParams({ ...params, type: e.target.value })}
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
          onChange={(e) => setParams({ ...params, status: e.target.value })}
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
              <td colSpan="8">加载中...</td>
            </tr>
          ) : dishesQuery.isError ? (
            <tr>
              <td colSpan="8">加载失败</td>
            </tr>
          ) : dishesQuery.data?.records.length === 0 ? (
            <tr>
              <td colSpan="8">暂无数据</td>
            </tr>
          ) : (
            dishesQuery.data?.records.map(dish => (
              <tr key={dish.id}>
                <td>
                  <input
                    type="checkbox"
                    onChange={(e) => handleRowCheck(dish.id, e.target.checked)}
                    checked={checkedIds.includes(dish.id)}
                  />
                </td>
                <td>{dish.name}</td>
                <td><img src={dish.image} alt={dish.name} className="dish-image" /></td>
                <td>{getCategoryName(dish.categoryId)}</td>
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
        message={checkedIds.length > 0
          ? `确定删除选中的${checkedIds.length}个菜品吗？`
          : "没有选中任何菜品"}
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