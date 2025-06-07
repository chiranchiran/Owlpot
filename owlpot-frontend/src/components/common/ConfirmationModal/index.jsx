import React from 'react';
import './index.css';
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay ">
      <div className="confirm-modal-content">
        <div >
          <h3>{title}</h3>
        </div>
        <div className="modal-body1">
          <p>{message}</p>
        </div>
        <div className="modal-actions">
          <button className="modal-button cancel" onClick={onCancel}>取消</button>
          <button className="modal-button confirm" onClick={onConfirm}>确定</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;