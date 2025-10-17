import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
// three.js no longer used here

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

          <div className="panel-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="panel"
            >
              <div className="panel-stars">
                <div className="stars stars-near" />
                <div className="stars stars-mid" />
                <div className="stars stars-far" />
              </div>
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

            {/* Footer with robot */}
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
              <div className="robot-container">
                <SpaceLoader />
              </div>
            </div>
            </motion.div>
          </div>
        </StyledWrapper>
      )}
    </AnimatePresence>
  );
};

// Imperative Three.js canvas without watermark
// previously: RobotCanvas (three.js) — removed

// CSS astronaut loader provided by user, wrapped as React component
const SpaceLoader: React.FC = () => {
  return (
    <SpaceLoaderWrapper>
      <div className="space-loader">
        <div className="astronaut">
          <div className="astronaut-helmet">
            <div className="helmet-glass">
              <div className="helmet-inner-glass" />
              <div className="helmet-reflection" />
            </div>
            <div className="antenna" />
          </div>
          <div className="astronaut-body">
            <div className="suit-pattern" />
            <div className="suit-details" />
            <div className="backpack">
              <div className="tank tank-1" />
              <div className="tank tank-2" />
              <div className="pipe" />
            </div>
            <div className="arm arm-left">
              <div className="glove" />
            </div>
            <div className="arm arm-right">
              <div className="glove" />
            </div>
            <div className="leg leg-left">
              <div className="boot" />
            </div>
            <div className="leg leg-right">
              <div className="boot" />
            </div>
          </div>
        </div>
        <div className="space-environment">
          <div className="stars-container">
            <div className="stars stars-near" />
            <div className="stars stars-mid" />
            <div className="stars stars-far" />
          </div>
          <div className="planets">
            <div className="planet planet-1">
              <div className="planet-ring" />
              <div className="planet-crater" />
            </div>
            <div className="planet planet-2">
              <div className="planet-atmosphere" />
            </div>
          </div>
          <div className="meteors">
            <div className="meteor meteor-1" />
            <div className="meteor meteor-2" />
            <div className="meteor meteor-3" />
          </div>
          <div className="orbit-paths">
            <div className="orbit-path path-1" />
            <div className="orbit-path path-2" />
            <div className="orbit-path path-3" />
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-progress">
            <div className="progress-bar" />
          </div>
          <div className="loading-text">
            LOADING SPACE MISSION<span>.</span><span>.</span><span>.</span>
          </div>
        </div>
      </div>
    </SpaceLoaderWrapper>
  );
};

const SpaceLoaderWrapper = styled.div`
  .space-loader { position: relative; width: 300px; height: 300px; background: radial-gradient(circle at center, #1a1a2e 0%, #0f0f1e 50%, #080810 100%); border-radius: 50%; box-shadow: 0 0 60px rgba(0,0,0,0.6), inset 0 0 50px rgba(255,255,255,0.05); overflow: hidden; margin: 0 auto; }
  .astronaut { position: absolute; left: 50%; top: 50%; width: 70px; height: 90px; transform: translate(-50%, -50%); animation: float 4s ease-in-out infinite; }
  .astronaut-helmet { position: absolute; width: 45px; height: 45px; background: linear-gradient(145deg, #ffffff, #e6e6e6); border-radius: 50%; top: 0; left: 50%; transform: translateX(-50%); box-shadow: inset -3px -3px 8px rgba(0,0,0,0.2), 2px 2px 4px rgba(255,255,255,0.1); }
  .helmet-glass { position: absolute; width: 35px; height: 25px; background: linear-gradient(135deg, rgba(0,255,255,0.2), rgba(0,0,255,0.1)); border-radius: 50% 50% 45% 45%; top: 12px; left: 5px; overflow: hidden; }
  .helmet-inner-glass { position: absolute; inset: 2px; background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.1) 100%); border-radius: inherit; animation: glass-shine 3s ease-in-out infinite; }
  .helmet-reflection { position: absolute; width: 15px; height: 15px; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 70%); border-radius: 50%; top: 2px; left: 2px; animation: reflection-move 4s ease-in-out infinite; }
  .antenna { position: absolute; width: 3px; height: 15px; background: #ccc; top: -12px; left: 50%; transform: translateX(-50%); }
  .antenna::after { content: ""; position: absolute; width: 6px; height: 6px; background: #ff3333; border-radius: 50%; top: -3px; left: 50%; transform: translateX(-50%); animation: blink 1s ease-in-out infinite; }
  .astronaut-body { position: absolute; width: 45px; height: 55px; background: linear-gradient(145deg, #ffffff, #f0f0f0); border-radius: 25px; top: 40px; left: 50%; transform: translateX(-50%); box-shadow: inset -4px -4px 8px rgba(0,0,0,0.2), 2px 2px 4px rgba(255,255,255,0.1); overflow: hidden; }
  .suit-pattern { position: absolute; inset: 0; background: linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.05) 50%), linear-gradient(0deg, transparent 50%, rgba(0,0,0,0.05) 50%); background-size: 4px 4px; }
  @keyframes float { 0%,100% { transform: translate(-50%, -50%) translateY(-10px) rotate(-2deg);} 50% { transform: translate(-50%, -50%) translateY(10px) rotate(2deg);} }
  @keyframes glass-shine { 0%,100% { opacity: 0.3; transform: translateX(-100%) rotate(-45deg);} 50% { opacity: 0.8; transform: translateX(100%) rotate(-45deg);} }
  @keyframes reflection-move { 0%,100% { transform: translate(0,0);} 50% { transform: translate(5px,5px);} }
  @keyframes blink { 0%,100% { opacity: 0.3;} 50% { opacity: 1;} }
`;
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
    position: relative;
    width: min(680px, 92vw);
    max-height: 80vh;
    background: radial-gradient(circle at center, #121428 0%, #0c0f20 60%, #090b18 100%);
    border: 2px solid rgba(0, 174, 239, 0.3);
    box-shadow: 0 0 40px rgba(0, 174, 239, 0.25);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    overflow: hidden;
  }

  .panel-stars {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .panel > *:not(.panel-stars) {
    position: relative;
    z-index: 1;
  }

  .stars { position: absolute; inset: 0; background-repeat: repeat; opacity: 0.45; }
  .stars-near { background-image: radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.9), rgba(255,255,255,0)), radial-gradient(2px 2px at 100px 80px, rgba(255,255,255,0.9), rgba(255,255,255,0)), radial-gradient(2px 2px at 200px 120px, rgba(255,255,255,0.9), rgba(255,255,255,0)); background-size: 300px 200px; animation: starScroll1 40s linear infinite; }
  .stars-mid { background-image: radial-gradient(1.5px 1.5px at 60px 40px, rgba(255,255,255,0.7), rgba(255,255,255,0)), radial-gradient(1.5px 1.5px at 160px 140px, rgba(255,255,255,0.7), rgba(255,255,255,0)), radial-gradient(1.5px 1.5px at 260px 100px, rgba(255,255,255,0.7), rgba(255,255,255,0)); background-size: 400px 250px; animation: starScroll2 80s linear infinite; opacity: 0.35; }
  .stars-far { background-image: radial-gradient(1px 1px at 30px 50px, rgba(255,255,255,0.5), rgba(255,255,255,0)), radial-gradient(1px 1px at 130px 150px, rgba(255,255,255,0.5), rgba(255,255,255,0)), radial-gradient(1px 1px at 230px 90px, rgba(255,255,255,0.5), rgba(255,255,255,0)); background-size: 500px 300px; animation: starScroll3 120s linear infinite; opacity: 0.25; }

  @keyframes starScroll1 { from { background-position: 0 0; } to { background-position: -600px -400px; } }
  @keyframes starScroll2 { from { background-position: 0 0; } to { background-position: -400px -300px; } }
  @keyframes starScroll3 { from { background-position: 0 0; } to { background-position: -300px -200px; } }

  .panel-center {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .panel-center > * {
    pointer-events: auto;
  }

  .panel-header {
    padding: 16px 20px;
    border-bottom: 1px solid rgba(0, 174, 239, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(180deg, rgba(0,174,239,0.08), transparent);
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
    padding: 12px 16px;
    background: radial-gradient(ellipse at top, rgba(0,174,239,0.08), rgba(0,0,0,0) 60%);
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
    padding: 16px 20px 12px;
    border-top: 1px solid rgba(0, 174, 239, 0.2);
    position: relative;
    background: radial-gradient(ellipse at bottom, rgba(0,174,239,0.12), rgba(15,17,26,0.4));
  }

  .stats {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
  }

  .robot-container {
    position: relative;
    width: 100%;
    height: 320px;
    margin-top: 12px;
    border: 1px solid rgba(0, 174, 239, 0.2);
    border-radius: 10px;
    overflow: hidden;
    background: radial-gradient(ellipse at bottom, rgba(0, 174, 239, 0.12), rgba(15, 17, 26, 0.35));
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .robot-canvas {
    position: relative;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  /* Hide Spline watermark inside the robot container */
  .robot-container a[href*="spline.design"],
  .robot-container [class*="watermark"],
  .robot-container [data-testid*="watermark"],
  .robot-container [aria-label*="Built with Spline"],
  .robot-container [aria-label*="Spline"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
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
