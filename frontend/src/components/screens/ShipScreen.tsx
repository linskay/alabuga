import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import ShinyText from '../ShinyText';
import CosmicTooltip from '../CosmicTooltip';
import MainButton from '../MainButton';
import { backend, ArtifactDTO, CardDTO, UserCardDTO, API_BASE_URL } from '../../api';
import { handleApiError } from '../../utils/errorHandler';
import Energon from '../Energon';
import { useAppContext } from '../../contexts/AppContext';
import GooseHint from '../GooseHint';
import { useOneTimeHint } from '../../hooks/useOneTimeHint';
import { combineHint } from '../../constants/gooseHints';

const StyledFlip = styled.div`
  .container { width: 200px; height: 250px; perspective: 900px; }
  .card { height: 100%; width: 100%; position: relative; transition: transform 1200ms; transform-style: preserve-3d; border-radius: 2rem; }
  .container:hover > .card { cursor: pointer; transform: rotateY(180deg) rotateZ(180deg); }
  .front, .back { height: 100%; width: 100%; border-radius: 2rem; position: absolute; backface-visibility: hidden; color: #e6f7ff; display: flex; justify-content: center; flex-direction: column; align-items: center; gap: 16px; box-shadow: 0 0 14px 2px rgba(0, 174, 239, 0.35); background: linear-gradient(-135deg, #0a1b2a, #016a8a); }
  .back { transform: rotateY(180deg) rotateZ(180deg); }
  .front-heading, .back-heading { font-size: 12px; font-weight: 700; letter-spacing: .5px; }
`;

const StyledGlow = styled.div`
  .card { position: relative; width: 190px; height: 254px; background: linear-gradient(137deg, rgba(0,174,239,1) 0%, rgba(0,212,255,1) 100%); transition: 0.3s ease; border-radius: 30px; filter: drop-shadow(0 0 30px rgba(0, 174, 239, 0.45)); }
  .card::after { content: ''; background-color: #0b1320; position: absolute; z-index: 1; transition: 0.3s ease; height: 98%; width: 98%; top: 1%; left: 1%; border-radius: 28px; }
  .card:hover { filter: drop-shadow(0 0 30px rgba(0, 174, 239, 0.9)); }
`;

const ShipScreen: React.FC = () => {
  const { refreshUserData } = useAppContext();
  const cardsHint = useOneTimeHint('cards');
  const artifactsHint = useOneTimeHint('artifacts');
  const [activateArtifacts, setActivateArtifacts] = useState(false);
  // When cards hint finishes (hasSeen becomes true), activate artifacts hint sequentially
  useEffect(() => {
    if (cardsHint.hasSeen) setActivateArtifacts(true);
  }, [cardsHint.hasSeen]);
  const [pageCosmo, setPageCosmo] = useState(1);
  const [pageArte, setPageArte] = useState(1);
  const pageSize = 6; // 3x2

  const [userCards, setUserCards] = useState<UserCardDTO[]>([]);
  const [availableCards, setAvailableCards] = useState<CardDTO[]>([]);
  const [allCards, setAllCards] = useState<CardDTO[]>([]);
  const [artefacts, setArtefacts] = useState<{ id: number; name?: string; rarity?: string; isEquipped?: boolean }[]>([]);
  const [userArtifacts, setUserArtifacts] = useState<{ id: number; name?: string; rarity?: string; isEquipped?: boolean; imageUrl?: string; image_url?: string }[]>([]);
  const [equippedArtifacts, setEquippedArtifacts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardsTab, setCardsTab] = useState<'owned' | 'locked'>('owned');
  const [artifactsTab, setArtifactsTab] = useState<'owned' | 'locked'>('owned');
  const [allArtifactsCatalog, setAllArtifactsCatalog] = useState<ArtifactDTO[]>([]);

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
          const series = await backend.cards.series();
          console.log('Серии карт:', series);
          const lists = await Promise.all((series || []).map((s: string) => backend.cards.cardsBySeries(s).catch(() => [])));
          const merged: CardDTO[] = ([] as CardDTO[]).concat(...lists).filter(Boolean);
          setAllCards(merged);
        } catch (e) {
          console.error('Ошибка при получении полного каталога карт:', e);
          console.error('Возможно, бекенд не запущен или API недоступен');
          throw new Error(`API карт недоступен: ${(e as any)?.message || 'Неизвестная ошибка'}`);
        }
        
        // Загружаем данные по отдельности для лучшей диагностики
        let allArtifacts, userArtifactsData, userCardsData, availableCardsData, artifactsCatalog;
        
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
        setAllArtifactsCatalog(artifactsCatalog || []);
        
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
  const totalArteOwnedPages = Math.max(1, Math.ceil(userArtifacts.length / pageSize));
  const cosmoPageItems = userCards.slice((pageCosmo-1)*pageSize, pageCosmo*pageSize);
  const artePageItemsOwned = userArtifacts.slice((pageArte-1)*pageSize, pageArte*pageSize);

  const ownedIds = new Set(userCards.map(uc => uc.card.id));
  const lockedCards = (allCards.length ? allCards : availableCards).filter(c => !ownedIds.has(c.id));
  const totalLockedPages = Math.max(1, Math.ceil(lockedCards.length / pageSize));
  const lockedPageItems = lockedCards.slice((pageCosmo-1)*pageSize, pageCosmo*pageSize);
  // Artifacts locked
  const ownedArtifactIds = new Set(userArtifacts.map(a => a.id));
  const artifactsUniverse = allArtifactsCatalog.length ? allArtifactsCatalog : (artefacts.length ? artefacts : []);
  const lockedArtifacts = artifactsUniverse.filter(a => !ownedArtifactIds.has(a.id));
  const totalArtifactsLockedPages = Math.max(1, Math.ceil(lockedArtifacts.length / pageSize));
  const artePageItemsLocked = lockedArtifacts.slice((pageArte-1)*pageSize, pageArte*pageSize);

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
        <GooseHint
          text={combineHint('cards')}
          visible={cardsHint.visible}
          className="top-20 right-6"
        />
        {/* Подзаголовок */}
        <div className="mt-6 mb-6">
          <h2 className="text-center">
            <ShinyText text="КОЛЛЕКЦИЯ КОСМОКАРТ" className="text-2xl font-bold" speed={6} />
          </h2>
        </div>

        {/* Космокарты: вкладки + сетка + пагинация */}
        <div className="mx-auto" style={{ maxWidth: '820px' }}>
          {/* Tabs (styled like Missions) */}
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            <MainButton onClick={() => { setCardsTab('owned'); setPageCosmo(1); }} className={cardsTab === 'owned' ? '' : 'opacity-70'}>
              Моя коллекция
            </MainButton>
            <MainButton onClick={() => { setCardsTab('locked'); setPageCosmo(1); }} className={cardsTab === 'locked' ? '' : 'opacity-70'}>
              Заблокировано
            </MainButton>
          </div>

          {/* Story text */}
          {cardsTab === 'owned' ? (
            <p className="text-center text-white/80 text-sm mb-6">
              Сектор полученных карт. Капитан Марк Стивенс первым собрал полную коллекцию карт сектора "Альфа" в 2087 году, что позволило расшифровать координаты заброшенной космической станции.
            </p>
          ) : (
            <p className="text-center text-white/80 text-sm mb-6">
              Архив ещё не полученных карт. Штурман Юми Кошикава годами изучала этот раздел, чтобы точно определить, какие миссии принесут ей недостающие экземпляры для завершения "Колоды Первопроходца".
            </p>
          )}

          {/* Cosmic counter like Missions (small mono) */}
          <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-10">
            <div className="text-[11px] md:text-xs tracking-wide text-white/70 font-mono opacity-90 mb-4 text-center">
              <span>
                Получено {userCards.length} из {(allCards.length ? allCards.length : (userCards.length + lockedCards.length))}
              </span>
            </div>
          </div>

          {/* Motivation text */}
          {cardsTab === 'owned' && userCards.length === 0 && (
            <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-10">
              <div className="flex flex-col items-center text-center gap-3 py-4">
                <img src="/images/gaga.gif" alt="gaga" className="w-16 h-16 object-contain opacity-90" />
                <div className="text-[11px] md:text-xs tracking-wide text-white/80 font-mono">
                  <span>АНАЛИЗ КОЛЛЕКЦИИ: КАРТЫ ОТСУТСТВУЮТ. ДЛЯ ПОЛУЧЕНИЯ ПЕРВЫХ КАРТ ВЫПОЛНИТЕ СТАРТОВЫЕ МИССИИ. КАЖДАЯ КАРТА — УНИКАЛЬНЫЙ АРТЕФАКТ, ХРАНЯЩИЙ ЧАСТЬ ИСТОРИИ КОСМОСА.</span>
                </div>
              </div>
            </div>
          )}
          {cardsTab === 'owned' && userCards.length > 0 && (
            <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-10">
              <div className="text-[11px] md:text-xs tracking-wide text-white/80 font-mono text-center mb-4">
                <span>СИСТЕМНЫЙ ОТЧЁТ: ВАША КОЛЛЕКЦИЯ СОБИРАЕТСЯ. ИЗУЧАЙТЕ КАРТЫ, ЧТОБЫ РАСКРЫТЬ ИХ СКРЫТЫЕ СВОЙСТВА И СЕКРЕТЫ ВСЕЛЕННОЙ.</span>
              </div>
            </div>
          )}
          {cardsTab === 'locked' && (
            <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-10">
              <div className="flex flex-col items-center text-center gap-3 py-4">
                <img src="/images/gaga.gif" alt="gaga" className="w-16 h-16 object-contain opacity-90" />
                <div className="text-[11px] md:text-xs tracking-wide text-white/80 font-mono whitespace-pre-line">
                  <span>{`СКАНЕР БУДУЩИХ ПОЛУЧЕНИЙ: ЗДЕСЬ ОТОБРАЖАЮТСЯ КАРТЫ, КОТОРЫЕ ВЫ СМОЖЕТЕ ПОЛУЧИТЬ. ДЛЯ ИХ ПРИОБРЕТЕНИЯ ВЫПОЛНИТЕ УСЛОВИЯ, УКАЗАННЫЕ НА КАРТАХ. КАЖДАЯ НОВАЯ КАРТА ПРИБЛИЖАЕТ ВАС К ПОЛНОЙ КОЛЛЕКЦИИ!`}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4 justify-items-center">
          {cardsTab === 'owned' ? (
            cosmoPageItems.map((userCard) => (
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
                            height: '180px',
                            objectFit: 'contain',
                            borderRadius: '16px',
                            marginBottom: '4px',
                            opacity: 0.85
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
            ))
          ) : (
            lockedPageItems.map((card) => {
              const tip = [
                (card as any)?.requirementDescription || '',
                card.unlockCondition ? `Условие: ${card.unlockCondition}` : '',
                typeof card.unlockRank === 'number' ? `Ранг: ${card.unlockRank}` : '',
                card.seriesName ? `Серия: ${card.seriesName}` : ''
              ].filter(Boolean).join(' \n ')
                || 'Для получения выполните условия карты';
              return (
                <CosmicTooltip key={card.id} tooltip={tip}>
                  <div className="w-[200px] h-[250px] rounded-2xl relative border border-white/10 bg-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-2 rounded-xl border border-white/10 flex items-center justify-center">
                      <div className="text-white/70 text-5xl select-none">?</div>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 text-center text-white/60 text-xs px-2">
                      {card.name}
                    </div>
                  </div>
                </CosmicTooltip>
              );
            })
          )}
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
            Страница {pageCosmo} из {cardsTab === 'owned' ? totalCosmo : totalLockedPages}
          </span>
          <MainButton
            onClick={() => setPageCosmo(p => Math.min(cardsTab === 'owned' ? totalCosmo : totalLockedPages, p + 1))}
            disabled={pageCosmo === (cardsTab === 'owned' ? totalCosmo : totalLockedPages)}
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            Вперёд →
          </MainButton>
        </div>

        {/* Коллекция артефактов (sequential after cards hint) */}
        {activateArtifacts && (
          <GooseHint
            text={combineHint('artifacts')}
            visible={artifactsHint.visible}
            className="top-40 right-10"
          />
        )}
        <div className="mt-12 mb-6 text-center">
          <h2 className="text-center">
            <ShinyText text="КОЛЛЕКЦИЯ АРТЕФАКТОВ" className="text-2xl font-bold" speed={6} />
          </h2>
        </div>
        <div className="mx-auto" style={{ maxWidth: '820px' }}>
          {/* Tabs (artifacts) */}
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            <MainButton onClick={() => { setArtifactsTab('owned'); setPageArte(1); }} className={artifactsTab === 'owned' ? '' : 'opacity-70'}>
              Мои артефакты
            </MainButton>
            <MainButton onClick={() => { setArtifactsTab('locked'); setPageArte(1); }} className={artifactsTab === 'locked' ? '' : 'opacity-70'}>
              Заблокировано
            </MainButton>
          </div>

          {/* Story text */}
          {artifactsTab === 'owned' ? (
            <p className="text-center text-white/80 text-sm mb-6">
              Сектор полученных артефактов. Именно здесь хранятся космические реликвии, добытые членами экипажа во время исследований. Полная коллекция артефактов сектора "Ксилотрон" была собрана в 2087 году, что позволило открыть портал в соседнюю галактику.
            </p>
          ) : (
            <p className="text-center text-white/80 text-sm mb-6">
              Архив ещё не полученных артефактов. Доступ к уникальным реликвиям открывается после выполнения специальных задач и достижения нужного ранга.
            </p>
          )}

          {/* Counter */}
          <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-10">
            <div className="text-[11px] md:text-xs tracking-wide text-white/70 font-mono opacity-90 mb-4 text-center">
              <span>
                Получено {userArtifacts.length} из {allArtifactsCatalog.length || artefacts.length || userArtifacts.length}
              </span>
            </div>
          </div>

          {/* Motivation */}
          {artifactsTab === 'owned' && userArtifacts.length === 0 && (
            <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-10">
              <div className="flex flex-col items-center text-center gap-3 py-4">
                <img src="/images/gaga.gif" alt="gaga" className="w-16 h-16 object-contain opacity-90" />
                <div className="text-[11px] md:text-xs tracking-wide text-white/80 font-mono">
                  <span>СКАНЕР АРТЕФАКТОВ: КОЛЛЕКЦИЯ ПУСТА. ДЛЯ ПОЛУЧЕНИЯ ПЕРВЫХ АРТЕФАКТОВ ВЫПОЛНИТЕ СТАРТОВЫЕ МИССИИ. КАЖДЫЙ АРТЕФАКТ — УНИКАЛЬНЫЙ НОСИТЕЛЬ КОСМИЧЕСКОЙ ЭНЕРГИИ.</span>
                </div>
              </div>
            </div>
          )}
          {artifactsTab === 'owned' && userArtifacts.length > 0 && (
            <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-10">
              <div className="text-[11px] md:text-xs tracking-wide text-white/80 font-mono text-center mb-4">
                <span>СИСТЕМНЫЙ АНАЛИЗ: АРТЕФАКТЫ АКТИВИРОВАНЫ. ИЗУЧАЙТЕ ИХ СВОЙСТВА ДЛЯ РАСКРЫТИЯ ПОЛНОГО ПОТЕНЦИАЛА. КОМБИНАЦИЯ АРТЕФАКТОВ МОЖЕТ СОЗДАТЬ СИНЕРГЕТИЧЕСКИЙ ЭФФЕКТ.</span>
              </div>
            </div>
          )}
          {artifactsTab === 'locked' && (
            <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-10">
              <div className="flex flex-col items-center text-center gap-3 py-4">
                <img src="/images/gaga.gif" alt="gaga" className="w-16 h-16 object-contain opacity-90" />
                <div className="text-[11px] md:text-xs tracking-wide text-white/80 font-mono whitespace-pre-line text-center">
                  <span>{`ДОСТУП К РЕЛИКВИЯМ: ЗДЕСЬ УКАЗАНЫ АРТЕФАКТЫ, КОТОРЫЕ МОЖНО ПОЛУЧИТЬ. ВЫПОЛНЯЙТЕ МИССИИ И ДОСТИГАЙТЕ НЕОБХОДИМОГО РАНГА, ЧТОБЫ ОТКРЫТЬ ДОСТУП.`}</span>
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4 justify-items-center">
            {loading ? (
              <div className="col-span-full text-center text-white/60">Загрузка артефактов...</div>
            ) : artifactsTab === 'owned' ? (
              artePageItemsOwned.length === 0 ? (
                <div className="col-span-full text-center text-white/60">У вас пока нет артефактов</div>
              ) : (
                artePageItemsOwned.map((a) => (
                  <div key={a.id} className="relative">
                    <StyledGlow>
                      <div className="card" title={a.name || `Артефакт #${a.id}`}> 
                        {(a.imageUrl || a.image_url) && (
                          <img 
                            src={resolveImageUrl(a.imageUrl || a.image_url)} 
                            alt={a.name || `Артефакт #${a.id}`}
                            style={{
                              position: 'absolute',
                              inset: '10px',
                              width: 'calc(100% - 20px)',
                              height: 'calc(100% - 20px)',
                              objectFit: 'contain',
                              borderRadius: '20px',
                              opacity: 0.9,
                              zIndex: 2
                            }}
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              img.onerror = null;
                              img.style.display = 'none';
                            }}
                          />
                        )}
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
              )
            ) : (
              artePageItemsLocked.length === 0 ? (
                <div className="col-span-full text-center text-white/60">Пока нет заблокированных артефактов</div>
              ) : (
                artePageItemsLocked.map((a) => (
                  <div key={a.id} className="w-[190px] h-[254px] rounded-2xl relative border border-white/10 bg-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-2 rounded-xl border border-white/10 flex items-center justify-center">
                      <div className="text-white/70 text-5xl select-none">?</div>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 text-center text-white/60 text-xs px-2">
                      {a.name || `Артефакт #${a.id}`}
                    </div>
                  </div>
                ))
              )
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
            Страница {pageArte} из {artifactsTab === 'owned' ? totalArteOwnedPages : totalArtifactsLockedPages}
          </span>
          <MainButton
            onClick={() => setPageArte(p => Math.min(artifactsTab === 'owned' ? totalArteOwnedPages : totalArtifactsLockedPages, p + 1))}
            disabled={pageArte === (artifactsTab === 'owned' ? totalArteOwnedPages : totalArtifactsLockedPages)}
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
