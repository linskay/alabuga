import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { backend, UserDTO } from '../../api';
import MainButton from '../MainButton';
import ShinyText from '../ShinyText';
import styled from 'styled-components';

const PodiumCard = styled.div<{ $gradient: string }>`
  .container {
    --background: ${props => props.$gradient};
    width: 190px;
    height: 254px;
    padding: 4px;
    border-radius: 8px;
    overflow: visible;
    display: flex;
    align-items: center;
    background: var(--background);
    position: relative;
  }

  .container .box {
    position: relative;
    width: 190px;
    height: 244px;
    background: #0f172a; /* slate-900 */
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
  }

  .container .box .content {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    gap: 10px;
    padding: 10px 16px;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .container .box::before {
    content: '';
    position: absolute;
    inset: -10px 50px;
    border-top: 4px solid rgba(255,255,255,0.25);
    border-bottom: 4px solid rgba(255,255,255,0.25);
    z-index: -1;
    transform: skewY(15deg);
    transition: 0.5s ease-in-out;
  }

  .container .box:hover::before { transform: skewY(0deg); inset: -10px 40px; }

  .container .box::after {
    content: '';
    position: absolute;
    inset: 60px -10px;
    border-left: 4px solid rgba(255,255,255,0.2);
    border-right: 4px solid rgba(255,255,255,0.2);
    z-index: -1;
    transform: skew(15deg);
    transition: 0.5s ease-in-out;
  }

  .container .box:hover::after { transform: skew(0deg); inset: 40px -10px; }
`;

const TopPlaceCard: React.FC<{ place: 1|2|3; login?: string; energy?: number; xp?: number }>=({ place, login='—', energy=0, xp=0 })=>{
  const gradient = place===1
    ? 'linear-gradient(to left, #f59e0b 0%, #f97316 100%)' // gold
    : place===2
    ? 'linear-gradient(to left, #94a3b8 0%, #64748b 100%)' // silver
    : 'linear-gradient(to left, #b45309 0%, #92400e 100%)'; // bronze
  return (
    <PodiumCard $gradient={gradient}>
      <div className="container">
        <div className="box">
          <div className="content">
            <div className={`mb-1 text-sm ${place===1?'text-yellow-300':'text-gray-300'}`}>{place} место</div>
            <div className="w-full h-20 rounded-lg relative overflow-hidden" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,.15), transparent 60%)' }} />
            <div className="text-white font-semibold truncate w-full">{login}</div>
            <div className="text-cyan-300 text-sm">⚡ {energy}</div>
            <div className="font-bold text-yellow-300">{(xp||0).toLocaleString()} XP</div>
          </div>
        </div>
      </div>
    </PodiumCard>
  );
};

const CrewScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ranking'>('ranking');
  const [timeframe, setTimeframe] = useState<'all' | 'week'>('all');
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loadingRank, setLoadingRank] = useState(false);

  const tabs: never[] = [];

  const teamMembers = [
    { name: 'Алексей Петров', role: 'Tech Lead', level: 45, avatar: '👨‍💻', status: 'online', xp: 15420 },
    { name: 'Мария Сидорова', role: 'Frontend Dev', level: 38, avatar: '👩‍💻', status: 'online', xp: 12800 },
    { name: 'Дмитрий Козлов', role: 'Backend Dev', level: 42, avatar: '👨‍🔬', status: 'away', xp: 14200 },
    { name: 'Анна Волкова', role: 'UI/UX Designer', level: 35, avatar: '👩‍🎨', status: 'offline', xp: 11200 }
  ];

  useEffect(() => {
    if (activeTab !== 'ranking') return;
    let mounted = true;
    (async () => {
      try {
        setLoadingRank(true);
        const list = await backend.users.list();
        if (!mounted) return;
        setUsers(list);
      } finally {
        if (mounted) setLoadingRank(false);
      }
    })();
    return () => { mounted = false; };
  }, [activeTab]);

  const [weeklyXpByUser, setWeeklyXpByUser] = useState<Record<number, number>>({});

  useEffect(() => {
    if (activeTab !== 'ranking' || timeframe !== 'week' || users.length === 0) return;
    let cancelled = false;
    (async () => {
      setLoadingRank(true);
      try {
        const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const entries = await Promise.all(users.map(async u => {
          try {
            const missions = await backend.missions.byUser(u.id);
            const xp = (missions || []).reduce((sum: number, m: any) => {
              const completedAt = m.completedAt ? new Date(m.completedAt).getTime() : 0;
              const reward = (m.experienceReward ?? m.mission?.experienceReward) || 0;
              return (m.status === 'COMPLETED' && completedAt >= since) ? sum + reward : sum;
            }, 0);
            return [u.id, xp] as [number, number];
          } catch {
            return [u.id, 0] as [number, number];
          }
        }));
        if (cancelled) return;
        const map: Record<number, number> = {};
        for (const [id, xp] of entries) map[id] = xp;
        setWeeklyXpByUser(map);
      } finally {
        if (!cancelled) setLoadingRank(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeTab, timeframe, users]);

  const rankingData = useMemo(() => {
    const data = users.map(u => ({
      id: u.id,
      login: u.login,
      energy: u.energy,
      xp: timeframe === 'all' ? u.experience : (weeklyXpByUser[u.id] || 0)
    }));
    data.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    return data.map((d, idx) => ({
      rank: idx + 1,
      login: d.login,
      xp: d.xp,
      energy: d.energy
    }));
  }, [users, timeframe, weeklyXpByUser]);

  const networkUsers = [
    { name: 'Олег Васильев', role: 'Senior Dev', level: 50, avatar: '👨‍💼', mutual: 3, status: 'online' },
    { name: 'Татьяна Лебедева', role: 'Product Manager', level: 48, avatar: '👩‍💼', mutual: 5, status: 'online' },
    { name: 'Артем Соколов', role: 'DevOps Engineer', level: 44, avatar: '👨‍🔧', mutual: 2, status: 'away' },
    { name: 'Наталья Федорова', role: 'QA Engineer', level: 40, avatar: '👩‍🔬', mutual: 4, status: 'offline' }
  ];

  const renderTeamTab = () => null;

  const renderRankingTab = () => (
    <div className="space-y-6">
      {/* Ranking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Режим', value: timeframe === 'all' ? 'ВЕСЬ ВРЕМЯ' : 'НЕДЕЛЯ', color: 'from-yellow-400 to-orange-500' },
          { title: 'Всего пилотов', value: users.length.toString(), color: 'from-blue-400 to-cyan-500' },
          { title: timeframe === 'all' ? 'Топ‑1 XP' : 'Топ‑1 XP (неделя)', value: (rankingData[0]?.xp || 0).toLocaleString(), color: 'from-purple-400 to-violet-500' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl p-4"
          >
            <div className="text-center">
              <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-gray-300 text-sm mt-1">{stat.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toggle All / Week */}
      <div className="flex items-center justify-center gap-4">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setTimeframe('all')} className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${timeframe==='all' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20' : 'border border-white/20 text-white/90 hover:bg-white/10'}`}>
          ВЕСЬ
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setTimeframe('week')} className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${timeframe==='week' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20' : 'border border-white/20 text-white/90 hover:bg-white/10'}`}>
          НЕДЕЛЯ
        </motion.button>
      </div>

      {/* Top 3 podium */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">🏆</span>
          ДОСКА ПОЧЁТА
        </h3>
        <div className="grid grid-cols-3 gap-4 items-end justify-items-center">
          <TopPlaceCard place={2} login={rankingData[1]?.login} energy={rankingData[1]?.energy} xp={rankingData[1]?.xp} />
          <TopPlaceCard place={1} login={rankingData[0]?.login} energy={rankingData[0]?.energy} xp={rankingData[0]?.xp} />
          <TopPlaceCard place={3} login={rankingData[2]?.login} energy={rankingData[2]?.energy} xp={rankingData[2]?.xp} />
        </div>
        {/* Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="py-2 pr-4">Место</th>
                <th className="py-2 pr-4">Логин</th>
                <th className="py-2 pr-4">Энергон</th>
                <th className="py-2 pr-4">XP</th>
              </tr>
            </thead>
            <tbody>
              {rankingData.slice(0, 50).map((p) => (
                <tr key={p.rank} className="border-t border-white/10 hover:bg-white/5 transition">
                  <td className="py-2 pr-4">
                    {p.rank <= 10 ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.rank===1 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' : p.rank===2 ? 'bg-gray-300/20 text-gray-200 border border-gray-300/30' : p.rank===3 ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30' : 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/20'}`}>{p.rank}</span>
                    ) : (
                      <span className="text-gray-300">{p.rank}</span>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-white">{p.login}</td>
                  <td className="py-2 pr-4 text-cyan-300">{p.energy}</td>
                  <td className="py-2 pr-4 text-yellow-300 font-semibold">{p.xp.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {loadingRank && <div className="text-center text-gray-400 mt-3">Загрузка...</div>}
        </div>
      </div>
    </div>
  );

  const renderNetworkTab = () => null;

  return (
    <div className="h-full pb-8 overflow-y-auto max-h-screen">

      {/* Header and toggle only */}
      <div className="mb-6 flex items-center justify-between">
        <ShinyText text="РЕЙТИНГ" className="text-2xl md:text-3xl font-bold" />
        <div className="flex gap-3">
          <MainButton onClick={() => setTimeframe('all')} className={timeframe==='all' ? '' : 'opacity-70'}>РЕЙТИНГ (ВСЁ ВРЕМЯ)</MainButton>
          <MainButton onClick={() => setTimeframe('week')} className={timeframe==='week' ? '' : 'opacity-70'}>РЕЙТИНГ (НЕДЕЛЯ)</MainButton>
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderRankingTab()}
      </motion.div>
    </div>
  );
};

export default CrewScreen;
