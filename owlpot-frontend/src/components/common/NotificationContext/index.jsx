// src/features/notification/NotificationProvider.js
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification, selectNotification, showNotification } from '../../../redux/slices/notificationSlice';
import './index.css'; // 保留原有样式

const Notification = () => {
  const dispatch = useDispatch();
  const notification = useSelector(selectNotification);

  useEffect(() => {
    let timer;
    if (notification.visible) {
      timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [notification.visible, dispatch]);

  if (!notification.visible) return null;

  return (
    <div className={`notification ${notification.type}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {notification.type === 'success' && '✓'}
          {notification.type === 'error' && '✕'}
          {notification.type === 'warning' && '⚠'}
          {notification.type === 'info' && 'i'}
        </div>
        <div className="notification-message">{notification.message}</div>
      </div>
      <div className="notification-progress"></div>
    </div>
  );
};

// 提供器组件
export const NotificationProvider = ({ children }) => {
  return (
    <>
      {children}
      <Notification />
    </>
  );
};
export const useNotification = () => {
  const dispatch = useDispatch();

  const show = useCallback((message, type = 'info') => {
    dispatch(showNotification({ message, type }));
  }, [dispatch]);

  return { showNotification: show };
};