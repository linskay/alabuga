import React from 'react';
import { motion } from 'framer-motion';

const MapScreen: React.FC = () => {
  return (
    <div className="h-full pb-8 overflow-y-auto">

      {/* Map Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">📍</span>
              ТЕКУЩИЙ СТАТУС
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Текущий ранг</span>
                <span className="text-purple-400 font-bold">CAPTAIN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Уровень</span>
                <span className="text-purple-400 font-bold">42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Прогресс</span>
                <span className="text-purple-400 font-bold">77%</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-purple-400 to-indigo-500 h-3 rounded-full" style={{ width: '77%' }}></div>
              </div>
            </div>
          </div>

          {/* Active Branch */}
          <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">🌿</span>
              АКТИВНАЯ ВЕТКА
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-purple-500/20 border border-purple-400/30 rounded-lg">
                <h4 className="text-white font-semibold">Техническое лидерство</h4>
                <p className="text-gray-300 text-sm">Развитие навыков управления техническими проектами</p>
                <div className="mt-2 text-xs text-purple-300">Прогресс: 8/12 модулей</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Development Branches */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">🗺️</span>
              ВЕТКИ РАЗВИТИЯ
            </h3>
            <div className="space-y-4">
              {[
                { 
                  name: 'Техническое лидерство', 
                  progress: 67, 
                  status: 'active',
                  color: 'from-purple-400 to-indigo-500',
                  description: 'Управление техническими проектами и командами'
                },
                { 
                  name: 'Продуктовая аналитика', 
                  progress: 45, 
                  status: 'available',
                  color: 'from-blue-400 to-cyan-500',
                  description: 'Анализ данных и принятие продуктовых решений'
                },
                { 
                  name: 'UX/UI дизайн', 
                  progress: 0, 
                  status: 'locked',
                  color: 'from-gray-400 to-gray-600',
                  description: 'Создание пользовательских интерфейсов'
                },
                { 
                  name: 'DevOps инженерия', 
                  progress: 0, 
                  status: 'locked',
                  color: 'from-gray-400 to-gray-600',
                  description: 'Автоматизация процессов разработки'
                }
              ].map((branch, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    branch.status === 'active' 
                      ? 'bg-purple-500/20 border-purple-400/30' 
                      : branch.status === 'available'
                      ? 'bg-blue-500/10 border-blue-400/20'
                      : 'bg-gray-500/10 border-gray-400/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-semibold ${
                      branch.status === 'locked' ? 'text-gray-500' : 'text-white'
                    }`}>
                      {branch.name}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      branch.status === 'active' 
                        ? 'bg-purple-500/30 text-purple-300' 
                        : branch.status === 'available'
                        ? 'bg-blue-500/30 text-blue-300'
                        : 'bg-gray-500/30 text-gray-400'
                    }`}>
                      {branch.status === 'active' ? 'АКТИВНА' : 
                       branch.status === 'available' ? 'ДОСТУПНА' : 'ЗАБЛОКИРОВАНА'}
                    </span>
                  </div>
                  <p className={`text-sm mb-3 ${
                    branch.status === 'locked' ? 'text-gray-500' : 'text-gray-300'
                  }`}>
                    {branch.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className={branch.status === 'locked' ? 'text-gray-500' : 'text-gray-400'}>
                        Прогресс
                      </span>
                      <span className={branch.status === 'locked' ? 'text-gray-500' : 'text-cyan-400'}>
                        {branch.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${branch.progress}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                        className={`bg-gradient-to-r ${branch.color} h-2 rounded-full`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Journal Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8"
      >
        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📜</span>
            ЖУРНАЛ ДЕЙСТВИЙ
          </h3>
          <div className="space-y-3">
            {[
              { action: 'Завершена миссия "Оптимизация кода"', time: '2 часа назад', type: 'mission' },
              { action: 'Получен новый навык "React Hooks"', time: '1 день назад', type: 'skill' },
              { action: 'Повышен ранг до CAPTAIN', time: '3 дня назад', type: 'rank' },
              { action: 'Завершен модуль "Управление проектами"', time: '1 неделя назад', type: 'module' }
            ].map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className={`w-3 h-3 rounded-full ${
                  entry.type === 'mission' ? 'bg-green-400' :
                  entry.type === 'skill' ? 'bg-blue-400' :
                  entry.type === 'rank' ? 'bg-purple-400' : 'bg-orange-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-white text-sm">{entry.action}</p>
                </div>
                <span className="text-gray-500 text-xs">{entry.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MapScreen;
