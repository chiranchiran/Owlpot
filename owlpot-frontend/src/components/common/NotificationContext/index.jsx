import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification, selectNotification, showNotification } from '../../../redux/slices/notificationSlice';
import './index.css';

const Notification = () => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const notificationRefs = useRef({});
  const currentNotification = useSelector(selectNotification);

  // 当有新的通知到来时
  useEffect(() => {
    if (currentNotification.visible && currentNotification.message) {
      const newNotification = {
        ...currentNotification,
        id: Date.now().toString(),
        exiting: false
      };

      setNotifications(prev => [newNotification, ...prev]);

      // 重置通知状态
      dispatch(hideNotification());
    }
  }, [currentNotification, dispatch]);

  // 自动移除通知
  useEffect(() => {
    const timers = notifications.map(notification => {
      return setTimeout(() => {
        // 标记为退出状态
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, exiting: true } : n
          )
        );

        // 完全移除
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 300);
      }, 3000);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications]);

  // 手动关闭通知
  const handleClose = (id) => {
    // 标记为退出状态
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, exiting: true } : n
      )
    );

    // 完全移除
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 300);
  };

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          ref={(el) => (notificationRefs.current[notification.id] = el)}
          className={`notification ${notification.type} ${notification.exiting ? 'exiting' : ''}`}
        >
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
          <button
            className="notification-close"
            onClick={() => handleClose(notification.id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

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

  const show = (message, type = 'info') => {
    dispatch(showNotification({ message, type }));
  };

  return { showNotification: show };
};