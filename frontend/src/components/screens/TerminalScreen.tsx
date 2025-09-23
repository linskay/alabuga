import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CircularLoader from '../CircularLoader';

const TerminalScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'balance' | 'shop' | 'rewards'>('balance');

  const tabs = [
    { id: 'balance' as const, name: 'БАЛАНС', icon: '💰', color: 'from-yellow-400 to-amber-500' },
    { id: 'shop' as const, name: 'МАГАЗИН', icon: '🛒', color: 'from-green-400 to-emerald-500' },
    { id: 'rewards' as const, name: 'НАГРАДЫ', icon: '🎁', color: 'from-purple-400 to-pink-500' }
  ];

  const currencies = [
    { name: 'Космические кредиты', amount: 15420, symbol: '₵', color: 'from-yellow-400 to-amber-500' },
    { name: 'Энергетические ядра', amount: 127, symbol: '⚡', color: 'from-blue-400 to-cyan-500' },
    { name: 'Квантовые кристаллы', amount: 89, symbol: '💎', color: 'from-purple-400 to-violet-500' },
    { name: 'Звездная пыль', amount: 2341, symbol: '✨', color: 'from-pink-400 to-rose-500' }
  ];

  const shopItems = [
    { name: 'Премиум подписка', price: 1000, currency: '₵', description: 'Доступ к эксклюзивному контенту', category: 'subscription' },
    { name: 'Ускоритель опыта', price: 50, currency: '⚡', description: '+50% опыта на 24 часа', category: 'boost' },
    { name: 'Космический костюм', price: 500, currency: '₵', description: 'Эксклюзивный аватар', category: 'cosmetic' },
    { name: 'Квантовый модуль', price: 25, currency: '💎', description: 'Улучшение для корабля', category: 'upgrade' },
    { name: 'Звездная карта', price: 200, currency: '₵', description: 'Доступ к новым миссиям', category: 'content' },
    { name: 'Энергетический щит', price: 30, currency: '⚡', description: 'Защита от потери прогресса', category: 'protection' }
  ];

  const availableRewards = [
    { name: 'Ежедневный бонус', description: 'Получите 100 кредитов', reward: '100 ₵', timeLeft: '2 часа', type: 'daily' },
    { name: 'Недельный челлендж', description: 'Завершите 5 миссий', reward: '500 ₵ + 10 ⚡', timeLeft: '3 дня', type: 'weekly' },
    { name: 'Сезонная награда', description: 'Достигните 50 уровня', reward: '2000 ₵ + 50 💎', timeLeft: '15 дней', type: 'seasonal' },
    { name: 'Бонус за активность', description: 'Войдите в систему 7 дней подряд', reward: '300 ₵', timeLeft: '1 день', type: 'streak' }
  ];

  const renderBalanceTab = () => (
    <div className="space-y-6">
      {/* Currency Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currencies.map((currency, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl p-6"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{currency.symbol}</div>
              <div className={`text-2xl font-bold bg-gradient-to-r ${currency.color} bg-clip-text text-transparent mb-1`}>
                {currency.amount.toLocaleString()}
              </div>
              <div className="text-gray-300 text-sm">{currency.name}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">📊</span>
          ИСТОРИЯ ТРАНЗАКЦИЙ
        </h3>
        <div className="space-y-3">
          {[
            { type: 'earned', description: 'Завершение миссии "React Basics"', amount: '+500 ₵', time: '2 часа назад' },
            { type: 'spent', description: 'Покупка ускорителя опыта', amount: '-50 ⚡', time: '1 день назад' },
            { type: 'earned', description: 'Ежедневный бонус', amount: '+100 ₵', time: '1 день назад' },
            { type: 'earned', description: 'Завершение челленджа', amount: '+1000 ₵', time: '3 дня назад' },
            { type: 'spent', description: 'Покупка космического костюма', amount: '-500 ₵', time: '1 неделя назад' }
          ].map((transaction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  transaction.type === 'earned' ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <div>
                  <p className="text-white text-sm">{transaction.description}</p>
                  <p className="text-gray-500 text-xs">{transaction.time}</p>
                </div>
              </div>
              <span className={`font-bold ${
                transaction.type === 'earned' ? 'text-green-400' : 'text-red-400'
              }`}>
                {transaction.amount}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderShopTab = () => (
    <div className="space-y-6">
      {/* Shop Categories */}
      <div className="flex space-x-4 mb-6">
        {['Все', 'Подписки', 'Бусты', 'Косметика', 'Улучшения'].map((category, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-all duration-300"
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Shop Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl p-6"
          >
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🛍️</div>
              <h3 className="text-white font-bold mb-2">{item.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{item.description}</p>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {item.price} {item.currency}
              </div>
              <div className={`text-xs px-2 py-1 rounded ${
                item.category === 'subscription' ? 'bg-purple-500/30 text-purple-300' :
                item.category === 'boost' ? 'bg-blue-500/30 text-blue-300' :
                item.category === 'cosmetic' ? 'bg-pink-500/30 text-pink-300' :
                item.category === 'upgrade' ? 'bg-green-500/30 text-green-300' :
                item.category === 'content' ? 'bg-orange-500/30 text-orange-300' :
                'bg-gray-500/30 text-gray-300'
              }`}>
                {item.category.toUpperCase()}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-400/25 transition-all duration-300"
            >
              Купить
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderRewardsTab = () => (
    <div className="space-y-6">
      {/* Available Rewards */}
      <div className="space-y-4">
        {availableRewards.map((reward, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            className="bg-black/30 backdrop-blur-md border border-white/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`text-2xl ${
                    reward.type === 'daily' ? '📅' :
                    reward.type === 'weekly' ? '📆' :
                    reward.type === 'seasonal' ? '🌟' : '🔥'
                  }`}></div>
                  <div>
                    <h3 className="text-white font-bold">{reward.name}</h3>
                    <p className="text-gray-400 text-sm">{reward.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-yellow-400 font-semibold">{reward.reward}</span>
                  <span className="text-gray-500">Осталось: {reward.timeLeft}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-400/25 transition-all duration-300"
              >
                Получить
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reward History */}
      <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">📜</span>
          ИСТОРИЯ НАГРАД
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Ежедневный бонус', reward: '100 ₵', date: 'Вчера', status: 'claimed' },
            { name: 'Недельный челлендж', reward: '500 ₵ + 10 ⚡', date: '3 дня назад', status: 'claimed' },
            { name: 'Бонус за активность', reward: '300 ₵', date: '1 неделя назад', status: 'claimed' },
            { name: 'Сезонная награда', reward: '2000 ₵ + 50 💎', date: '2 недели назад', status: 'claimed' }
          ].map((reward, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div>
                  <p className="text-white text-sm">{reward.name}</p>
                  <p className="text-gray-500 text-xs">{reward.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-green-400 font-bold text-sm">{reward.reward}</span>
                <div className="text-xs text-gray-500">Получено</div>
              </div>
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
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl border transition-all duration-300 ${
              activeTab === tab.id
                ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20'
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">{tab.icon}</span>
              <span className={`font-bold text-sm tracking-wider ${
                activeTab === tab.id ? 'text-yellow-300' : 'text-white'
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
        {activeTab === 'balance' && renderBalanceTab()}
        {activeTab === 'shop' && renderShopTab()}
        {activeTab === 'rewards' && renderRewardsTab()}
      </motion.div>

      {/* Circular Loader Component */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-12 flex justify-center"
      >
        <CircularLoader />
      </motion.div>
    </div>
  );
};

export default TerminalScreen;
