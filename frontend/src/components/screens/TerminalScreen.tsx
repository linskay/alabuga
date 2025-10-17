import React, { useEffect, useState } from 'react';
import MainButton from '../MainButton';
import styled, { keyframes } from 'styled-components';
import CircularLoader from '../CircularLoader';
import { backend, ShopItemDTO, UserDTO } from '../../api';
import SystemNotification from '../SystemNotification';
import Energon from '../Energon';
import { handleApiError } from '../../utils/errorHandler';

// Фоновое размещение нашей сферической анимации (CircularLoader)
const LoaderBg = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  opacity: 0.18;
  pointer-events: none;
  transform: scale(0.9);
`;

const rocketFly = keyframes`
  0% { transform: translate(-10%, -10%) rotate(-15deg); opacity: 0.6; }
  50% { transform: translate(60%, 20%) rotate(0deg); opacity: 0.9; }
  100% { transform: translate(120%, -10%) rotate(15deg); opacity: 0.6; }
`;

const Rocket = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 18px;
  height: 18px;
  animation: ${rocketFly} 5s ease-in-out infinite;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.7));
`;

const TerminalScreen: React.FC = () => {
  const [tab, setTab] = useState<'nexus' | 'history'>('nexus');
  const [page, setPage] = useState<number>(1);
  const pageSize = 6; // 3x2 на странице

  const [items, setItems] = useState<{ id?: number; title: string; desc: string; price?: number; currency?: string }[]>([]);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<{ title: string; desc: string; price: number; currency: string; purchasedAt: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notif, setNotif] = useState<{ open: boolean; title: string; message?: string; variant?: 'success' | 'info' | 'warning' | 'error' }>({ open: false, title: '' });
  const [confirmPurchase, setConfirmPurchase] = useState<{ open: boolean; item?: { title: string; price: number }; message?: string }>({ open: false });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const login = localStorage.getItem('currentLogin') || 'commander';
        const [userData, shopData] = await Promise.all([
          backend.users.byLogin(login),
          backend.shop.list()
        ]);
        if (!mounted) return;
        
        setUser(userData);
        const mapped = shopData.map((d: ShopItemDTO) => ({ 
          id: d.id,
          title: d.name, 
          desc: d.description || '', 
          price: d.price,
          currency: 'энергоны' 
        }));
        setItems(mapped);
        
        // Загружаем историю покупок
        try {
          console.log('Загружаем историю покупок для пользователя:', userData.id);
          const purchaseHistoryData = await backend.shop.purchaseHistory(userData.id);
          console.log('Получены данные истории покупок:', purchaseHistoryData);
          const formattedHistory = purchaseHistoryData.map(purchase => ({
            title: purchase.itemName,
            desc: purchase.itemDescription || '',
            price: purchase.pricePaid,
            currency: 'энерг.',
            purchasedAt: new Date(purchase.purchasedAt).toLocaleDateString('ru-RU')
          }));
          console.log('Отформатированная история:', formattedHistory);
          setPurchaseHistory(formattedHistory);
        } catch (e: any) {
          console.warn('Не удалось загрузить историю покупок:', e?.message);
          setPurchaseHistory([]);
        }
      } catch (e: any) {
        setError(e?.message || 'Не удалось загрузить данные');
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Отладочная информация для истории покупок
  console.log('Отображаем историю покупок:', purchaseHistory);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePurchase = async () => {
    if (!confirmPurchase.item || !user) return;
    
    // Проверяем баланс пользователя
    if (user.energy < confirmPurchase.item.price) {
      setNotif({ 
        open: true, 
        title: 'Недостаточно энергонов', 
        message: `У вас ${user.energy} энергонов, а нужно ${confirmPurchase.item.price}`, 
        variant: 'error' 
      });
      setConfirmPurchase({ open: false });
      return;
    }

    try {
      // Находим ID товара в списке
      const shopItem = items.find(item => item.title === confirmPurchase.item?.title);
      if (!shopItem) {
        throw new Error('Товар не найден');
      }

      // Вызываем API для покупки
      const purchaseResult = await backend.shop.purchase(user.id, shopItem.id || 0) as any;
      
      // Обновляем данные пользователя
      const updatedUser = await backend.users.byLogin(user.login);
      setUser(updatedUser);
      
      // Обновляем историю покупок
      try {
        const purchaseHistoryData = await backend.shop.purchaseHistory(user.id);
        const formattedHistory = purchaseHistoryData.map(purchase => ({
          title: purchase.itemName,
          desc: purchase.itemDescription || '',
          price: purchase.pricePaid,
          currency: 'энерг.',
          purchasedAt: new Date(purchase.purchasedAt).toLocaleDateString('ru-RU')
        }));
        setPurchaseHistory(formattedHistory);
      } catch (e: any) {
        console.warn('Не удалось обновить историю покупок:', e?.message);
      }
      
      setNotif({ 
        open: true, 
        title: 'Покупка оформлена', 
        message: purchaseResult.confirmationMessage || `Товар «${confirmPurchase.item.title}» добавлен. Остаток: ${updatedUser.energy} энергонов`, 
        variant: 'success' 
      });
      setConfirmPurchase({ open: false });
    } catch (e: any) {
      const errorInfo = handleApiError(e, 'Ошибка покупки', 'Не удалось оформить покупку');
      setNotif({ open: true, ...errorInfo });
    }
  };

  const closePurchaseConfirm = () => {
    setConfirmPurchase({ open: false });
  };

  const openPurchaseConfirm = async (item: { id?: number; title: string; price: number }) => {
    if (!canAfford(item.price)) return;
    
    try {
      const confirmationData = await backend.messages.purchase(item.id || 0);
      setConfirmPurchase({ 
        open: true, 
        item: { title: item.title, price: item.price },
        message: confirmationData.message
      });
    } catch (e: any) {
      console.warn('Не удалось получить сообщение подтверждения:', e?.message);
      setConfirmPurchase({ 
        open: true, 
        item: { title: item.title, price: item.price },
        message: `На покупку товара «${item.title}» вы потратите ${item.price} Энергонов. Подтвердите выбор?`
      });
    }
  };

  const canAfford = (price: number): boolean => {
    return user ? user.energy >= price : false;
  };

  return (
    <div className="h-full pb-8 relative">
      <LoaderBg>
        <CircularLoader />
      </LoaderBg>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <MainButton onClick={() => setTab('nexus')} className={tab === 'nexus' ? '' : 'opacity-70'}>
          Нексус
        </MainButton>
        <MainButton onClick={() => setTab('history')} className={tab === 'history' ? '' : 'opacity-70'}>
          История
        </MainButton>
      </div>

      {tab === 'nexus' && (
        <div className="px-8 lg:px-16 xl:px-24">
          {error && (
            <div className="mb-4 text-sm text-red-300">{error} — показаны демонстрационные данные</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {pageItems.map((it, i) => (
              <div key={i} className={`group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1 w-full max-w-[280px] sm:max-w-[300px] h-[380px] sm:h-[400px] ${!canAfford(it.price || 0) ? 'opacity-70' : ''}`}>
                <div className={`text-white rounded-2xl border border-white/10 shadow-2xl relative backdrop-blur-xl overflow-hidden hover:border-white/25 hover:shadow-white/5 w-full h-full flex flex-col ${!canAfford(it.price || 0) ? 'border-red-400/30' : ''}`}>
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <div style={{ background: 'linear-gradient(135deg, rgba(0,174,239,0.05), rgba(0,174,239,0.12))' }} className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transform group-hover:scale-110 transition-all duration-700" style={{ background: 'radial-gradient(circle, rgba(0,174,239,0.2), transparent 60%)' }}></div>
                    <div className="absolute top-10 left-10 w-16 h-16 rounded-full blur-xl" style={{ backgroundColor: 'rgba(0,174,239,0.15)' }}></div>
                    <div className="absolute bottom-16 right-16 w-12 h-12 rounded-full blur-lg" style={{ backgroundColor: 'rgba(0,174,239,0.12)' }}></div>
                    <div className="absolute inset-0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.15), transparent)' }}></div>
                  </div>
                  <div className="p-6 relative z-10 text-center flex flex-col justify-between h-full" style={{ background: 'linear-gradient(135deg, #031521, #061a27)' }}>
                    {/* Верхняя секция - иконка и заголовок */}
                    <div className="flex-shrink-0">
                      <Rocket>
                        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path fill="#ffffff" d="M12 2c3.5 0 6 2.5 6 2.5s-.3 3.2-2.1 5c-.5.5-1 .9-1.6 1.2l-.8 2c-.2.6-.7 1-1.3 1.2l-2 .7c-.3.1-.6.1-.8-.1l-1.9-1.9c-.2-.2-.2-.5-.1-.8l.7-2c.2-.6.6-1.1 1.2-1.3l2-.8c.3-.6.7-1.1 1.2-1.6C14.8 4.8 18 4.5 18 4.5S15.5 2 12 2zm-6.6 9.9l2.7.7-.7 2.1-2.7-.7.7-2.1zM6 16l2 2-3 1 1-3z"/>
                        </svg>
                      </Rocket>
                      <h3 className="mb-2 text-xl font-bold" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.95), rgba(200,240,255,0.95))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                        {it.title}
                      </h3>
                    </div>

                    {/* Средняя секция - описание и цена */}
                    <div className="flex-grow flex flex-col justify-center">
                      <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(200,240,255,0.85)' }}>{it.desc}</p>
                      {it.price && (
                        <div className="flex items-center justify-center gap-2 text-base font-bold" style={{ color: !canAfford(it.price) ? 'rgba(239,68,68,0.9)' : 'rgba(0,174,239,0.9)' }}>
                          {it.price}
                          <Energon size={18} />
                          {!canAfford(it.price) && (
                            <span className="text-xs text-red-400 ml-2">Недостаточно</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Нижняя секция - разделитель и кнопка */}
                    <div className="flex-shrink-0">
                      <div className="w-1/3 h-0.5 rounded-full mx-auto mb-4" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.8), transparent)' }}></div>
                      <MainButton
                        onClick={() => openPurchaseConfirm({ id: it.id, title: it.title, price: it.price || 0 })}
                        className={`px-5 py-2 ${!canAfford(it.price || 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!canAfford(it.price || 0)}
                      >
                        {!canAfford(it.price || 0) ? 'Недостаточно средств' : 'Купить'}
                      </MainButton>
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>
          <div className="mt-8 flex items-center justify-center space-x-4">
            <MainButton
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              ← Назад
            </MainButton>
            <span className="text-white/80 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              Страница {currentPage} из {totalPages}
            </span>
            <MainButton
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              Вперёд →
            </MainButton>
          </div>
    </div>
      )}

      {tab === 'history' && (
        <div className="px-8 lg:px-16 xl:px-24">
          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl" style={{ border: '1px solid rgba(0,174,239,0.25)', background: 'linear-gradient(135deg, #031521, #061a27)' }}>
            <div className="h-12 flex items-center px-4" style={{ background: 'linear-gradient(90deg, rgba(0,174,239,0.25), rgba(0,174,239,0.12), transparent)' }}>
              <span className="font-semibold" style={{ color: 'rgba(200,240,255,0.95)' }}>История покупок</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(0,174,239,0.12)' }}>
              {purchaseHistory.length > 0 ? (
                purchaseHistory.map((purchase, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-4 px-4 py-3 transition-colors" style={{ color: 'rgba(200,240,255,0.9)' }}>
                    <div className="font-medium truncate" title={purchase.title}>{purchase.title}</div>
                    <div className="text-center flex items-center justify-center gap-1" style={{ color: 'rgba(0,174,239,0.9)' }}>
                      {purchase.price} <Energon size={16} /> энерг.
                    </div>
                    <div className="text-right" style={{ color: 'rgba(200,240,255,0.85)' }}>{purchase.purchasedAt}</div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center" style={{ color: 'rgba(200,240,255,0.6)' }}>
                  История покупок пуста
                </div>
              )}
            </div>
            <div className="h-1 animate-pulse" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,174,239,0.45), transparent)' }} />
          </div>
        </div>
      )}

      {/* Purchase Confirmation Modal */}
      {confirmPurchase.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closePurchaseConfirm} />
          <div className="relative z-[110] w-[90%] max-w-md rounded-2xl border border-cyan-400/30 bg-slate-900/80 p-6 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(34,211,238,0.25), inset 0 0 30px rgba(34,211,238,0.15)' }} />
            <h3 className="text-xl font-bold text-cyan-300 mb-2">Сообщение от бортпомощника</h3>
            <p className="text-gray-300 text-sm mb-4">
              {confirmPurchase.message || `На покупку товара «${confirmPurchase.item?.title}» вы потратите ${confirmPurchase.item?.price} Энергонов. Подтвердите выбор?`}
            </p>
            <p className="text-gray-400 text-xs mb-6">Подтвердите выбор</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={closePurchaseConfirm} 
                className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition"
              >
                Отмена
              </button>
              <button 
                onClick={handlePurchase} 
                className="px-4 py-2 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/30 transition"
              >
                Да
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerminalScreen;
