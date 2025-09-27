import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import ShinyText from '../ShinyText';
import MainButton from '../MainButton';
import { backend, ArtifactDTO } from '../../api';
import { handleApiError } from '../../utils/errorHandler';
import Energon from '../Energon';
import { useAppContext } from '../../contexts/AppContext';

const StyledFlip = styled.div`
  .container { width: 240px; height: 294px; perspective: 900px; }
  .card { height: 100%; width: 100%; position: relative; transition: transform 1200ms; transform-style: preserve-3d; border-radius: 2rem; }
  .container:hover > .card { cursor: pointer; transform: rotateY(180deg) rotateZ(180deg); }
  .front, .back { height: 100%; width: 100%; border-radius: 2rem; position: absolute; backface-visibility: hidden; color: #e6f7ff; display: flex; justify-content: center; flex-direction: column; align-items: center; gap: 16px; box-shadow: 0 0 14px 2px rgba(0, 174, 239, 0.35); background: linear-gradient(-135deg, #0a1b2a, #016a8a); }
  .back { transform: rotateY(180deg) rotateZ(180deg); }
  .front-heading, .back-heading { font-size: 18px; font-weight: 700; letter-spacing: .5px; }
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

  const cosmoCards = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ id: i+1, title: `Космокарта #${i+1}` })), []);
  const [artefacts, setArtefacts] = useState<{ id: number; name?: string; rarity?: string; isEquipped?: boolean }[]>([]);
  const [userArtifacts, setUserArtifacts] = useState<{ id: number; name?: string; rarity?: string; isEquipped?: boolean }[]>([]);
  const [equippedArtifacts, setEquippedArtifacts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const login = localStorage.getItem('currentLogin') || 'commander';
        const user = await backend.users.byLogin(login);
        
        const [allArtifacts, userArtifactsData] = await Promise.all([
          backend.artifacts.active(),
          backend.users.artifacts(user.id)
        ]);
        
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
          isEquipped: a.isEquipped || false
        }));
        setUserArtifacts(mappedUserArtifacts);
        
        // Экипированные артефакты
        const equipped = mappedUserArtifacts.filter(a => a.isEquipped).map(a => a.id);
        setEquippedArtifacts(equipped);
        
      } catch (e: any) {
        console.warn('Не удалось загрузить данные корабля:', e?.message);
        setError(e?.message || 'Не удалось загрузить данные корабля');
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

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
        isEquipped: a.isEquipped || false
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

  const totalCosmo = Math.max(1, Math.ceil(cosmoCards.length / pageSize));
  const totalArte = Math.max(1, Math.ceil(userArtifacts.length / pageSize));
  const cosmoPageItems = cosmoCards.slice((pageCosmo-1)*pageSize, pageCosmo*pageSize);
  const artePageItems = userArtifacts.slice((pageArte-1)*pageSize, pageArte*pageSize);

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
          {cosmoPageItems.map((c) => (
            <StyledFlip key={c.id}>
              <div className="container">
                <div className="card">
                  <div className="front">
                    <p className="front-heading">{c.title}</p>
                    <p>Секреты галактики</p>
                  </div>
                  <div className="back">
                    <p className="back-heading">{c.title}</p>
                    <p>Редкая космокарта</p>
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
                    <div className="card" title={a.name || `Артефакт #${a.id}`} />
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
