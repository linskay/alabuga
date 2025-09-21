import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <StyledWrapper>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="backdrop"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="panel"
          >
            {/* Header */}
            <div className="panel-header">
              <h3 className="panel-title">
                <span className="mr-2">🔔</span>
                Уведомления Нексус
              </h3>
              <div className="panel-actions">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="mark-all-btn"
                  >
                    Отметить все как прочитанные
                  </button>
                )}
                <button onClick={onClose} className="close-btn">
                  ✕
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🔔</div>
                  <p>Нет новых уведомлений</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => !notification.read && onMarkAsRead(notification.id)}
                  >
                    <div className="notification-content">
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-text">
                        <h4 className="notification-title">{notification.title}</h4>
                        <p className="notification-message">{notification.message}</p>
                        <span className="notification-time">
                          {notification.timestamp.toLocaleString('ru-RU')}
                        </span>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="unread-indicator" />
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="panel-footer">
              <div className="stats">
                <span className="total-count">
                  Всего: {notifications.length}
                </span>
                {unreadCount > 0 && (
                  <span className="unread-count">
                    Непрочитанных: {unreadCount}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </StyledWrapper>
      )}
    </AnimatePresence>
  );
};

const StyledWrapper = styled.div`
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 9999;
  }

  .panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 400px;
    height: 100vh;
    background: linear-gradient(135deg, #191c29 0%, #0f111a 100%);
    border-left: 2px solid rgba(0, 174, 239, 0.3);
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
    z-index: 10000;
    display: flex;
    flex-direction: column;
  }

  .panel-header {
    padding: 20px;
    border-bottom: 1px solid rgba(0, 174, 239, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .panel-title {
    color: white;
    font-size: 18px;
    font-weight: bold;
    margin: 0;
  }

  .panel-actions {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .mark-all-btn {
    background: rgba(0, 174, 239, 0.2);
    border: 1px solid rgba(0, 174, 239, 0.4);
    color: rgb(0, 174, 239);
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(0, 174, 239, 0.3);
      border-color: rgba(0, 174, 239, 0.6);
    }
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
    }
  }

  .notifications-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: rgba(255, 255, 255, 0.6);
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .notification-item {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(0, 174, 239, 0.2);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(0, 174, 239, 0.4);
      transform: translateX(-2px);
    }

    &.unread {
      border-color: rgba(0, 174, 239, 0.5);
      background: rgba(0, 174, 239, 0.05);
    }
  }

  .notification-content {
    display: flex;
    gap: 12px;
  }

  .notification-icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .notification-text {
    flex: 1;
  }

  .notification-title {
    color: white;
    font-size: 14px;
    font-weight: bold;
    margin: 0 0 4px 0;
  }

  .notification-message {
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    margin: 0 0 8px 0;
    line-height: 1.4;
  }

  .notification-time {
    color: rgba(255, 255, 255, 0.5);
    font-size: 11px;
  }

  .unread-indicator {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 8px;
    height: 8px;
    background: rgb(0, 174, 239);
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(0, 174, 239, 0.6);
  }

  .panel-footer {
    padding: 16px 20px;
    border-top: 1px solid rgba(0, 174, 239, 0.2);
  }

  .stats {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
  }

  .unread-count {
    color: rgb(0, 174, 239);
    font-weight: bold;
  }

  /* Scrollbar styling */
  .notifications-list::-webkit-scrollbar {
    width: 6px;
  }

  .notifications-list::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  .notifications-list::-webkit-scrollbar-thumb {
    background: rgba(0, 174, 239, 0.5);
    border-radius: 3px;
  }

  .notifications-list::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 174, 239, 0.7);
  }
`;

export default NotificationPanel;
