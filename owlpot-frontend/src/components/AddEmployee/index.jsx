import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAddEmployee, useUpdateEmployee, useEmployee } from '../../hooks/useEmployee';
import ConfirmationModal from '../common/ConfirmationModal';
import { useNotification } from '../common/NotificationContext';
import './index.css';

const AddEmployee = () => {

  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { id } = useParams();
  const [andUp, setAndUp] = useState(false);
  const isEditMode = !!id;
  // 表单状态
  const [formData, setFormData] = useState({
    username: '',
    role: 0,
    name: '',
    phone: '',
    gender: 1, // 1:男, 0:女
    idNumber: null,
    status: 1 // 1:启用, 0:禁用
  });

  // 是否显示取消确认对话框
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showUpConfirm, setShowUpConfirm] = useState(false);
  // 表单原始数据（用于编辑模式下的重置）
  const [originalData, setOriginalData] = useState(null);
  // 查询单个员工（编辑模式）
  const { data: employeeData } = useEmployee(id);
  // 添加员工Mutation
  const addMutation = useAddEmployee();
  // 更新员工Mutation
  const updateMutation = useUpdateEmployee();
  // 当获取到员工数据时填充表单
  useEffect(() => {
    if (isEditMode && employeeData) {
      const data = {
        username: employeeData.username === null ? employeeData.username : '',
        role: employeeData.role === null ? employeeData.role : 0,
        name: employeeData.name === null ? employeeData.name : '',
        phone: employeeData.phone === null ? employeeData.phone : '',
        gender: employeeData.gender === null ? employeeData.gender : 1,
        idNumber: employeeData.idNumber === null ? employeeData.idNumber : '',
        status: employeeData.status === null ? employeeData.status : 0
      };
      setFormData(data);
      setOriginalData(data); // 保存原始数据用于重置
    } else {
      // 新增模式设置默认值
      setFormData({
        username: '',
        role: 0,
        name: '',
        phone: '',
        gender: 1,
        idNumber: '',
        status: 0
      });
    }
  }, [employeeData, isEditMode]);

  // 处理表单变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'gender' ? parseInt(value) : name === 'role' ? parseInt(value) : name === 'status' ? parseInt(value) : value
    });
  };

  // 表单验证
  const validateForm = () => {
    const errors = {};

    // 账号验证（添加时验证）
    if (!isEditMode) {
      if (!formData.username) {
        errors.username = '账号不能为空';
      } else if (!/^\w{6,16}$/.test(formData.username)) {
        errors.username = '账号格式不正确（6-16位字母数字下划线）';
      }
    }

    // 姓名验证
    if (!formData.name) {
      errors.name = '姓名不能为空';
    } else if (!/^[\u4e00-\u9fa5a-zA-Z]{1,12}$/.test(formData.name)) {
      errors.name = '姓名格式不正确（1-12个汉字或字母）';
    }

    // 手机号验证
    if (!formData.phone) {
      errors.phone = '手机号不能为空';
    } else if (!/^\d{11}$/.test(formData.phone)) {
      errors.phone = '手机号格式不正确（11位数字）';
    }

    // 身份证验证（选填，但如果填写了需要验证格式）
    if (formData.idNumber) {
      if (!/^\d{17}[\dXx]$/.test(formData.idNumber)) {
        errors.idNumber = '身份证格式不正确';
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  // 处理表单提交
  const handleSave = (e, saveAndContinue = false) => {

    e.preventDefault();
    setShowUpConfirm(true);
    setAndUp(saveAndContinue)
  }
  const confirmSave = () => {
    setShowUpConfirm(false);
    const errors = validateForm();
    if (errors) {
      showNotification(Object.values(errors)[0], "error");
      return;
    }

    if (isEditMode) {
      // 更新员工
      updateMutation.mutate({
        id,
        ...formData
      });
    } else {
      // 添加员工
      addMutation.mutate(formData, {
        onSuccess: () => {
          if (andUp) {
            // 保存并继续添加：清空表单
            setFormData({
              username: '',
              role: 0,
              name: '',
              phone: '',
              gender: 1,
              idNumber: '',
              status: 0
            });
          } else {
            navigate('/employee')
          }
        }
      });
    }
  }
  // 确认取消
  const confirmCancel = () => {
    navigate('/employee');
  };

  // 重置表单（编辑模式下使用）
  const resetForm = () => {
    if (originalData) {
      setFormData(originalData);
    }
  };
  return (
    <div className="add-employee">
      <div className="add-employee-header">
        <h3>{isEditMode ? '编辑员工信息' : '添加新员工'}</h3>
      </div>

      <form>
        <div className="form-group">
          <label>* 身份:</label>
          <div className="gender-radio">
            <label>
              <input
                type="radio"
                name="role"
                value={1}
                checked={formData.role === 1}
                onChange={handleChange}
              />
              管理员
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value={0}
                checked={formData.role === 0}
                onChange={handleChange}
              />
              员工
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="account">* 账号:</label>
          <input
            type="text"
            name="username"
            placeholder="请输入账号"
            value={formData.username}
            onChange={handleChange}
            disabled={isEditMode} // 编辑模式下禁用账号修改
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">* 员工姓名:</label>
          <input
            type="text"
            name="name"
            placeholder="请输入员工姓名"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">* 手机号:</label>
          <input
            type="text"
            name="phone"
            placeholder="请输入手机号"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>* 性别:</label>
          <div className="gender-radio">
            <label>
              <input
                type="radio"
                name="gender"
                value={1}
                checked={formData.gender === 1}
                onChange={handleChange}
              />
              男
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value={0}
                checked={formData.gender === 0}
                onChange={handleChange}
              />
              女
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="idCard">身份证号:</label>
          <input
            type="text"
            name="idNumber"
            placeholder="请输入身份证号（选填）"
            value={formData.idNumber}
            onChange={handleChange}
          />
        </div>
        {/* 编辑模式下显示状态选择 */}
        {isEditMode && (
          <div className="form-group">
            <label>* 账号状态:</label>
            <div className="gender-radio">
              <label>
                <input
                  type="radio"
                  name="status"
                  value={1}
                  checked={formData.status > 0}
                  onChange={handleChange}
                />
                启用
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value={0}
                  checked={formData.status === 0}
                  onChange={handleChange}
                />
                禁用
              </label>
            </div>
          </div>

        )}

        <div className="form-buttons">
          {isEditMode ? (
            <>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowCancelConfirm(true)}
              >
                取消并返回
              </button>
              <button
                type="button"
                className="save-and-continue-button"
                onClick={resetForm}
              >
                重置
              </button>
              <button
                type="button"
                className="save-button"
                onClick={(e) => handleSave(e)}
              >
                保存修改
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowCancelConfirm(true)}
              >
                取消并返回
              </button>
              <button
                type="button"
                className="save-button"
                onClick={(e) => handleSave(e, false)}
              >
                保存
              </button>
              <button
                type="button"
                className="save-and-continue-button"
                onClick={(e) => handleSave(e, true)}
              >
                保存并继续添加
              </button>
            </>
          )}
        </div>
      </form>

      {/* 取消确认对话框 */}
      <ConfirmationModal
        isOpen={showCancelConfirm}
        title="取消"
        message="确定要取消吗？所有输入将丢失。"
        onConfirm={confirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
      <ConfirmationModal
        isOpen={showUpConfirm}
        title="提交"
        message="确定要提交吗？"
        onConfirm={confirmSave}
        onCancel={() => setShowUpConfirm(false)}
      />
    </div>
  );
};

export default AddEmployee;