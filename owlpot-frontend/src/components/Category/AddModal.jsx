import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../common/ConfirmationModal';
import { useCategory, useAddCategory, useUpdateCategory } from '../../hooks/useCategory';
import { useNotification } from '../common/NotificationContext';

const AddModal = ({ onClose, type, id }) => {
  const { showNotification } = useNotification()
  // 初始化表单状态
  const isEditMode = !!id;
  const title = (type, isEditMode) => {
    if (isEditMode) {
      return type > 0 ? '修改套餐分类' : '修改菜品分类'
    }
    return type > 0 ? '新建套餐分类' : '新建菜品分类'
  }
  const [andUp, setAndUp] = useState(false);
  // 表单状态
  const [formData, setFormData] = useState({
    type,
    name: '',
    orderNumber: ''
  });

  // 是否显示取消确认对话框
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showUpConfirm, setShowUpConfirm] = useState(false);
  // 表单原始数据（用于编辑模式下的重置）
  const [originalData, setOriginalData] = useState(null);

  // 查询单个分类（编辑模式）
  const { data: categoryData } = useCategory(id);

  // 添加分类Mutation
  const addMutation = useAddCategory();
  // 更新分类Mutation
  const updateMutation = useUpdateCategory();

  // 当获取到分类数据时填充表单
  useEffect(() => {
    if (isEditMode && categoryData) {
      const data = {
        type,
        name: categoryData.name || '',
        orderNumber: categoryData.orderNumber !== null ? categoryData.orderNumber : '',
      };
      setFormData(data);
      setOriginalData(data); // 保存原始数据用于重置
    } else {
      // 新增模式设置默认值
      setFormData({
        type,
        name: '',
        orderNumber: '',
      });
    }
  }, [categoryData, isEditMode]);

  // 处理表单变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'orderNumber' ? parseInt(value) : value
    });
  };

  // 表单验证
  const validateForm = () => {
    const errors = {};
    // 姓名验证
    if (!formData.name) {
      errors.name = '分类名称不能为空';
    } else if (!/^.{2,20}$/.test(formData.name)) {
      errors.name = '分类名称格式不正确（2-20个任意字符）';
    }

    // 手机号验证
    if (formData.orderNumber === '') {
      errors.orderNumber = '排序不能为空';
    } else if (!/^(0|[1-9]\d?|99)$/.test(formData.orderNumber)) {
      errors.orderNumber = '排序格式不正确（0-99整数）';
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
      // 更新分类
      updateMutation.mutate({
        id,
        ...formData
      }, {
        onSuccess: onClose
      }
      );
    } else {
      // 添加分类
      addMutation.mutate(formData, {
        onSuccess: () => {
          if (andUp) {
            // 保存并继续添加：清空表单
            setFormData({
              name: '',
              orderNumber: ''
            });
          } else {
            onClose()
          }
        }
      });
    }
  }
  // 确认取消
  const confirmCancel = () => {
    onClose()
  };

  // 重置表单（编辑模式下使用）
  const resetForm = () => {
    if (originalData) {
      setFormData(originalData);
    }
  };

  return (
    <div className="add-category-modal add">
      <div className="modal-header">
        <h3>{title(type, isEditMode)}</h3>
        <span className="close-button" onClick={onClose}>×</span>
      </div>
      <div className="modal-body">
        <form>
          <div className="form-group">
            <label htmlFor="dishCategoryName">* 分类名称:</label>
            <input
              type="text"
              id="dishCategoryName"
              name="name"
              value={formData.name}
              placeholder="请输入分类名称"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dishCategorySort">* 排序:</label>
            <input
              type="number"
              name="orderNumber"
              id="dishCategorySort"
              min="0"
              max="99"
              value={formData.orderNumber}
              placeholder="请输入排序"
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
      {isEditMode ?
        (
          <div className="modal-footer">
            <button className="cancel-button" onClick={() => setShowCancelConfirm(true)}>取消</button>
            <button className="continue-button" onClick={resetForm}>重置</button>
            <button className="confirm-button" onClick={(e) => handleSave(e, false)}>保存</button>

          </div>)
        : (
          <div className="modal-footer">
            <button className="cancel-button" onClick={() => setShowCancelConfirm(true)}>取消</button>
            <button className="confirm-button" onClick={(e) => handleSave(e, false)}>保存</button>
            <button className="continue-button" onClick={(e) => handleSave(e, true)}>保存并继续添加</button>
          </div>
        )
      }
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

export default AddModal;