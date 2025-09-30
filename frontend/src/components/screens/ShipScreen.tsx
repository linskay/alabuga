import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import ShinyText from '../ShinyText';
import MainButton from '../MainButton';
import { backend, ArtifactDTO, CardDTO, UserCardDTO, API_BASE_URL } from '../../api';
import { handleApiError } from '../../utils/errorHandler';
import Energon from '../Energon';
import { useAppContext } from '../../contexts/AppContext';

const StyledFlip = styled.div`
  .container { width: 240px; height: 294px; perspective: 900px; }
  .card { height: 100%; width: 100%; position: relative; transition: transform 1200ms; transform-style: preserve-3d; border-radius: 2rem; }
  .container:hover > .card { cursor: pointer; transform: rotateY(180deg) rotateZ(180deg); }
  .front, .back { height: 100%; width: 100%; border-radius: 2rem; position: absolute; backface-visibility: hidden; color: #e6f7ff; display: flex; justify-content: center; flex-direction: column; align-items: center; gap: 16px; box-shadow: 0 0 14px 2px rgba(0, 174, 239, 0.35); background: linear-gradient(-135deg, #0a1b2a, #016a8a); }
  .back { transform: rotateY(180deg) rotateZ(180deg); }
  .front-heading, .back-heading { font-size: 14px; font-weight: 700; letter-spacing: .5px; }
`;

const StyledGlow = styled.div`
  .card { position: relative; width: 190px; height: 254px; background: linear-gradient(137deg, rgba(0,174,239,1) 0%, rgba(0,212,255,1) 100%); transition: 0.3s ease; border-radius: 30px; filter: drop-shadow(0 0 30px rgba(0, 174, 239, 0.45)); }
  .card::after { content: ''; background-color: #0b1320; position: absolute; z-index: 1; transition: 0.3s ease; height: 98%; width: 98%; top: 1%; left: 1%; border-radius: 28px; }
  .card:hover { filter: drop-shadow(0 0 30px rgba(0, 174, 239, 0.9)); }
`;

const ShipScreen: React.FC = () => {
  const { refreshUserData } = useAppContext();
  const [pageCosmo, setPageCosmo] = useState(1);
  const [pageArte, setPageArte] = useState(1);
  const pageSize = 6; // 3x2

  const [userCards, setUserCards] = useState<UserCardDTO[]>([]);
  const [availableCards, setAvailableCards] = useState<CardDTO[]>([]);
  const [artefacts, setArtefacts] = useState<{ id: number; name?: string; rarity?: string; isEquipped?: boolean }[]>([]);
  const [userArtifacts, setUserArtifacts] = useState<{ id: number; name?: string; rarity?: string; isEquipped?: boolean; imageUrl?: string; image_url?: string }[]>([]);
  const [equippedArtifacts, setEquippedArtifacts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolveImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return url;
    // Normalize singular 'card' to plural 'cards' to match public folder structure
    if (url.startsWith('/images/card/')) return url.replace('/images/card/', '/images/cards/');
    if (url.startsWith('images/card/')) return `/${url.replace('images/card/', 'images/cards/')}`;
    // Ensure artefact assets load from public folder
    if (url.startsWith('/images/artefacts/')) return url; // public static (British spelling)
    if (url.startsWith('images/artefacts/')) return `/${url}`; // ensure leading slash
    if (url.startsWith('/images/artifacts/')) return url; // support alt spelling if present
    if (url.startsWith('/images/cards/')) return url; // public static
    if (url.startsWith('/')) return `${API_BASE_URL}${url}`; // backend static
    if (url.startsWith('images/')) return `/${url}`; // ensure leading slash for public
    if (/^\d+$/.test(url)) return `/images/cards/${url}.jpg`; // numeric id → public/images/cards/<id>.jpg
    if (!url.includes('/')) return `/images/cards/${url}`; // plain filename → assume inside public/images/cards
    return `/${url}`; // fallback to public with leading slash
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const login = localStorage.getItem('currentLogin') || 'commander';
        const user = await backend.users.byLogin(login);
        
        console.log('Загружаем данные для пользователя:', user.id);
        
        // Сначала проверим, что API карт работает
        try {
          console.log('Проверяем доступность API карт...');
          const debugCards = await backend.cards.series();
          console.log('Серии карт:', debugCards);
        } catch (e) {
          console.error('Ошибка при получении серий карт:', e);
          console.error('Возможно, бекенд не запущен или API недоступен');
          throw new Error(`API карт недоступен: ${(e as any)?.message || 'Неизвестная ошибка'}`);
        }
        
        // Загружаем данные по отдельности для лучшей диагностики
        let allArtifacts, userArtifactsData, userCardsData, availableCardsData;
        
        try {
          console.log('Загружаем артефакты...');
          allArtifacts = await backend.artifacts.active();
          console.log('Артефакты загружены:', allArtifacts.length);
        } catch (e) {
          console.error('Ошибка при загрузке артефактов:', e);
          throw new Error(`Ошибка загрузки артефактов: ${(e as any)?.message || 'Неизвестная ошибка'}`);
        }
        
        try {
          console.log('Загружаем артефакты пользователя...');
          userArtifactsData = await backend.users.artifacts(user.id);
          console.log('Артефакты пользователя загружены:', userArtifactsData.length);
        } catch (e) {
          console.error('Ошибка при загрузке артефактов пользователя:', e);
          throw new Error(`Ошибка загрузки артефактов пользователя: ${(e as any)?.message || 'Неизвестная ошибка'}`);
        }
        
        try {
          console.log('Загружаем карты пользователя...');
          userCardsData = await backend.cards.userCards(user.id);
          console.log('Карты пользователя загружены:', userCardsData.length);
        } catch (e) {
          console.error('Ошибка при загрузке карт пользователя:', e);
          throw new Error(`Ошибка загрузки карт пользователя: ${(e as any)?.message || 'Неизвестная ошибка'}`);
        }
        
        try {
          console.log('Загружаем доступные карты...');
          availableCardsData = await backend.cards.available(user.id);
          console.log('Доступные карты загружены:', availableCardsData.length);
        } catch (e) {
          console.error('Ошибка при загрузке доступных карт:', e);
          throw new Error(`Ошибка загрузки доступных карт: ${(e as any)?.message || 'Неизвестная ошибка'}`);
        }
        
        console.log('Получены карты пользователя:', userCardsData);
        console.log('Доступные карты:', availableCardsData);
        
        if (!mounted) return;
        
        // Все доступные артефакты
        const mappedArtifacts = allArtifacts.map((a: ArtifactDTO) => ({ 
          id: a.id, 
          name: a.name,
          rarity: a.rarity,
          isEquipped: false
        }));
        setArtefacts(mappedArtifacts);
        
        // Артефакты пользователя
        const mappedUserArtifacts = userArtifactsData.map((a: any) => ({ 
          id: a.id, 
          name: a.name,
          rarity: a.rarity,
          isEquipped: a.isEquipped || false,
          imageUrl: a.imageUrl || a.image_url
        }));
        setUserArtifacts(mappedUserArtifacts);
        
        // Экипированные артефакты
        const equipped = mappedUserArtifacts.filter(a => a.isEquipped).map(a => a.id);
        setEquippedArtifacts(equipped);
        
        // Карты пользователя
        setUserCards(userCardsData);
        setAvailableCards(availableCardsData);
        
        // Проверяем и выдаем новые карты
        try {
          console.log('Проверяем и выдаем карты для пользователя:', user.id);
          await backend.cards.checkAwards(user.id);
          // Перезагружаем карты пользователя после проверки
          const updatedUserCards = await backend.cards.userCards(user.id);
          console.log('Обновленные карты пользователя:', updatedUserCards);
          setUserCards(updatedUserCards);
        } catch (e: any) {
          console.warn('Не удалось проверить карты:', e?.message);
        }
        
      } catch (e: any) {
        console.error('Ошибка при загрузке данных корабля:', e);
        console.error('Детали ошибки:', e?.response?.data || e?.message);
        console.error('Stack trace:', e?.stack);
        
        let errorMessage = 'Не удалось загрузить данные корабля';
        if (e?.response?.data?.message) {
          errorMessage = e.response.data.message;
        } else if (e?.message) {
          errorMessage = e.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleCardClick = async (userCard: UserCardDTO) => {
    try {
      const login = localStorage.getItem('currentLogin') || 'commander';
      const user = await backend.users.byLogin(login);
      
      // Отмечаем карту как просмотренную
      if (userCard.isNew) {
        await backend.cards.markViewed(user.id, userCard.card.id);
        
        // Обновляем состояние карты
        setUserCards(prevCards => 
          prevCards.map(card => 
            card.id === userCard.id 
              ? { ...card, isNew: false }
              : card
          )
        );
      }
    } catch (e: any) {
      console.warn('Не удалось отметить карту как просмотренную:', e?.message);
    }
  };

  const handleEquipArtifact = async (artifactId: number) => {
    try {
      const login = localStorage.getItem('currentLogin') || 'commander';
      const user = await backend.users.byLogin(login);
      
      // Проверяем лимит экипированных артефактов
      if (equippedArtifacts.length >= 3 && !equippedArtifacts.includes(artifactId)) {
        alert('Можно экипировать максимум 3 артефакта');
        return;
      }
      
      // Переключаем состояние экипировки
      await backend.users.equipArtifact(user.id, artifactId);
      
      // Полностью перезагружаем данные артефактов пользователя
      const userArtifactsData = await backend.users.artifacts(user.id);
      const mappedUserArtifacts = userArtifactsData.map((a: any) => ({ 
        id: a.id, 
        name: a.name,
        rarity: a.rarity,
        isEquipped: a.isEquipped || false,
        imageUrl: a.imageUrl || a.image_url
      }));
      setUserArtifacts(mappedUserArtifacts);
      
      // Обновляем экипированные артефакты
      const equipped = mappedUserArtifacts.filter(a => a.isEquipped).map(a => a.id);
      setEquippedArtifacts(equipped);
      
      // Уведомляем другие экраны об обновлении данных пользователя
      refreshUserData();
      
    } catch (e: any) {
      const errorInfo = handleApiError(e);
      console.warn('Не удалось экипировать артефакт:', errorInfo.message);
      alert(`${errorInfo.title}: ${errorInfo.message}`);
    }
  };

  const totalCosmo = Math.max(1, Math.ceil(userCards.length / pageSize));
  const totalArte = Math.max(1, Math.ceil(userArtifacts.length / pageSize));
  const cosmoPageItems = userCards.slice((pageCosmo-1)*pageSize, pageCosmo*pageSize);
  const artePageItems = userArtifacts.slice((pageArte-1)*pageSize, pageArte*pageSize);

  if (loading) {
    return (
      <div className="h-full pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-white text-center">
            <h2 className="text-xl font-bold mb-4">Загрузка карт...</h2>
            <p>Пожалуйста, подождите</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-red-400 text-center">
            <h2 className="text-xl font-bold mb-4">Ошибка загрузки данных</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Подзаголовок */}
        <div className="mt-6 mb-6">
          <h2 className="text-center">
            <ShinyText text="КОЛЛЕКЦИЯ КОСМОКАРТ" className="text-2xl font-bold" speed={6} />
          </h2>
        </div>

        {/* Космокарты: 3 в ряд + пагинация */}
        <div className="mx-auto" style={{ maxWidth: '820px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4 justify-items-center">
          {cosmoPageItems.map((userCard) => (
            <StyledFlip key={userCard.id} onClick={() => handleCardClick(userCard)}>
              <div className="container">
                <div className="card">
                  <div className="front" style={{ textAlign: 'center', padding: '8px' }}>
                    {(() => {
                      const initial = resolveImageUrl(userCard.card.frontImageUrl) || `/images/cards/${userCard.card.id}.jpg`;
                      if (!initial) {
                        return (
                          <div
                            style={{
                              width: '100%',
                              height: '120px',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              background: 'linear-gradient(135deg, #0a1b2a, #016a8a)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#7dd3fc',
                              fontSize: '12px'
                            }}
                          >
                            Нет изображения
                          </div>
                        );
                      }
                      const publicBase = (() => {
                        const raw = userCard.card.frontImageUrl;
                        if (raw && /^\d+$/.test(raw)) return `/images/cards/${raw}`;
                        if (raw && raw.startsWith('/images/')) return resolveImageUrl(raw)?.replace(/\.(jpg|jpeg|png|webp)$/i, '') || `/images/cards/${userCard.card.id}`;
                        return `/images/cards/${userCard.card.id}`;
                      })();
                      return (
                        <img
                          src={initial}
                          loading="lazy"
                          data-base={publicBase}
                          data-attempt="0"
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            const base = img.getAttribute('data-base') || '';
                            const attempt = parseInt(img.getAttribute('data-attempt') || '0', 10);
                            const exts = ['jpg','png','webp'];
                            if (base && attempt < exts.length) {
                              img.setAttribute('data-attempt', String(attempt + 1));
                              img.src = `${base}.${exts[attempt]}`;
                              return;
                            }
                            img.onerror = null;
                            img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220"><rect width="100%" height="100%" fill="%230b1320"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%237dd3fc" font-size="14">Нет изображения</text></svg>';
                          }}
                          alt={userCard.card.name}
                          style={{
                            width: '100%',
                            height: '220px',
                            objectFit: 'contain',
                            borderRadius: '16px',
                            marginBottom: '4px',
                            opacity: 0.85,
                            maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)'
                          }}
                        />
                      );
                    })()}
                    <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
                      <p className="front-heading">{userCard.card.name}</p>
                      <p style={{fontSize: '11px'}}>{userCard.card.seriesName}</p>
                      {userCard.isNew && <p style={{color: '#00ff00', fontSize: '10px'}}>НОВАЯ!</p>}
                    </div>
                  </div>
                  <div className="back">
                    <p className="back-heading">{userCard.card.name}</p>
                    <p style={{fontSize: '12px', textAlign: 'center', padding: '0 10px', fontStyle: 'italic'}}>
                      {userCard.card.backDescription}
                    </p>
                  </div>
                </div>
              </div>
            </StyledFlip>
          ))}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center space-x-4">
          <MainButton
            onClick={() => setPageCosmo(p => Math.max(1, p - 1))}
            disabled={pageCosmo === 1}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            ← Назад
          </MainButton>
          <span className="text-white/80 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            Страница {pageCosmo} из {totalCosmo}
          </span>
          <MainButton
            onClick={() => setPageCosmo(p => Math.min(totalCosmo, p + 1))}
            disabled={pageCosmo === totalCosmo}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            Вперёд →
          </MainButton>
        </div>

        {/* Коллекция артефактов */}
        <div className="mt-12 mb-6 text-center">
          <h2 className="text-center">
            <ShinyText text="КОЛЛЕКЦИЯ АРТЕФАКТОВ" className="text-2xl font-bold" speed={6} />
          </h2>
        </div>
        <div className="mx-auto" style={{ maxWidth: '660px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4 justify-items-center">
            {loading ? (
              <div className="col-span-full text-center text-white/60">Загрузка артефактов...</div>
            ) : artePageItems.length === 0 ? (
              <div className="col-span-full text-center text-white/60">У вас пока нет артефактов</div>
            ) : (
              artePageItems.map((a) => (
                <div key={a.id} className="relative">
                  <StyledGlow>
                    <div className="card" title={a.name || `Артефакт #${a.id}`}> 
                      {/* inner padding area so image not glued to edges */}
                      <div style={{ position: 'absolute', inset: '10px', borderRadius: '20px', overflow: 'hidden', zIndex: 2 }}>
                      {(a.imageUrl || a.image_url) && (
                        <img 
                          src={resolveImageUrl(a.imageUrl || a.image_url)} 
                          alt={a.name || `Артефакт #${a.id}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.9
                          }}
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            img.onerror = null;
                            img.style.display = 'none';
                          }}
                        />
                      )}
                      </div>
                    </div>
                  </StyledGlow>
                  <div className="mt-2 text-center">
                    <div className="text-white text-sm font-medium mb-1">{a.name || `Артефакт #${a.id}`}</div>
                    <div className="text-white/60 text-xs mb-2">{a.rarity || 'COMMON'}</div>
                    <MainButton
                      onClick={() => handleEquipArtifact(a.id)}
                      className={`px-3 py-1 text-xs rounded ${
                        a.isEquipped 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : equippedArtifacts.length >= 3 
                            ? 'bg-gray-500 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600'
                      } text-white font-medium transition-colors`}
                      disabled={!a.isEquipped && equippedArtifacts.length >= 3}
                    >
                      {a.isEquipped ? 'Снять' : 'Экипировать'}
                    </MainButton>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center space-x-4">
          <MainButton
            onClick={() => setPageArte(p => Math.max(1, p - 1))}
            disabled={pageArte === 1}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            ← Назад
          </MainButton>
          <span className="text-white/80 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            Страница {pageArte} из {totalArte}
          </span>
          <MainButton
            onClick={() => setPageArte(p => Math.min(totalArte, p + 1))}
            disabled={pageArte === totalArte}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            Вперёд →
          </MainButton>
        </div>
      </div>
    </div>
  );
};

export default ShipScreen;
