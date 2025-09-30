import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import AnimatedServer from '../AnimatedServer';
import PyramidLoader2 from '../PyramidLoader2';
import CosmicButton from '../CosmicButton';
import HoloNotificationButton from '../HoloNotificationButton';
import NotificationPanel from '../NotificationPanel';
import Footer from '../Footer';
import FrequencySpectrum from '../FrequencySpectrum';
import CosmicTooltip from '../CosmicTooltip';
import CosmicProgressBar from '../CosmicProgressBar';
import { useNotifications } from '../../hooks/useNotifications';
import { NeonGradientCard } from '../NeonGradientCard';
import ShinyText from '../ShinyText';
import { useAppContext } from '../../contexts/AppContext';
import ActivityCard from '../ActivityCard';
import Energon from '../Energon';
import MissionIcon from '../MissionIcon';
import ExperienceIcon from '../ExperienceIcon';
import RankIcon from '../RankIcon';
import { backend, UserDTO, UserCompetency, UserMission } from '../../api';
import { handleApiError } from '../../utils/errorHandler';

const DEFAULT_COMPETENCIES: { name: string; max: number }[] = [
  { name: 'Сила Миссии', max: 500 },
  { name: 'Импульс Прорыва', max: 500 },
  { name: 'Канал Связи', max: 500 },
  { name: 'Модуль Аналитики', max: 500 },
  { name: 'Пульт Командования', max: 500 },
  { name: 'Кодекс Звёздного Права', max: 500 },
  { name: 'Голограммное Мышление', max: 500 },
  { name: 'Кредитный Поток', max: 500 },
  { name: 'Курс Аэронавигации', max: 500 },
];

const AstronautCard = ({ login, rank, experience }: { login: string; rank: number; experience: number }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <img src="https://uiverse.io/astronaut.png" alt="Astronaut" className="image" />
        <div className="heading">{login}</div>
        <div className="rank-info">
          <div className="rank-badge">Ранг {rank}</div>
          <div className="level-info">Опыт {experience}</div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const ProfileScreen: React.FC = () => {
  const {
    notifications,
    isPanelOpen,
    unreadCount,
    markAsRead,
    markAllAsRead,
    togglePanel,
    closePanel
  } = useNotifications();
  
  const { refreshUserData } = useAppContext();

  const getRankName = (rankLevel: number) => {
    const rankNames: { [key: number]: string } = {
      0: 'Космо-Кадет',
      1: 'Навигатор Траекторий',
      2: 'Аналитик Орбит', 
      3: 'Архитектор Станции',
      4: 'Хронист Галактики',
      5: 'Исследователь Культур',
      6: 'Мастер Лектория',
      7: 'Связист Звёздного Флота',
      8: 'Штурман Экипажа',
      9: 'Командир Отряда',
      10: 'Хранитель Станции «Алабуга.TECH»'
    };
    return rankNames[rankLevel] || `Ранг ${rankLevel}`;
  };

  const [user, setUser] = useState<UserDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [competencies, setCompetencies] = useState<UserCompetency[]>([]);
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const [nextRankReq, setNextRankReq] = useState<any | null>(null);
  const [equippedArtifacts, setEquippedArtifacts] = useState<any[]>([]);
  const [currentRank, setCurrentRank] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Получаем текущий логин из localStorage
        const login = localStorage.getItem('currentLogin');
        if (!login) {
          setError('Пользователь не авторизован');
          return;
        }

        // Проверяем валидность сессии
        try {
          const validationResponse = await backend.auth.validate(login);
          if (!validationResponse.valid) {
            setError('Сессия истекла. Пожалуйста, войдите заново.');
            return;
          }
          setUser(validationResponse.user);
        } catch (validationError) {
          // Если валидация не удалась, пробуем получить пользователя напрямую
          const u = await backend.users.byLogin(login);
          if (!mounted) return;
          setUser(u);
        }

        if (!mounted || !user) return;
        
        try {
          const [comp, missions, artifacts, rank] = await Promise.all([
            backend.users.competencies(user.id),
            backend.users.missions(user.id),
            backend.users.artifacts(user.id),
            backend.ranks.byLevel(user.rank ?? 0)
          ]);
          if (!mounted) return;
          setCompetencies(comp || []);
          setUserMissions(missions || []);
          setCurrentRank(rank || null);
          
          // Фильтруем только экипированные артефакты
          const equipped = (artifacts || []).filter((a: any) => a.isEquipped);
          setEquippedArtifacts(equipped);
        } catch {}
        try {
          const req = await backend.ranks.requirementsByLevel((user.rank ?? 0) + 1);
          if (!mounted) return;
          setNextRankReq(req || null);
        } catch {}
      } catch (e: any) {
        console.warn('Не удалось загрузить профиль:', e?.message);
        setError(e?.message || 'Не удалось загрузить профиль');
      }
    })();
    return () => { mounted = false; };
  }, [refreshUserData]);

  return (
    <div className="relative w-full min-h-screen pb-8 pt-2 px-8 sm:pt-4 md:pt-6 lg:pt-8 overflow-x-hidden overflow-y-auto z-10">
      {/* PyramidLoader2 Component - Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-4 right-16 z-[1]"
      >
        <PyramidLoader2 />
      </motion.div>

      {/* AnimatedServer Component - Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="fixed bottom-8 left-8 z-[1]"
      >
        <AnimatedServer />
      </motion.div>

      {/* Notification Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute top-2 left-2 z-[9998] sm:left-4 md:left-6 lg:left-10 xl:left-14"
            >
        <HoloNotificationButton 
          count={unreadCount} 
          onClick={togglePanel}
        />
      </motion.div>

      {/* Profile Content (bounded like ЦУП) */}
      <div className="mx-auto w-full max-w-screen-lg grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Astronaut Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1 flex flex-col items-center space-y-6 mt-2 sm:mt-4"
        >
          {error && (
            <div className="text-red-300 text-sm">{error}</div>
          )}
          <AstronautCard 
            login={user?.login || 'КОМАНДИР НЕКСУС'} 
            rank={currentRank?.level ?? user?.rank ?? 0} 
            experience={user?.experience ?? 15420} 
          />
          
          {/* Frequency Spectrum */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full flex justify-start"
          >
            <FrequencySpectrum />
          </motion.div>
          
          {/* Cosmic Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col space-y-3 w-full max-w-xs"
          >
            <CosmicButton href="https://hr.alabuga.ru">
              HR-платформа
            </CosmicButton>
            <CosmicButton href="https://career.alabuga.space">
              Карьера.100 лидеров
            </CosmicButton>
            <CosmicButton href="https://alga.alabuga.ru">
              Алга.Алабуга
            </CosmicButton>
          </motion.div>

          {/* User Activity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="w-full max-w-md"
          >
            <ActivityCard
              title="АКТИВНОСТЬ ПОЛЬЗОВАТЕЛЯ"
              totalValue="18 ч"
              data={[
                { day: 'ПН', value: 2 },
                { day: 'ВТ', value: 3 },
                { day: 'СР', value: 4 },
                { day: 'ЧТ', value: 2 },
                { day: 'ПТ', value: 5 },
                { day: 'СБ', value: 1 },
                { day: 'ВС', value: 1 },
              ]}
            />
          </motion.div>
        </motion.div>

        {/* Stats and Skills */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Stats */}
          <NeonGradientCard className="p-8">
            <div className="mb-6 flex items-center">
              <ShinyText text="СТАТИСТИКА ПИЛОТА" className="text-2xl font-bold" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NeonGradientCard>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 flex items-center gap-2">
                    <Energon size={18} />
                    Энергон
                  </span>
                  <span className="text-cyan-400 font-bold">{user?.energy ?? 0}</span>
                </div>
              </NeonGradientCard>
              <NeonGradientCard>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 flex items-center gap-2">
                    <MissionIcon size={18} color="#51e4dc" />
                    Миссии (выполнено)
                  </span>
                  <span className="text-cyan-400 font-bold text-xl">{userMissions.filter(m => (m.status || '').toLowerCase() === 'completed').length}</span>
                </div>
              </NeonGradientCard>
              <NeonGradientCard>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 flex items-center gap-2">
                    <RankIcon size={22} />
                    Текущий ранг
                  </span>
                  <span className="text-cyan-400 font-bold">{currentRank?.name || getRankName(user?.rank ?? 0)}</span>
                </div>
              </NeonGradientCard>
              <NeonGradientCard>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 flex items-center gap-2">
                    <ExperienceIcon size={34} />
                    Опыт
                  </span>
                  <span className="text-cyan-400 font-bold">{user?.experience ?? 0}</span>
                </div>
              </NeonGradientCard>
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-sm text-gray-300 mb-3">
                <span>Прогресс до следующего ранга</span>
                <span className="text-cyan-400 font-bold">
                  {(() => {
                    const need = nextRankReq?.requiredExperience ?? null;
                    if (!need || !user) return '—';
                    const have = user.experience ?? 0;
                    const remain = Math.max(0, need - have);
                    const pct = Math.min(100, Math.max(0, Math.round((have / need) * 100)));
                    return `${pct}% (осталось ${remain})`;
                  })()}
                </span>
              </div>
              <CosmicProgressBar
                value={(() => { const n = nextRankReq?.requiredExperience ?? null; if (!n || !user) return 0; return user.experience ?? 0; })()}
                maxValue={(() => { const n = nextRankReq?.requiredExperience ?? null; return n || 1; })()}
                size="sm"
                label=""
                color="from-cyan-400 to-purple-500"
                animated={true}
                showValue={false}
                className="w-full"
              />
            </div>
          </NeonGradientCard>

          {/* Skills */}
          <NeonGradientCard className="p-8">
            <div className="mb-6 flex items-center">
              <ShinyText text="НАВЫКИ И КОМПЕТЕНЦИИ" className="text-2xl font-bold" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {DEFAULT_COMPETENCIES.map((base, index) => {
                const found = competencies.find(c => (c.name || '').toLowerCase() === base.name.toLowerCase());
                const value = (found?.points ?? found?.level ?? 0) as number;
                const maxValue = (found?.maxPoints ?? base.max) as number;
                const tooltipMap: Record<string,string> = {
                  'Сила Миссии': 'Вера в дело',
                  'Импульс Прорыва': 'Стремление к большему',
                  'Канал Связи': 'Общение',
                  'Модуль Аналитики': 'Аналитика',
                  'Пульт Командования': 'Командование',
                  'Кодекс Звёздного Права': 'Юриспруденция',
                  'Голограммное Мышление': 'Трёхмерное мышление',
                  'Кредитный Поток': 'Базовая экономика',
                  'Курс Аэронавигации': 'Основы аэронавигации'
                };
                const tooltipLabel = tooltipMap[base.name] || base.name;
                return (
                <motion.div
                  key={base.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="w-full"
                  style={{ minWidth: '200px' }}
                >
                  <CosmicTooltip tooltip={tooltipLabel}>
                    <CosmicProgressBar
                      value={value}
                      maxValue={maxValue}
                      size="md"
                      label={base.name}
                      color="from-cyan-400 to-purple-500"
                      animated={true}
                      showValue={true}
                      className="w-full"
                    />
                  </CosmicTooltip>
                </motion.div>
              );})}
            </div>
          </NeonGradientCard>

          {/* Избранные артефакты */}
          <NeonGradientCard className="p-8">
            <div className="mb-6 flex items-center">
              <ShinyText text="ИЗБРАННЫЕ АРТЕФАКТЫ" className="text-2xl font-bold" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equippedArtifacts.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-8">
                  <div className="text-lg mb-2">Нет экипированных артефактов</div>
                  <div className="text-sm">Перейдите в раздел "Корабль" для экипировки артефактов</div>
                </div>
              ) : (
                equippedArtifacts.map((artifact, index) => (
                  <motion.div
                    key={artifact.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">A</span>
                      </div>
                      <div className="text-white font-medium mb-1">{artifact.name}</div>
                      <div className="text-gray-400 text-sm mb-2">{artifact.rarity}</div>
                      <div className="text-green-400 text-xs">Экипирован</div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </NeonGradientCard>
        </motion.div>
      </div>

      {/* Animated Server Component */}

      {/* Notification Panel */}
      <NotificationPanel
        notifications={notifications}
        isOpen={isPanelOpen}
        onClose={closePanel}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
      />
    </div>
  );
};

const StyledWrapper = styled.div`
  /* HOLD THE ASTRONAUT */

  .card {
    position: relative;
    width: 19em;
    height: 25em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #171717;
    color: white;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    padding: 1em 2em 1em 1em;
    border-radius: 20px;
    overflow: hidden;
    z-index: 1;
    row-gap: 1em;
  }
  
  .card img {
    width: 12em;
    margin-right: 1em;
    animation: move 10s ease-in-out infinite;
    z-index: 5;
  }
  
  .image:hover {
    cursor: -webkit-grab;
    cursor: grab;
  }

  .card::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    inset: -3px;
    border-radius: 10px;
    background: radial-gradient(#858585, transparent, transparent);
    transform: translate(-5px, 250px);
    transition: 0.4s ease-in-out;
    z-index: -1;
  }
  
  .card:hover::before {
    width: 150%;
    height: 100%;
    margin-left: -4.25em;
  }
  
  .card::after {
    content: "";
    position: absolute;
    inset: 2px;
    border-radius: 20px;
    background: rgb(23, 23, 23, 0.7);
    transition: all 0.4s ease-in-out;
    z-index: -1;
  }

  .heading {
    z-index: 2;
    transition: 0.4s ease-in-out;
    text-align: center;
    font-size: 1.1em;
    letter-spacing: 0.05em;
    color: #00FFFF;
  }
  
  .card:hover .heading {
    letter-spacing: 0.025em;
  }

  .rank-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5em;
    z-index: 2;
  }

  .rank-badge {
    background: linear-gradient(45deg, #00FFFF, #0080FF);
    color: #000;
    padding: 0.5em 1em;
    border-radius: 15px;
    font-weight: bold;
    font-size: 0.9em;
    letter-spacing: 0.1em;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  }

  .level-info {
    color: #00FFFF;
    font-size: 0.8em;
    font-weight: bold;
    letter-spacing: 0.05em;
  }

  .heading::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    opacity: 1;
    box-shadow: 220px 118px #fff, 280px 176px #fff, 40px 50px #fff,
      60px 180px #fff, 120px 130px #fff, 180px 176px #fff, 220px 290px #fff,
      520px 250px #fff, 400px 220px #fff, 50px 350px #fff, 10px 230px #fff;
    z-index: -1;
    transition: 1s ease;
    animation: 1s glowing-stars linear alternate infinite;
    animation-delay: 0s;
  }

  .rank-info::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    opacity: 1;
    box-shadow: 140px 20px #fff, 425px 20px #fff, 70px 120px #fff, 20px 130px #fff,
      110px 80px #fff, 280px 80px #fff, 250px 350px #fff, 280px 230px #fff,
      220px 190px #fff, 450px 100px #fff, 380px 80px #fff, 520px 50px #fff;
    z-index: -1;
    transition: 1.5s ease;
    animation: 1s glowing-stars linear alternate infinite;
    animation-delay: 0.4s;
  }

  .rank-info::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    opacity: 1;
    box-shadow: 490px 330px #fff, 420px 300px #fff, 320px 280px #fff,
      380px 350px #fff, 546px 170px #fff, 420px 180px #fff, 370px 150px #fff,
      200px 250px #fff, 80px 20px #fff, 190px 50px #fff, 270px 20px #fff,
      120px 230px #fff, 350px -1px #fff, 150px 369px #fff;
    z-index: -1;
    transition: 2s ease;
    animation: 1s glowing-stars linear alternate infinite;
    animation-delay: 0.8s;
  }

  .card:hover .heading::before,
  .card:hover .rank-info::before,
  .card:hover .rank-info::after {
    filter: blur(3px);
  }

  .image:active {
    cursor: -webkit-grabbing;
    cursor: grabbing;
  }

  .image:active + .heading::before {
    box-shadow: 240px 20px #9b40fc, 240px 25px #9b40fc, 240px 30px #9b40fc,
      240px 35px #9b40fc, 240px 40px #9b40fc, 242px 45px #9b40fc,
      246px 48px #9b40fc, 251px 49px #9b40fc, 256px 48px #9b40fc,
      260px 45px #9b40fc, 262px 40px #9b40fc;
    animation: none;
    filter: blur(0);
    border-radius: 2px;
    width: 0.45em;
    height: 0.45em;
    scale: 0.65;
    transform: translateX(9em) translateY(1em);
  }

  .heading::after {
    content: "";
    top: -8.5%;
    left: -8.5%;
    position: absolute;
    width: 7.5em;
    height: 7.5em;
    border: none;
    outline: none;
    border-radius: 50%;
    background: #f9f9fb;
    box-shadow: 0px 0px 100px rgba(193, 119, 241, 0.8),
      0px 0px 100px rgba(135, 42, 211, 0.8), inset #9b40fc 0px 0px 40px -12px;
    transition: 0.4s ease-in-out;
    z-index: -1;
  }
  
  .card:hover .heading::after {
    box-shadow: 0px 0px 200px rgba(193, 119, 241, 1),
      0px 0px 200px rgba(135, 42, 211, 1), inset #9b40fc 0px 0px 40px -12px;
  }

  @keyframes move {
    0% {
      transform: translateX(0em) translateY(0em);
    }
    25% {
      transform: translateY(-1em) translateX(-1em);
      rotate: -10deg;
    }
    50% {
      transform: translateY(1em) translateX(-1em);
    }
    75% {
      transform: translateY(-1.25em) translateX(1em);
      rotate: 10deg;
    }
    100% {
      transform: translateX(0em) translateY(0em);
    }
  }

  @keyframes glowing-stars {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;


export default ProfileScreen;
