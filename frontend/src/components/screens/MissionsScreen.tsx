import React, { useEffect, useMemo, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import MainButton from '../MainButton';
import { backend, MissionDTO, UserDTO, UserMission } from '../../api';
import SystemNotification from '../SystemNotification';

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingMission, setPendingMission] = useState<MissionItem | null>(null);

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
      } catch (e) {
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
      setNotif({ open: true, title: 'Ошибка', message: e?.message || 'Не удалось взять миссию', variant: 'error' });
    }
  };

  const askConfirm = (mission: MissionItem) => {
    setPendingMission(mission);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setPendingMission(null);
  };

  const confirmTake = async () => {
    if (pendingMission) {
      await handleTakeMission(pendingMission);
    }
    closeConfirm();
  };

  return (
    <div className="h-full pb-8 relative">
      <DecoOrb>
        <div className="ring r1" />
        <div className="ring r2" />
        <div className="ring r3" />
      </DecoOrb>
      {/* Кнопки главных вкладок удалены */}

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
                <div className={`card ${status === 'history' ? 'history-card' : ''}`} style={{ width: 180 }}>
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
                    <div className="title">{m.title}</div>
                    <div className="desc">{m.description}</div>
                    <div className="meta">
                      <div>Сложн.: {m.difficulty}</div>
                      <div>Награда: {m.reward}</div>
                    </div>
                    {status === 'available' && (
                      <button
                        onClick={() => askConfirm(m)}
                        className="mt-2 px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded text-cyan-300 text-xs hover:bg-cyan-500/30 transition-all duration-300"
                      >
                        Взять миссию
                      </button>
                    )}
                    {status === 'history' && (
                      <div className="mt-2 px-3 py-1 bg-green-500/20 border border-green-400/30 rounded text-green-300 text-xs text-center">
                        ✓ Выполнена
                      </div>
                    )}
                  </div>
                </div>
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
      {confirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeConfirm} />
          <div className="relative z-[110] w-[90%] max-w-md rounded-2xl border border-cyan-400/30 bg-slate-900/80 p-6 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ boxShadow: '0 0 60px rgba(34,211,238,0.25), inset 0 0 30px rgba(34,211,238,0.15)' }} />
            <h3 className="text-xl font-bold text-cyan-300 mb-2">Подтверждение</h3>
            <p className="text-gray-300 text-sm mb-6">
              Ты действительно хочешь пройти эту миссию{pendingMission?.title ? `: "${pendingMission.title}"` : ''}?
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
    </div>
  );
};

export default MissionsScreen;
