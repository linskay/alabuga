import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import AnimatedServer from '../AnimatedServer';
import PyramidLoader2 from '../PyramidLoader2';

const AstronautCard = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <img src="https://uiverse.io/astronaut.png" alt="Astronaut" className="image" />
        <div className="heading">КОМАНДИР КОСМИЧЕСКОГО КОРАБЛЯ</div>
        <div className="rank-info">
          <div className="rank-badge">КАПИТАН</div>
          <div className="level-info">Уровень 42</div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const ProfileScreen: React.FC = () => {
  return (
    <div className="h-full pb-8 overflow-y-auto max-h-screen">
      {/* PyramidLoader2 Component */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-8 right-8 z-10"
      >
        <PyramidLoader2 />
      </motion.div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Astronaut Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1 flex justify-center"
        >
          <AstronautCard />
        </motion.div>

        {/* Stats and Skills */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Stats */}
          <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border border-cyan-400/20 rounded-3xl p-8 shadow-2xl shadow-cyan-500/10">
            <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3 text-3xl">📊</span>
              СТАТИСТИКА ПИЛОТА
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-gray-300 flex items-center">
                    <span className="mr-2">⚡</span>
                    Опыт
                  </span>
                  <span className="text-cyan-400 font-bold">15,420 / 20,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-gray-300 flex items-center">
                    <span className="mr-2">🎯</span>
                    Миссии
                  </span>
                  <span className="text-cyan-400 font-bold text-xl">127</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-gray-300 flex items-center">
                    <span className="mr-2">🏆</span>
                    Рейтинг
                  </span>
                  <span className="text-cyan-400 font-bold">#1,247</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-gray-300 flex items-center">
                    <span className="mr-2">🚀</span>
                    Скорость
                  </span>
                  <span className="text-cyan-400 font-bold">850 км/ч</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-gray-300 flex items-center">
                    <span className="mr-2">🛡️</span>
                    Броня
                  </span>
                  <span className="text-blue-400 font-bold">95%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-gray-300 flex items-center">
                    <span className="mr-2">⚔️</span>
                    Оружие
                  </span>
                  <span className="text-red-400 font-bold">Максимум</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between text-sm text-gray-300 mb-3">
                <span className="flex items-center">
                  <span className="mr-2">🚀</span>
                  Прогресс до следующего уровня
                </span>
                <span className="text-cyan-400 font-bold">77%</span>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-3 border border-gray-600/30">
                <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 h-3 rounded-full shadow-lg shadow-cyan-500/30" style={{ width: '77%' }}></div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border border-purple-400/20 rounded-3xl p-8 shadow-2xl shadow-purple-500/10">
            <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3 text-3xl">⚡</span>
              НАВЫКИ И КОМПЕТЕНЦИИ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Пилотирование', level: 85, color: 'from-green-400 to-emerald-500' },
                { name: 'Навигация', level: 72, color: 'from-blue-400 to-cyan-500' },
                { name: 'Боевые системы', level: 68, color: 'from-purple-400 to-violet-500' },
                { name: 'Ремонт', level: 91, color: 'from-orange-400 to-red-500' },
                { name: 'Исследования', level: 76, color: 'from-pink-400 to-rose-500' },
                { name: 'Коммуникации', level: 83, color: 'from-yellow-400 to-amber-500' }
              ].map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-white font-semibold">{skill.name}</span>
                    <span className="text-cyan-400 font-bold">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-3 border border-gray-600/30">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                      className={`bg-gradient-to-r ${skill.color} h-3 rounded-full shadow-lg`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl border border-yellow-400/20 rounded-3xl p-8 shadow-2xl shadow-yellow-500/10">
            <h4 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3 text-3xl">🏆</span>
              ПОСЛЕДНИЕ ДОСТИЖЕНИЯ
            </h4>
            <div className="space-y-3">
              {[
                { title: 'Первый полет', description: 'Успешно завершил первую космическую миссию', icon: '🚀', date: '2 дня назад' },
                { title: 'Исследователь', description: 'Открыл 5 новых планетарных систем', icon: '🔬', date: '1 неделя назад' },
                { title: 'Защитник', description: 'Отразил атаку космических пиратов', icon: '🛡️', date: '2 недели назад' },
                { title: 'Мастер навигации', description: 'Прошел через астероидное поле без повреждений', icon: '🧭', date: '3 недели назад' }
              ].map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-yellow-400/30 hover:bg-yellow-500/5 transition-all duration-300"
                >
                  <div className="text-3xl p-2 bg-yellow-500/10 rounded-full">{achievement.icon}</div>
                  <div className="flex-1">
                    <h5 className="text-white font-bold text-lg">{achievement.title}</h5>
                    <p className="text-gray-300 text-sm">{achievement.description}</p>
                  </div>
                  <span className="text-yellow-400 text-xs font-mono bg-yellow-500/10 px-2 py-1 rounded-full">{achievement.date}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Animated Server Component */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-12 flex justify-start"
      >
        <AnimatedServer />
      </motion.div>
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
