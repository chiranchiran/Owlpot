import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelect } from '../../hooks/useSelect';
import { getEmployees } from '../../api/employee';
import { useDeleteEmployee, useUpdateEmployee } from '../../hooks/useEmployee';
import Pagination from '../../components/common/Pagination';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useNotification } from '../../components/common/NotificationContext';
import './index.css';
import { useSelector } from 'react-redux';

const Employee = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification(); // 添加这行
  const [searchName, setSearchName] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, employee: null });
  const [statusModal, setStatusModal] = useState({ isOpen: false, employee: null });
  const currenrId = useSelector(state => state.user.id)

  // 使用useSelect获取员工数据
  const employeesQuery = useSelect("employees", getEmployees);

  // 删除员工Mutation
  const deleteMutation = useDeleteEmployee();
  // 更新状态Mutation
  const statusMutation = useUpdateEmployee();

  // 处理搜索
  const handleSearch = () => {
    employeesQuery.setParams({ name: searchName });
  };

  // 打开删除确认对话框
  const openDeleteModal = (employee) => {
    setDeleteModal({ isOpen: true, employee });
  };

  // 关闭删除确认对话框
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, employee: null });
  };

  // 确认删除
  const confirmDelete = () => {
    if (deleteModal.employee) {
      deleteMutation.mutate(deleteModal.employee.id, {
        onSuccess: () => {
          closeDeleteModal();
        },
      });
    }
  };

  // 打开状态切换确认对话框
  const openStatusModal = (employee) => {
    setStatusModal({ isOpen: true, employee });
  };

  // 关闭状态切换确认对话框
  const closeStatusModal = () => {
    setStatusModal({ isOpen: false, employee: null });
  };

  // 确认切换状态
  const confirmToggleStatus = () => {
    if (statusModal.employee) {
      const newStatus = statusModal.employee.status === 1 ? 0 : 1;
      statusMutation.mutate({
        id: statusModal.employee.id,
        status: newStatus
      }, {
        onSuccess: () => {
          showNotification(`员工已${newStatus === 1 ? '启用' : '禁用'}`, 'success'); // 添加通知
          employeesQuery.refetch();
          closeStatusModal();
        },
        onError: () => {
          showNotification('状态更新失败', 'error'); // 添加错误通知
        }
      });
    }
  };

  return (
    <div className="employee-management">
      <div className="search-bar">
        <div className="search seacher">
          <label htmlFor="search" className="seacher">员工姓名:</label>
          <input
            type="text"
            id="search"
            className="seacher"
            placeholder="请输入员工姓名"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-button seacher" onClick={handleSearch}>查询</button>
        </div>

        <button
          className="add-button"
          onClick={() => navigate('/employee/add')}
        >
          + 添加员工
        </button>
      </div>

      <table className="employee-table management">
        <thead>
          <tr>
            <th>身份</th>
            <th>姓名</th>
            <th>账号</th>
            <th>手机号</th>
            <th>账号状态</th>
            <th>最后操作时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {employeesQuery.isLoading ? (
            <tr>
              <td colSpan="6">加载中...</td>
            </tr>
          ) : employeesQuery.isError ? (
            <tr>
              <td colSpan="6">加载失败</td>
            </tr>
          ) : employeesQuery.data?.records.length === 0 ? (
            <tr>
              <td colSpan="6">暂无数据</td>
            </tr>
          ) : (
            employeesQuery.data?.records.map(employee => (
              <tr key={employee.id}>
                <td>{employee.role > 0 ? "管理员" : "员工"}</td>
                <td>{employee.name}</td>
                <td>{employee.username}</td>
                <td>{employee.phone}</td>
                <td>
                  {employee.status === 1 ? (
                    <span className="status-enabled">● 启用</span>
                  ) : (
                    <span className="status-disabled">● 禁用</span>
                  )}
                </td>
                <td>{employee.updateTime}</td>
                <td>
                  {/* 添加条件判断来控制按钮的可用性 */}
                  <span
                    className={`operation ${employee.id === currenrId ? 'disabled' : ''}`}
                    onClick={employee.id === currenrId ? () => { } : () => navigate(`/employee/edit/${employee.id}`)}
                  >
                    {employee.id === currenrId ? '不可修改' : '修改'}
                  </span>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  <span
                    className={`operation ${employee.id === currenrId ? 'disabled' : ''}`}
                    onClick={employee.id === currenrId ? () => { } : () => openStatusModal(employee)}
                  >
                    {employee.id === currenrId ? '不可操作' : (employee.status === 1 ? '禁用' : '启用')}
                  </span>
                  &nbsp;&nbsp;|&nbsp;&nbsp;
                  <span
                    className={`operation delete ${employee.id === currenrId ? 'disabled' : ''}`}
                    onClick={employee.id === currenrId ? () => { } : () => openDeleteModal(employee)}
                  >
                    {employee.id === currenrId ? '不可删除' : '删除'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {employeesQuery.data && (
        <Pagination
          total={employeesQuery.data.total}
          pageSize={employeesQuery.pageSize}
          currentPage={employeesQuery.currentPage}
          onPageChange={employeesQuery.setCurrentPage}
        />
      )}
      {/* 删除确认对话框 */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="删除员工"
        message={`确定要删除员工\"${deleteModal.employee?.name}\"吗？`}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />

      {/* 状态切换确认对话框 */}
      <ConfirmationModal
        isOpen={statusModal.isOpen}
        title={statusModal.employee?.status === 1 ? "禁用员工" : "启用员工"}
        message={`确定要${statusModal.employee?.status === 1 ? '禁用' : '启用'}员工\"${statusModal.employee?.name}\"吗？`}
        onConfirm={confirmToggleStatus}
        onCancel={closeStatusModal}
      />
    </div>
  );
};

export default Employee;