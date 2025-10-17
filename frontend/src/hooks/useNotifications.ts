import { useState, useCallback } from 'react';
import { Notification } from '../components/NotificationPanel';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Добро пожаловать в Нексус!',
      message: 'Вы успешно подключились к системе управления космической станцией.',
      type: 'success',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 часа назад
      read: false
    },
    {
      id: '2',
      title: 'Новое задание доступно',
      message: 'Миссия "Исследование астероида Альфа-7" готова к выполнению.',
      type: 'info',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 час назад
      read: false
    },
    {
      id: '3',
      title: 'Обновление системы',
      message: 'Система безопасности обновлена до версии 2.1.4',
      type: 'info',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 минут назад
      read: true
    },
    {
      id: '4',
      title: 'Предупреждение о ресурсах',
      message: 'Уровень Энергонов критически низок. Пополните баланс.',
      type: 'warning',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 минут назад
      read: false
    },
    {
      id: '5',
      title: 'Достижение разблокировано',
      message: 'Получено достижение "Первый полет" за завершение первой миссии.',
      type: 'success',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 минут назад
      read: false
    }
  ]);

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const togglePanel = useCallback(() => {
    setIsPanelOpen(prev => !prev);
  }, []);

  const openPanel = useCallback(() => {
    setIsPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    isPanelOpen,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    togglePanel,
    openPanel,
    closePanel
  };
};
