import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MissionsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'academy' | 'operations' | 'challenges'>('academy');

  const tabs = [
    { id: 'academy' as const, name: 'АКАДЕМИЯ', icon: '🎓', color: 'from-blue-400 to-cyan-500' },
    { id: 'operations' as const, name: 'ОПЕРАЦИИ', icon: '⚡', color: 'from-orange-400 to-red-500' },
    { id: 'challenges' as const, name: 'ИСПЫТАНИЯ', icon: '🏆', color: 'from-purple-400 to-pink-500' }
  ];

  const academyMissions = [
    { title: 'Основы React', description: 'Изучение базовых концепций React', progress: 75, difficulty: 'Начинающий', reward: '500 XP' },
    { title: 'TypeScript для разработчиков', description: 'Продвинутое использование TypeScript', progress: 45, difficulty: 'Средний', reward: '750 XP' },
    { title: 'Архитектура приложений', description: 'Паттерны и принципы проектирования', progress: 0, difficulty: 'Продвинутый', reward: '1000 XP' }
  ];

  const operationsMissions = [
    { title: 'Оптимизация производительности', description: 'Улучшение скорости загрузки сайта', progress: 100, difficulty: 'Средний', reward: '600 XP' },
    { title: 'Рефакторинг legacy кода', description: 'Модернизация старого кода', progress: 30, difficulty: 'Продвинутый', reward: '800 XP' },
    { title: 'Интеграция с API', description: 'Подключение внешних сервисов', progress: 0, difficulty: 'Средний', reward: '550 XP' }
  ];

  const challengesMissions = [
    { title: 'Хакатон 2024', description: '48-часовой марафон разработки', progress: 0, difficulty: 'Эксперт', reward: '2000 XP' },
    { title: 'Code Review Challenge', description: 'Анализ и улучшение кода команды', progress: 60, difficulty: 'Продвинутый', reward: '900 XP' },
    { title: 'Bug Hunt', description: 'Поиск и исправление критических ошибок', progress: 0, difficulty: 'Средний', reward: '700 XP' }
  ];

  const getCurrentMissions = () => {
    switch (activeTab) {
      case 'academy': return academyMissions;
      case 'operations': return operationsMissions;
      case 'challenges': return challengesMissions;
      default: return academyMissions;
    }
  };

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
                ? 'border-orange-400 bg-orange-400/10 shadow-lg shadow-orange-400/20'
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">{tab.icon}</span>
              <span className={`font-bold text-sm tracking-wider ${
                activeTab === tab.id ? 'text-orange-300' : 'text-white'
              }`}>
                {tab.name}
              </span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Mission Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        {[
          { title: 'Активные миссии', value: '3', color: 'from-blue-400 to-cyan-500' },
          { title: 'Завершено', value: '24', color: 'from-green-400 to-emerald-500' },
          { title: 'Получено XP', value: '12,450', color: 'from-purple-400 to-violet-500' },
          { title: 'Текущий рейтинг', value: '#1,247', color: 'from-orange-400 to-red-500' }
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
      </motion.div>

      {/* Missions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="space-y-6"
      >
        {getCurrentMissions().map((mission, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
            className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{mission.title}</h3>
                <p className="text-gray-300 mb-3">{mission.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-400">Сложность: <span className="text-cyan-400">{mission.difficulty}</span></span>
                  <span className="text-gray-400">Награда: <span className="text-yellow-400">{mission.reward}</span></span>
                </div>
              </div>
              <div className="ml-6">
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">{mission.progress}%</div>
                  <div className="text-xs text-gray-400">Прогресс</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mission.progress}%` }}
                  transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {mission.progress === 0 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-400/25 transition-all duration-300"
                >
                  Начать миссию
                </motion.button>
              ) : mission.progress === 100 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300"
                >
                  Завершено ✓
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300"
                >
                  Продолжить
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Подробнее
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MissionsScreen;
