import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CrewScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'team' | 'ranking' | 'network'>('team');

  const tabs = [
    { id: 'team' as const, name: 'КОМАНДА', icon: '👥', color: 'from-blue-400 to-cyan-500' },
    { id: 'ranking' as const, name: 'РЕЙТИНГ', icon: '🏆', color: 'from-yellow-400 to-orange-500' },
    { id: 'network' as const, name: 'СЕТЬ', icon: '🌐', color: 'from-purple-400 to-pink-500' }
  ];

  const teamMembers = [
    { name: 'Алексей Петров', role: 'Tech Lead', level: 45, avatar: '👨‍💻', status: 'online', xp: 15420 },
    { name: 'Мария Сидорова', role: 'Frontend Dev', level: 38, avatar: '👩‍💻', status: 'online', xp: 12800 },
    { name: 'Дмитрий Козлов', role: 'Backend Dev', level: 42, avatar: '👨‍🔬', status: 'away', xp: 14200 },
    { name: 'Анна Волкова', role: 'UI/UX Designer', level: 35, avatar: '👩‍🎨', status: 'offline', xp: 11200 }
  ];

  const rankingData = [
    { rank: 1, name: 'Иван Смирнов', xp: 25000, avatar: '👑', team: 'Alpha Squad' },
    { rank: 2, name: 'Елена Новикова', xp: 24800, avatar: '🥈', team: 'Beta Team' },
    { rank: 3, name: 'Сергей Морозов', xp: 24500, avatar: '🥉', team: 'Gamma Force' },
    { rank: 1247, name: 'Вы', xp: 15420, avatar: '🚀', team: 'Nebula Crew', isCurrentUser: true }
  ];

  const networkUsers = [
    { name: 'Олег Васильев', role: 'Senior Dev', level: 50, avatar: '👨‍💼', mutual: 3, status: 'online' },
    { name: 'Татьяна Лебедева', role: 'Product Manager', level: 48, avatar: '👩‍💼', mutual: 5, status: 'online' },
    { name: 'Артем Соколов', role: 'DevOps Engineer', level: 44, avatar: '👨‍🔧', mutual: 2, status: 'away' },
    { name: 'Наталья Федорова', role: 'QA Engineer', level: 40, avatar: '👩‍🔬', mutual: 4, status: 'offline' }
  ];

  const renderTeamTab = () => (
    <div className="space-y-6">
      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Участников', value: '4', color: 'from-blue-400 to-cyan-500' },
          { title: 'Средний уровень', value: '40', color: 'from-green-400 to-emerald-500' },
          { title: 'Общий XP', value: '53,620', color: 'from-purple-400 to-violet-500' }
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

      {/* Team Members */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">👥</span>
          УЧАСТНИКИ КОМАНДЫ
        </h3>
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="text-3xl">{member.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-white font-semibold">{member.name}</h4>
                  <div className={`w-2 h-2 rounded-full ${
                    member.status === 'online' ? 'bg-green-400' :
                    member.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                <p className="text-gray-400 text-sm">{member.role}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                  <span>Уровень {member.level}</span>
                  <span>{member.xp.toLocaleString()} XP</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-cyan-400 font-bold text-sm">#{index + 1}</div>
                <div className="text-gray-500 text-xs">в команде</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRankingTab = () => (
    <div className="space-y-6">
      {/* Ranking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Ваш рейтинг', value: '#1,247', color: 'from-yellow-400 to-orange-500' },
          { title: 'Всего пилотов', value: '15,420', color: 'from-blue-400 to-cyan-500' },
          { title: 'Ваш XP', value: '15,420', color: 'from-purple-400 to-violet-500' }
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

      {/* Leaderboard */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">🏆</span>
          ДОСКА ПОЧЕТА
        </h3>
        <div className="space-y-3">
          {rankingData.map((player, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className={`flex items-center space-x-4 p-4 rounded-lg border ${
                player.isCurrentUser 
                  ? 'bg-cyan-500/10 border-cyan-400/30' 
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="text-2xl">{player.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className={`font-semibold ${
                    player.isCurrentUser ? 'text-cyan-300' : 'text-white'
                  }`}>
                    {player.name}
                  </h4>
                  {player.isCurrentUser && (
                    <span className="text-xs bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded">ВЫ</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{player.team}</p>
              </div>
              <div className="text-right">
                <div className={`font-bold ${
                  player.isCurrentUser ? 'text-cyan-400' : 'text-yellow-400'
                }`}>
                  {player.xp.toLocaleString()} XP
                </div>
                <div className="text-gray-500 text-xs">#{player.rank}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNetworkTab = () => (
    <div className="space-y-6">
      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Контактов', value: '127', color: 'from-purple-400 to-pink-500' },
          { title: 'Онлайн', value: '23', color: 'from-green-400 to-emerald-500' },
          { title: 'Взаимных', value: '45', color: 'from-blue-400 to-cyan-500' }
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

      {/* Network Users */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">🌐</span>
          РЕКОМЕНДУЕМЫЕ ПИЛОТЫ
        </h3>
        <div className="space-y-4">
          {networkUsers.map((user, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="text-3xl">{user.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-white font-semibold">{user.name}</h4>
                  <div className={`w-2 h-2 rounded-full ${
                    user.status === 'online' ? 'bg-green-400' :
                    user.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`}></div>
                </div>
                <p className="text-gray-400 text-sm">{user.role}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                  <span>Уровень {user.level}</span>
                  <span>{user.mutual} общих контактов</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-400/25 transition-all duration-300"
                >
                  Добавить
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 border border-white/30 text-white rounded-lg text-sm font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Профиль
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full pb-8 overflow-y-auto">

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex space-x-4 mb-8"
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl border transition-all duration-300 ${
              activeTab === tab.id
                ? 'border-pink-400 bg-pink-400/10 shadow-lg shadow-pink-400/20'
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">{tab.icon}</span>
              <span className={`font-bold text-sm tracking-wider ${
                activeTab === tab.id ? 'text-pink-300' : 'text-white'
              }`}>
                {tab.name}
              </span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === 'team' && renderTeamTab()}
        {activeTab === 'ranking' && renderRankingTab()}
        {activeTab === 'network' && renderNetworkTab()}
      </motion.div>
    </div>
  );
};

export default CrewScreen;
