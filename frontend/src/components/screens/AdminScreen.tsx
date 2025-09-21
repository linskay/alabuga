import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PyramidLoader from '../PyramidLoader';
import MainButton from '../MainButton';
import CardTsup from '../CardTsup';

const AdminScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crew' | 'missions' | 'analytics' | 'shop'>('crew');

  const tabs = [
    { id: 'crew' as const, name: 'ЭКИПАЖ', icon: '👥', color: 'from-blue-400 to-cyan-500' },
    { id: 'missions' as const, name: 'ЗАДАНИЯ', icon: '⚡', color: 'from-orange-400 to-red-500' },
    { id: 'analytics' as const, name: 'АНАЛИТИКА', icon: '📊', color: 'from-purple-400 to-violet-500' },
    { id: 'shop' as const, name: 'МАГАЗИН', icon: '🛒', color: 'from-green-400 to-emerald-500' }
  ];

  const users = [
    { id: 1, name: 'Алексей Петров', email: 'alexey@company.com', role: 'Admin', status: 'active', lastLogin: '2 часа назад', level: 45 },
    { id: 2, name: 'Мария Сидорова', email: 'maria@company.com', role: 'User', status: 'active', lastLogin: '1 час назад', level: 38 },
    { id: 3, name: 'Дмитрий Козлов', email: 'dmitry@company.com', role: 'User', status: 'inactive', lastLogin: '3 дня назад', level: 42 },
    { id: 4, name: 'Анна Волкова', email: 'anna@company.com', role: 'Moderator', status: 'active', lastLogin: '30 минут назад', level: 35 }
  ];

  const missions = [
    { id: 1, title: 'Основы React', description: 'Изучение базовых концепций React', difficulty: 'Начинающий', status: 'active', participants: 45, completion: 78 },
    { id: 2, title: 'TypeScript для разработчиков', description: 'Продвинутое использование TypeScript', difficulty: 'Средний', status: 'draft', participants: 0, completion: 0 },
    { id: 3, title: 'Архитектура приложений', description: 'Паттерны и принципы проектирования', difficulty: 'Продвинутый', status: 'active', participants: 23, completion: 45 }
  ];

  const analytics = [
    { title: 'Активные пользователи', value: '1,247', change: '+12%', color: 'from-green-400 to-emerald-500' },
    { title: 'Завершенные миссии', value: '3,456', change: '+8%', color: 'from-blue-400 to-cyan-500' },
    { title: 'Средний уровень', value: '42', change: '+5%', color: 'from-purple-400 to-violet-500' },
    { title: 'Время в системе', value: '2.4ч', change: '+15%', color: 'from-orange-400 to-red-500' }
  ];

  const shopItems = [
    { id: 1, name: 'Премиум подписка', price: 1000, currency: '⚡', category: 'subscription', status: 'active', sales: 45 },
    { id: 2, name: 'Ускоритель опыта', price: 50, currency: '⚡', category: 'boost', status: 'active', sales: 127 },
    { id: 3, name: 'Космический костюм', price: 500, currency: '⚡', category: 'cosmetic', status: 'inactive', sales: 23 }
  ];

  const renderCrewTab = () => (
    <div className="space-y-6">
      {/* User Management */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">👥</span>
            УПРАВЛЕНИЕ ЭКИПАЖЕМ НЕКСУС
          </h3>
          <MainButton
            className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-400/25 transition-all duration-300"
          >
            Добавить пользователя
          </MainButton>
        </div>
        
        <div className="space-y-4">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-xl">
                  👤
                </div>
                <div>
                  <h4 className="text-white font-semibold">{user.name}</h4>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>Уровень {user.level}</span>
                    <span>Последний вход: {user.lastLogin}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded text-xs ${
                  user.status === 'active' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-400'
                }`}>
                  {user.status === 'active' ? 'АКТИВЕН' : 'НЕАКТИВЕН'}
                </div>
                <div className={`px-3 py-1 rounded text-xs ${
                  user.role === 'Admin' ? 'bg-red-500/30 text-red-300' :
                  user.role === 'Moderator' ? 'bg-yellow-500/30 text-yellow-300' :
                  'bg-blue-500/30 text-blue-300'
                }`}>
                  {user.role}
                </div>
                <div className="flex space-x-2">
                  <MainButton
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm hover:bg-white/20 transition-all duration-300"
                  >
                    Редактировать
                  </MainButton>
                  <MainButton
                    className="px-3 py-1 bg-red-500/20 border border-red-400/30 rounded text-red-300 text-sm hover:bg-red-500/30 transition-all duration-300"
                  >
                    Удалить
                  </MainButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMissionsTab = () => (
    <div className="space-y-6">
      {/* Mission Builder */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">⚡</span>
            КОНСТРУКТОР МИССИЙ
          </h3>
          <MainButton
            className="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-400/25 transition-all duration-300"
          >
            Создать миссию
          </MainButton>
        </div>
        
        <div className="space-y-4">
          {missions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-semibold">{mission.title}</h4>
                  <p className="text-gray-400 text-sm mb-2">{mission.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Сложность: {mission.difficulty}</span>
                    <span>Участников: {mission.participants}</span>
                    <span>Завершение: {mission.completion}%</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded text-xs ${
                  mission.status === 'active' ? 'bg-green-500/30 text-green-300' :
                  mission.status === 'draft' ? 'bg-yellow-500/30 text-yellow-300' :
                  'bg-gray-500/30 text-gray-400'
                }`}>
                  {mission.status === 'active' ? 'АКТИВНА' :
                   mission.status === 'draft' ? 'ЧЕРНОВИК' : 'ЗАВЕРШЕНА'}
                </div>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm hover:bg-white/20 transition-all duration-300"
                >
                  Редактировать
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-blue-300 text-sm hover:bg-blue-500/30 transition-all duration-300"
                >
                  Статистика
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-red-500/20 border border-red-400/30 rounded text-red-300 text-sm hover:bg-red-500/30 transition-all duration-300"
                >
                  Удалить
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Analytics Overview with CardTsup */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analytics.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          >
            <CardTsup width="280px" height="200px">
              <div className="text-center p-4">
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm mb-2">{stat.title}</div>
                <div className="text-green-400 text-xs">{stat.change} за месяц</div>
              </div>
            </CardTsup>
          </motion.div>
        ))}
      </div>

      {/* Charts with CardTsup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <CardTsup width="100%" height="300px">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Активность пользователей
              </h3>
              <div className="h-48 bg-white/5 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">График активности</span>
              </div>
            </div>
          </CardTsup>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <CardTsup width="100%" height="300px">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="mr-2">📈</span>
                Завершение миссий
              </h3>
              <div className="h-48 bg-white/5 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">График завершений</span>
              </div>
            </div>
          </CardTsup>
        </motion.div>
      </div>
    </div>
  );

  const renderShopTab = () => (
    <div className="space-y-6">
      {/* Shop Management */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">🛒</span>
            МАГАЗИН НЕКСУС
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300"
          >
            Добавить товар
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <CardTsup width="100%" height="250px">
                <div className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-3xl">🛍️</div>
                      <div>
                        <h4 className="text-white font-bold text-lg">{item.name}</h4>
                        <div className="text-2xl font-bold text-green-400">
                          {item.price} {item.currency}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex justify-between">
                        <span>Продаж:</span>
                        <span className="text-white">{item.sales}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Категория:</span>
                        <span className="text-white capitalize">{item.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className={`px-3 py-1 rounded text-xs text-center ${
                      item.status === 'active' ? 'bg-green-500/30 text-green-300' : 'bg-gray-500/30 text-gray-400'
                    }`}>
                      {item.status === 'active' ? 'АКТИВЕН' : 'НЕАКТИВЕН'}
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs hover:bg-white/20 transition-all duration-300"
                      >
                        Редактировать
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-2 py-1 bg-blue-500/20 border border-blue-400/30 rounded text-blue-300 text-xs hover:bg-blue-500/30 transition-all duration-300"
                      >
                        Статистика
                      </motion.button>
                    </div>
                  </div>
                </div>
              </CardTsup>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full pb-8 overflow-y-auto max-h-screen">

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex space-x-4 mb-8"
      >
        {tabs.map((tab) => (
          <MainButton
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl border transition-all duration-300 ${
              activeTab === tab.id
                ? 'border-gray-400 bg-gray-400/10 shadow-lg shadow-gray-400/20'
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">{tab.icon}</span>
              <span className={`font-bold text-sm tracking-wider ${
                activeTab === tab.id ? 'text-gray-300' : 'text-white'
              }`}>
                {tab.name}
              </span>
            </div>
          </MainButton>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === 'crew' && renderCrewTab()}
        {activeTab === 'missions' && renderMissionsTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'shop' && renderShopTab()}
      </motion.div>

      {/* Pyramid Loader Component */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-12 flex justify-end"
      >
        <PyramidLoader />
      </motion.div>
    </div>
  );
};

export default AdminScreen;
