import React, { useEffect, useMemo, useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import MainButton from '../MainButton';
import { backend, MissionDTO, UserDTO, UserMission } from '../../api';
import SystemNotification from '../SystemNotification';
import { handleApiError } from '../../utils/errorHandler';
import ShinyText from '../ShinyText';

type StatusId = 'active' | 'available' | 'soon' | 'history';

interface MissionItem { id?: number; title: string; description: string; difficulty: string; reward: string; status: StatusId; requiredExperience?: number; requiredRank?: number; type?: string }

const StyledCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 180px);
  justify-content: center;
  gap: 1rem;
  margin: 0 auto;

  @media (min-width: 640px) { grid-template-columns: repeat(2, 180px); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 180px); }
`;

// Декоративная сфера в левом верхнем углу
const rotateXY = keyframes`
  0% { transform: rotateX(0deg) rotateY(0deg); }
  50% { transform: rotateX(90deg) rotateY(180deg); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
`;

const DecoOrb = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  width: 180px;
  height: 180px;
  opacity: 0.25;
  pointer-events: none;
  filter: blur(1px);
  .ring {
    position: absolute;
    border: 2px solid rgba(0, 234, 255, 0.4);
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(0, 234, 255, 0.25);
    animation: ${rotateXY} 12s linear infinite;
  }
  .ring.r1 { width: 180px; height: 180px; top: 0; left: 0; }
  .ring.r2 { width: 140px; height: 140px; top: 20px; left: 20px; animation-duration: 10s; }
  .ring.r3 { width: 100px; height: 100px; top: 40px; left: 40px; animation-duration: 8s; }
`;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } }
};

const StyledCard = styled.div`
  .card {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4;
    color: #fff;
    transition: 0.5s;
    cursor: pointer;
    will-change: transform, opacity;
    backface-visibility: hidden;
    transform: translateZ(0);
  }
  .card:hover { transform: translateY(-8px); }
  .card::before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0; left: 0;
    background: linear-gradient(45deg, #ffbc00, #ff0058);
    border-radius: 1.2em;
  }
  .card::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: linear-gradient(45deg, #ffbc00, #ff0058);
    filter: blur(30px);
  }
  .card span {
    position: absolute;
    top: 6px; left: 6px; right: 6px; bottom: 6px;
    background-color: rgba(0,0,0,0.6);
    z-index: 2;
    border-radius: 1em;
  }
  .card span::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 50%; height: 100%;
    background-color: rgba(255,255,255,0.08);
  }
  .badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 15;
    padding: 2px 8px;
    font-size: 10px;
    letter-spacing: 0.3px;
    border-radius: 9999px;
    text-transform: uppercase;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.18);
    backdrop-filter: blur(6px);
  }
  .card .content {
    position: relative;
    padding: 10px;
    z-index: 10;
    width: 100%; height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    font-weight: 700;
  }
  .title { font-size: 0.95rem; line-height: 1.3; }
  .desc { font-size: 0.8rem; opacity: 0.85; margin-top: 0.2rem; }
  .meta { margin-top: auto; display: flex; gap: 0.5rem; font-size: 0.75rem; opacity: 0.9; }
  
  .history-card {
    opacity: 0.8;
  }
  .history-card::before {
    background: linear-gradient(45deg, #10b981, #059669);
  }
  .history-card::after {
    background: linear-gradient(45deg, #10b981, #059669);
  }
  .history-card:hover {
    opacity: 1;
    transform: translateY(-4px);
  }
`;

const MissionsScreen: React.FC = () => {
  const [status, setStatus] = useState<StatusId>('active');
  const [page, setPage] = useState<number>(1);
  const pageSize = 6; // 3x2 на десктопе

  const [missions, setMissions] = useState<MissionItem[]>([]);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<UserMission[]>([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [notif, setNotif] = useState<{ open: boolean; title: string; message?: string; variant?: 'success' | 'info' | 'warning' | 'error' }>({ open: false, title: '' });
  const [confirmOpen, setConfirmOpen] = useState<{ open: boolean; title?: string; message?: string }>({ open: false });
  const [pendingMission, setPendingMission] = useState<MissionItem | null>(null);
  const [expandedMission, setExpandedMission] = useState<MissionItem | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const login = localStorage.getItem('currentLogin') || 'commander';
        const u = await backend.users.byLogin(login);
        if (!mounted) return;
        setUser(u);
        const [data, myMissions] = await Promise.all([
          backend.missions.list(),
          backend.users.missions(u.id)
        ]);
        if (!mounted) return;
        const mapped: MissionItem[] = data.map((m: MissionDTO) => ({
          id: m.id,
          title: m.name,
          description: m.description || '',
          difficulty: m.difficulty || '—',
          reward: `${m.experienceReward ?? 0} XP`,
          status: (m.isActive ? 'available' : 'soon') as StatusId,
          requiredExperience: m.requiredExperience,
          requiredRank: m.requiredRank,
          type: m.type,
        }));
        setMissions(mapped);
        setUserMissions(myMissions || []);
        
        // Разделяем миссии на активные и выполненные
        const activeMissions = (myMissions || []).filter(m => m.status !== 'COMPLETED');
        const completedMissions = (myMissions || []).filter(m => m.status === 'COMPLETED');
        setUserMissions(activeMissions);
        setCompletedMissions(completedMissions);
      } catch (e: any) {
        console.warn('Не удалось загрузить данные миссий:', e?.message);
        setMissions([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    if (status === 'history') {
      // Для истории показываем выполненные миссии как карточки
      return completedMissions.map(mission => ({
        id: mission.missionId,
        title: mission.missionName || 'Неизвестная миссия',
        description: `Выполнена недавно`,
        difficulty: '—',
        reward: `${mission.progress || 0}%`,
        status: 'history' as StatusId,
        requiredExperience: 0,
        requiredRank: 0,
        type: 'completed',
      }));
    }

    const userRank = user?.rank ?? 0;
    const userXP = user?.experience ?? 0;
    const canAccess = (m: MissionItem) => {
      const rankOk = m.requiredRank == null || userRank >= m.requiredRank;
      const xpOk = m.requiredExperience == null || userXP >= m.requiredExperience;
      return rankOk && xpOk;
    };
    const isActiveForUser = (m: MissionItem) => userMissions.some(um => (um.missionId === m.id) && (um.status || '').toUpperCase() !== 'COMPLETED');

    return missions.filter(m =>
      status === 'active' ? isActiveForUser(m) :
      status === 'available' ? (canAccess(m) && !isActiveForUser(m)) :
      !canAccess(m)
    );
  }, [missions, status, user, userMissions, completedMissions]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const itemsToRender = pageItems;

  const changeStatus = (id: StatusId) => { setStatus(id); setPage(1); };

  const handleTakeMission = async (mission: MissionItem) => {
    if (!mission.id || !user) return;
    try {
      await backend.users.takeMission(user.id, mission.id);
      setNotif({ open: true, title: 'Готово — миссия назначена', message: 'Миссия добавлена в раздел Активные', variant: 'success' });
      // Обновляем список миссий и активные пользователя
      const [data, myMissions] = await Promise.all([
        backend.missions.list(),
        backend.users.missions(user.id),
      ]);
      const mapped: MissionItem[] = data.map((m: MissionDTO) => ({
        id: m.id,
        title: m.name,
        description: m.description || '',
        difficulty: m.difficulty || '—',
        reward: `${m.experienceReward ?? 0} XP`,
        status: (m.isActive ? 'available' : 'soon') as StatusId,
        requiredExperience: m.requiredExperience,
        requiredRank: m.requiredRank,
        type: m.type,
      }));
      setMissions(mapped);
      setUserMissions(myMissions || []);
      
      // Обновляем разделение на активные и выполненные
      const activeMissions = (myMissions || []).filter(m => m.status !== 'COMPLETED');
      const completedMissions = (myMissions || []).filter(m => m.status === 'COMPLETED');
      setUserMissions(activeMissions);
      setCompletedMissions(completedMissions);
    } catch (e: any) {
      const errorInfo = handleApiError(e, 'Ошибка', 'Не удалось взять миссию');
      setNotif({ open: true, ...errorInfo });
    }
  };

  const askConfirm = async (mission: MissionItem) => {
    setPendingMission(mission);
    // Получаем сообщение подтверждения с бекенда
    try {
      const confirmationData = await backend.messages.takeMission(mission.id || 0);
      setConfirmOpen({ 
        open: true, 
        title: confirmationData.title,
        message: confirmationData.message
      });
    } catch (e: any) {
      console.warn('Не удалось получить сообщение подтверждения:', e?.message);
      setConfirmOpen({ 
        open: true, 
        title: 'Подтверждение',
        message: `Ты действительно хочешь пройти эту миссию: «${mission.title}»?`
      });
    }
  };

  const closeConfirm = () => {
    setConfirmOpen({ open: false });
    setPendingMission(null);
  };

  const confirmTake = async () => {
    if (pendingMission) {
      await handleTakeMission(pendingMission);
    }
    closeConfirm();
  };

  const getMissionImage = (mission: MissionItem) => {
    // Возвращаем изображение в зависимости от типа миссии
    switch (mission.type) {
      case 'QUEST':
        return '/images/missions/quest.jpg';
      case 'CHALLENGE':
        return '/images/missions/challenge.jpg';
      case 'TEST':
        return '/images/missions/test.jpg';
      default:
        return '/images/missions/default.jpg';
    }
  };

  const getMissionCategory = (mission: MissionItem) => {
    switch (mission.type) {
      case 'QUEST':
        return 'Квесты';
      case 'CHALLENGE':
        return 'Рекрутинг';
      case 'TEST':
        return 'Лекторий';
      default:
        return 'Симулятор';
    }
  };

  return (
    <div className="h-full pb-8 relative">
      <DecoOrb>
        <div className="ring r1" />
        <div className="ring r2" />
        <div className="ring r3" />
      </DecoOrb>

      {/* Заголовок */}
      <div className="text-center mb-8">
        <ShinyText text="МИССИИ" className="text-3xl font-bold" speed={6} />
      </div>

      {/* Под-вкладки статуса */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap gap-3 mb-8 justify-center"
      >
        <MainButton onClick={() => changeStatus('active')} className={status === 'active' ? '' : 'opacity-70'}>
          Активные
        </MainButton>
        <MainButton onClick={() => changeStatus('available')} className={status === 'available' ? '' : 'opacity-70'}>
          Доступно
        </MainButton>
        <MainButton onClick={() => changeStatus('soon')} className={status === 'soon' ? '' : 'opacity-70'}>
          Будет позже
        </MainButton>
        <MainButton onClick={() => changeStatus('history')} className={status === 'history' ? '' : 'opacity-70'}>
          История
        </MainButton>
      </motion.div>

      {/* Сетка карточек */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="px-4"
        transition={{ when: 'beforeChildren' }}
      >
        <StyledCardGrid>
          {itemsToRender.map((m, idx) => (
            <motion.div key={`${m.title}-${idx}`} variants={itemVariants}>
              <StyledCard>
                <motion.div layoutId={`mission-${m.id}-card`} className={`card ${status === 'history' ? 'history-card' : ''}`} style={{ width: 180 }}>
                  <span />
                  <div className="content">
                    {m.type && (
                      <div className="badge" style={{
                        background: m.type === 'QUEST' ? 'rgba(16,185,129,0.2)' : m.type === 'CHALLENGE' ? 'rgba(59,130,246,0.2)' : m.type === 'TEST' ? 'rgba(245,158,11,0.2)' : 'rgba(168,85,247,0.2)',
                        borderColor: m.type === 'QUEST' ? 'rgba(16,185,129,0.35)' : m.type === 'CHALLENGE' ? 'rgba(59,130,246,0.35)' : m.type === 'TEST' ? 'rgba(245,158,11,0.35)' : 'rgba(168,85,247,0.35)',
                        color: m.type === 'QUEST' ? '#34d399' : m.type === 'CHALLENGE' ? '#60a5fa' : m.type === 'TEST' ? '#fbbf24' : '#c084fc'
                      }}>
                        {m.type === 'QUEST' ? 'Квесты' : m.type === 'CHALLENGE' ? 'Рекрутинг' : m.type === 'TEST' ? 'Лекторий' : 'Симулятор'}
                      </div>
                    )}
                    <div className={`title ${m.type ? 'mt-5' : ''}`}>{m.title}</div>
                    <div className="meta">
                      <div>Сложн.: {m.difficulty}</div>
                      <div>Награда: {m.reward}</div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      {status === 'available' && (
                        <button
                          onClick={() => askConfirm(m)}
                          className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded text-cyan-300 text-xs hover:bg-cyan-500/30 transition-all duration-300"
                        >
                          Взять миссию
                        </button>
                      )}
                      {status === 'history' && (
                        <div className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded text-green-300 text-xs text-center">
                          ✓ Выполнена
                        </div>
                      )}
                      <button
                        onClick={() => setExpandedMission(m)}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30 transition-all duration-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </StyledCard>
            </motion.div>
          ))}
        </StyledCardGrid>
      </motion.div>

      {/* Пагинация */}
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

      {/* Neon Confirm Modal */}
      {confirmOpen.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeConfirm} />
          <div className="relative z-[110] w-[90%] max-w-md rounded-2xl border border-cyan-400/30 bg-slate-900/80 p-6 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(34,211,238,0.25), inset 0 0 30px rgba(34,211,238,0.15)' }} />
            <h3 className="text-xl font-bold text-cyan-300 mb-2">{confirmOpen.title || 'Подтверждение'}</h3>
            <p className="text-gray-300 text-sm mb-6">
              {confirmOpen.message || `Ты действительно хочешь пройти эту миссию: «${pendingMission?.title}»?`}
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={closeConfirm} className="px-4 py-2 rounded-md border border-white/20 text-gray-300 hover:bg-white/10 transition">Отмена</button>
              <button onClick={confirmTake} className="px-4 py-2 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/30 transition">Да!</button>
            </div>
          </div>
        </div>
      )}
      <SystemNotification
        open={notif.open}
        title={notif.title}
        message={notif.message}
        variant={notif.variant}
        onClose={() => setNotif(prev => ({ ...prev, open: false }))}
        autoCloseMs={2500}
        actionLabel={status !== 'active' ? 'Открыть Активные' : undefined}
        onAction={status !== 'active' ? () => setStatus('active') : undefined}
      />

      <AnimatePresence>
        {expandedMission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setExpandedMission(null)}
          >
            <motion.div
              layoutId={`mission-${expandedMission.id}-card`}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="relative bg-slate-900/80 rounded-2xl border border-cyan-400/30 max-w-2xl w-full max-h-[80vh] shadow-[0_0_30px_rgba(34,211,238,0.35)] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(34,211,238,0.25), inset 0 0 30px rgba(34,211,238,0.15)' }} />
              {/* Изображение миссии */}
              <div className="relative h-52 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 flex items-center justify-center border-b border-cyan-400/20">
                <span className="text-cyan-200/80 text-sm tracking-wide">Здесь изображение миссии</span>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <button
                  onClick={() => setExpandedMission(null)}
                  className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/25 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Контент миссии */}
              <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                <div>
                  <p className="text-cyan-400 text-sm font-medium mb-1">{getMissionCategory(expandedMission)}</p>
                  <h3 className="text-2xl font-bold text-white">{expandedMission.title}</h3>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Описание</h4>
                  <p className="text-slate-300">{expandedMission.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-cyan-400 mb-1">Сложность</h5>
                    <p className="text-slate-300">{expandedMission.difficulty}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-cyan-400 mb-1">Награда</h5>
                    <p className="text-slate-300">{expandedMission.reward}</p>
                  </div>
                </div>

                {expandedMission.requiredExperience && (
                  <div>
                    <h5 className="text-sm font-medium text-cyan-400 mb-1">Требуемый опыт</h5>
                    <p className="text-slate-300">{expandedMission.requiredExperience} XP</p>
                  </div>
                )}

                {expandedMission.requiredRank && (
                  <div>
                    <h5 className="text-sm font-medium text-cyan-400 mb-1">Требуемый ранг</h5>
                    <p className="text-slate-300">{expandedMission.requiredRank}</p>
                  </div>
                )}

                {status === 'available' && (
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        askConfirm(expandedMission);
                        setExpandedMission(null);
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300"
                    >
                      Взять миссию
                    </button>
                  </div>
                )}

                {status === 'history' && (
                  <div className="pt-4">
                    <div className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg text-center">
                      ✓ Выполнена
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MissionsScreen;
