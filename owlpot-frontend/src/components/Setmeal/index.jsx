import React, { useEffect, useState } from 'react';
import { useSelect } from '../../hooks/useSelect';
import { getSetmeals } from '../../api/setmeal';
import { useDeleteSetmeal, useDeleteSetmeals, useUpdateSetmeal } from '../../hooks/useSetmeal';
import { getCategories } from '../../api/category';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useNotification } from '../../components/common/NotificationContext';
import './index.css';

const Setmeal = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [params, setParams] = useState({ name: "", type: "", status: "" });
  const [category, setCategory] = useState([]);
  const [deleteSingleModal, setDeleteSingleModal] = useState({ isOpen: false, setmeal: null });
  const [deleteBatchModal, setDeleteBatchModal] = useState({ isOpen: false });
  const [statusModal, setStatusModal] = useState({ isOpen: false, setmeal: null });
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]);

  // 使用useSelect获取套餐数据
  const setmealsQuery = useSelect("setmeals", getSetmeals);
  const categoriesQuery = useSelect("categories", getCategories);

  useEffect(() => {
    setCategory(categoriesQuery.data?.records);
  }, [categoriesQuery.data?.records]);

  // 删除单个套餐Mutation
  const deleteSingleMutation = useDeleteSetmeal();
  // 批量删除套餐Mutation
  const deleteBatchMutation = useDeleteSetmeals();
  // 更新状态Mutation
  const statusMutation = useUpdateSetmeal();

  // 处理搜索
  const handleSearch = () => {
    setmealsQuery.setParams(params);
  };

  // 打开单个删除确认对话框
  const openDeleteSingleModal = (setmeal) => {
    setDeleteSingleModal({ isOpen: true, setmeal });
  };

  // 关闭单个删除确认对话框
  const closeDeleteSingleModal = () => {
    setDeleteSingleModal({ isOpen: false, setmeal: null });
  };

  // 确认单个删除
  const confirmSingleDelete = () => {
    if (deleteSingleModal.setmeal.status > 0) {
      showNotification("已启售的套餐不可删除", "error");
      return;
    }

    if (deleteSingleModal.setmeal) {
      const id = deleteSingleModal.setmeal.id;
      deleteSingleMutation.mutate(id, {
        onSuccess: () => {
          closeDeleteSingleModal();
          setCheckedIds(prevIds => prevIds.filter(id => id !== deleteSingleModal.setmeal.id));
        },
      });
    }
  };

  // 打开批量删除确认对话框
  const openDeleteBatchModal = () => {
    if (checkedIds.length === 0) {
      showNotification("请至少选择一个套餐", "warning");
      return;
    }

    // 检查选中的套餐中是否有启售的
    const selectedSetmeals = setmealsQuery.data?.records.filter(setmeal =>
      checkedIds.includes(setmeal.id)
    ) || [];

    const hasEnabledSetmeals = selectedSetmeals.some(setmeal => setmeal.status > 0);

    if (hasEnabledSetmeals) {
      showNotification("选中的套餐中有已启售的，不可删除", "error");
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
      showNotification("没有选中任何套餐", "warning");
      return;
    }

    // 再次确认选中的套餐中没有启售的（防止在打开对话框后状态改变）
    const selectedSetmeals = setmealsQuery.data?.records.filter(setmeal =>
      checkedIds.includes(setmeal.id)
    ) || [];

    const hasEnabledSetmeals = selectedSetmeals.some(setmeal => setmeal.status > 0);

    if (hasEnabledSetmeals) {
      showNotification("选中的套餐中有已启售的，不可删除", "error");
      closeDeleteBatchModal();
      return;
    }

    deleteBatchMutation.mutate(checkedIds, {
      onSuccess: () => {
        closeDeleteBatchModal();
        setCheckedIds([]);
        setIsAllChecked(false);
        setmealsQuery.refetch();
      },
    });
  };

  // 打开状态切换确认对话框
  const openStatusModal = (setmeal) => {
    setStatusModal({ isOpen: true, setmeal });
  };

  // 关闭状态切换确认对话框
  const closeStatusModal = () => {
    setStatusModal({ isOpen: false, setmeal: null });
  };

  // 确认切换状态
  const confirmToggleStatus = () => {
    if (statusModal.setmeal) {
      const newStatus = statusModal.setmeal.status === 1 ? 0 : 1;
      statusMutation.mutate({
        id: statusModal.setmeal.id,
        status: newStatus
      }, {
        onSuccess: () => {
          showNotification(`套餐已${newStatus === 1 ? '启用' : '禁用'}`, 'success');
          setmealsQuery.refetch();
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
      // 只选中当前页的套餐
      const currentPageIds = setmealsQuery.data?.records.map(setmeal => setmeal.id) || [];
      setCheckedIds(currentPageIds);
    } else {
      setCheckedIds([]);
    }
  };

  // 处理每行复选框的点击事件
  const handleRowCheck = (setmealId, isChecked) => {
    let newCheckedIds;

    if (isChecked) {
      newCheckedIds = [...checkedIds, setmealId];
    } else {
      newCheckedIds = checkedIds.filter(id => id !== setmealId);
    }

    setCheckedIds(newCheckedIds);

    // 正确更新全选状态
    const currentPageIds = setmealsQuery.data?.records.map(setmeal => setmeal.id) || [];
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
    <div className="setmeal-management">
      <div className="search-bar">
        <label htmlFor="searchName">套餐名称:</label>
        <input
          type="text"
          id="searchName2"
          placeholder="请填写套餐名称"
          value={params.name}
          onChange={(e) => setParams({ ...params, name: e.target.value })}
        />
        <label htmlFor="searchCategory" className="dish1">套餐分类:</label>
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
        <button className="add-setmeal-button" onClick={() => navigate('/setmeal/add')}>+ 新建套餐</button>
      </div>
      <table className="setmeal-table management">
        <thead>
          <tr>
            <th><input type="checkbox" onChange={handleAllCheck} checked={isAllChecked} /></th>
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
          {setmealsQuery.isLoading ? (
            <tr>
              <td colSpan="8">加载中...</td>
            </tr>
          ) : setmealsQuery.isError ? (
            <tr>
              <td colSpan="8">加载失败</td>
            </tr>
          ) : setmealsQuery.data?.records.length === 0 ? (
            <tr>
              <td colSpan="8">暂无数据</td>
            </tr>
          ) : (
            setmealsQuery.data?.records.map(setmeal => (
              <tr key={setmeal.id}>
                <td>
                  <input
                    type="checkbox"
                    onChange={(e) => handleRowCheck(setmeal.id, e.target.checked)}
                    checked={checkedIds.includes(setmeal.id)}
                  />
                </td>
                <td>{setmeal.name}</td>
                <td><img src={setmeal.image} alt={setmeal.name} className="setmeal-image" /></td>
                <td>{getCategoryName(setmeal.categoryId)}</td>
                <td>¥{setmeal.price}</td>
                <td>
                  {setmeal.status > 0 ? (
                    <span className="status-enabled">● 启售</span>
                  ) : (
                    <span className="status-disabled">● 停售</span>
                  )}
                </td>
                <td>{setmeal.updateTime}</td>
                <td>
                  <span
                    className="operation"
                    onClick={() => navigate(`/setmeal/edit/${setmeal.id}`)}
                  >
                    修改
                  </span>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  <span
                    className="operation"
                    onClick={() => openStatusModal(setmeal)}
                  >
                    {setmeal.status === 1 ? '禁用' : '启用'}
                  </span>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  <span
                    className="operation delete"
                    onClick={() => openDeleteSingleModal(setmeal)}
                  >
                    删除
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {setmealsQuery.data && (
        <Pagination
          total={setmealsQuery.data.total}
          pageSize={setmealsQuery.pageSize}
          currentPage={setmealsQuery.currentPage}
          onPageChange={setmealsQuery.setCurrentPage}
        />
      )}
      {/* 单个删除确认对话框 */}
      <ConfirmationModal
        isOpen={deleteSingleModal.isOpen}
        title="删除套餐"
        message={deleteSingleModal.setmeal ? `确定要删除套餐\"${deleteSingleModal.setmeal['name']}\"吗？` : ""}
        onConfirm={confirmSingleDelete}
        onCancel={closeDeleteSingleModal}
      />
      {/* 批量删除确认对话框 */}
      <ConfirmationModal
        isOpen={deleteBatchModal.isOpen}
        title="批量删除套餐"
        message={checkedIds.length > 0
          ? `确定删除选中的${checkedIds.length}个套餐吗？`
          : "没有选中任何套餐"}
        onConfirm={confirmBatchDelete}
        onCancel={closeDeleteBatchModal}
      />
      {/* 状态切换确认对话框 */}
      <ConfirmationModal
        isOpen={statusModal.isOpen}
        title={statusModal.setmeal?.status === 1 ? "禁用套餐" : "启用套餐"}
        message={`确定要${statusModal.setmeal?.status === 1 ? '禁用' : '启用'}套餐\"${statusModal.setmeal?.name}\"吗？`}
        onConfirm={confirmToggleStatus}
        onCancel={closeStatusModal}
      />
    </div>
  );
};

export default Setmeal;