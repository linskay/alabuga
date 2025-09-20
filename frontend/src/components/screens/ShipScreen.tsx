import React from 'react';
import { motion } from 'framer-motion';

const ShipScreen: React.FC = () => {
  return (
    <div className="h-full pb-8 overflow-y-auto">

      {/* Ship Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ship Status */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">🛸</span>
              СТАТУС КОРАБЛЯ
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Модель</span>
                <span className="text-green-400 font-bold">Nebula-X42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Класс</span>
                <span className="text-green-400 font-bold">Explorer</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Уровень</span>
                <span className="text-green-400 font-bold">15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Здоровье</span>
                <span className="text-green-400 font-bold">95%</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-400 to-teal-500 h-3 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>

          {/* Ship Modules */}
          <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">⚙️</span>
              МОДУЛИ
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Двигатель', level: 8, status: 'active' },
                { name: 'Щиты', level: 6, status: 'active' },
                { name: 'Сенсоры', level: 9, status: 'active' },
                { name: 'Оружие', level: 4, status: 'upgrading' }
              ].map((module, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <div>
                    <span className="text-white text-sm">{module.name}</span>
                    <div className="text-xs text-gray-400">Уровень {module.level}</div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    module.status === 'active' 
                      ? 'bg-green-500/30 text-green-300' 
                      : 'bg-yellow-500/30 text-yellow-300'
                  }`}>
                    {module.status === 'active' ? 'АКТИВЕН' : 'ОБНОВЛЕНИЕ'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Skills and Artifacts */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Skills */}
          <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">⚡</span>
              ПРОКАЧАННЫЕ НАВЫКИ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'JavaScript Mastery', level: 95, color: 'from-yellow-400 to-orange-500', icon: '🟨' },
                { name: 'React Expertise', level: 88, color: 'from-blue-400 to-cyan-500', icon: '⚛️' },
                { name: 'Node.js Proficiency', level: 82, color: 'from-green-400 to-emerald-500', icon: '🟢' },
                { name: 'Database Design', level: 76, color: 'from-purple-400 to-violet-500', icon: '🗄️' },
                { name: 'API Development', level: 91, color: 'from-pink-400 to-rose-500', icon: '🔌' },
                { name: 'DevOps Skills', level: 68, color: 'from-indigo-400 to-blue-500', icon: '⚙️' }
              ].map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{skill.icon}</span>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm">{skill.name}</h4>
                      <div className="text-xs text-gray-400">Уровень {skill.level}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      className={`bg-gradient-to-r ${skill.color} h-2 rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Artifacts Collection */}
          <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="mr-2">🏆</span>
              КОЛЛЕКЦИЯ АРТЕФАКТОВ
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Золотой код', rarity: 'legendary', icon: '👑', description: 'За идеальный код' },
                { name: 'Серебряный баг', rarity: 'epic', icon: '🐛', description: 'За быстрое исправление' },
                { name: 'Бронзовый коммит', rarity: 'rare', icon: '💎', description: 'За качественные коммиты' },
                { name: 'Железный тест', rarity: 'common', icon: '🧪', description: 'За покрытие тестами' },
                { name: 'Платиновый рефакторинг', rarity: 'legendary', icon: '✨', description: 'За отличный рефакторинг' },
                { name: 'Медный деплой', rarity: 'common', icon: '🚀', description: 'За успешные деплои' },
                { name: 'Алмазный алгоритм', rarity: 'epic', icon: '💠', description: 'За оптимизацию' },
                { name: 'Рубиновый дизайн', rarity: 'rare', icon: '🎨', description: 'За красивый UI' }
              ].map((artifact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.05 }}
                  className={`p-4 rounded-lg border text-center ${
                    artifact.rarity === 'legendary' ? 'bg-yellow-500/10 border-yellow-400/30' :
                    artifact.rarity === 'epic' ? 'bg-purple-500/10 border-purple-400/30' :
                    artifact.rarity === 'rare' ? 'bg-blue-500/10 border-blue-400/30' :
                    'bg-gray-500/10 border-gray-400/30'
                  }`}
                >
                  <div className="text-3xl mb-2">{artifact.icon}</div>
                  <h4 className={`text-sm font-semibold mb-1 ${
                    artifact.rarity === 'legendary' ? 'text-yellow-300' :
                    artifact.rarity === 'epic' ? 'text-purple-300' :
                    artifact.rarity === 'rare' ? 'text-blue-300' :
                    'text-gray-300'
                  }`}>
                    {artifact.name}
                  </h4>
                  <p className="text-xs text-gray-400">{artifact.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShipScreen;
