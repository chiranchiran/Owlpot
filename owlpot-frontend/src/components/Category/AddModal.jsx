import React from 'react';

const AddModal = ({ onClose, title }) => {
  return (
    <div className="add-category-modal">
      <div className="modal-header">
        <h3>{title}</h3>
        <span className="close-button" onClick={onClose}>×</span>
      </div>
      <div className="modal-body">
        <div className="form-group">
          <label htmlFor="dishCategoryName">* 分类名称:</label>
          <input
            type="text"
            id="dishCategoryName"
            placeholder="请输入分类名称"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dishCategorySort">* 排序:</label>
          <input
            type="number"
            id="dishCategorySort"
            placeholder="请输入排序"
          />
        </div>
      </div>
      <div className="modal-footer">
        <button className="cancel-button" onClick={onClose}>取消</button>
        <button className="confirm-button">确定</button>
        <button className="continue-button">保存并继续添加</button>
      </div>
    </div>
  );
};

export default AddModal;