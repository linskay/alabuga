import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useMotionTemplate, useMotionValue, animate } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
const Satellite = (p: any) => <span {...p}>🛰️</span>;
const Radar = (p: any) => <span {...p}>📡</span>;
const Building = (p: any) => <span {...p}>🏗️</span>;
const BookOpen = (p: any) => <span {...p}>📖</span>;
const Users = (p: any) => <span {...p}>👥</span>;
const GraduationCap = (p: any) => <span {...p}>🎓</span>;
const Radio = (p: any) => <span {...p}>📻</span>;
const Navigation = (p: any) => <span {...p}>🧭</span>;
const Shield = (p: any) => <span {...p}>🛡️</span>;
const Crown = (p: any) => <span {...p}>👑</span>;
const ChevronRight = (p: any) => <span {...p}>›</span>;
const Zap = (p: any) => <span {...p}>⚡</span>;

interface RankData {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  branch: 'tech' | 'research' | 'leadership' | 'final';
  level: number;
  color: string;
  glowColor: string;
  requirements?: string[];
}

const COLORS_TOP = ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00'];

const rankSystem: RankData[] = [
  { id: 'cadet', name: 'Космо-Кадет', description: 'Общий старт для всех космических специалистов', icon: Zap, branch: 'tech', level: 0, color: '#64748b', glowColor: '#64748b', requirements: ['Базовые знания космических технологий'] },
  { id: 'navigator', name: 'Навигатор Траекторий', description: 'Специалист по расчету космических траекторий', icon: Satellite, branch: 'tech', level: 1, color: '#0ea5e9', glowColor: '#0ea5e9', requirements: ['Математический анализ', 'Орбитальная механика'] },
  { id: 'analyst', name: 'Аналитик Орбит', description: 'Эксперт по анализу орбитальных систем', icon: Radar, branch: 'tech', level: 2, color: '#3b82f6', glowColor: '#3b82f6', requirements: ['Продвинутая аналитика', 'Системное мышление'] },
  { id: 'architect', name: 'Архитектор Станции', description: 'Мастер проектирования космических станций', icon: Building, branch: 'tech', level: 3, color: '#1d4ed8', glowColor: '#1d4ed8', requirements: ['Инженерное проектирование', 'Структурный анализ'] },
  { id: 'chronicler', name: 'Хронист Галактики', description: 'Летописец космических событий и истории', icon: BookOpen, branch: 'research', level: 1, color: '#8b5cf6', glowColor: '#8b5cf6', requirements: ['Исследовательские навыки', 'Документирование'] },
  { id: 'culturalist', name: 'Исследователь Культур', description: 'Изучатель инопланетных цивилизаций', icon: Users, branch: 'research', level: 2, color: '#a855f7', glowColor: '#a855f7', requirements: ['Ксенобиология', 'Культурная антропология'] },
  { id: 'lecturer', name: 'Мастер Лектория', description: 'Преподаватель космических наук', icon: GraduationCap, branch: 'research', level: 3, color: '#9333ea', glowColor: '#9333ea', requirements: ['Педагогические навыки', 'Экспертиза в области'] },
  { id: 'communicator', name: 'Связист Звёздного Флота', description: 'Специалист по межзвездной связи', icon: Radio, branch: 'leadership', level: 1, color: '#06b6d4', glowColor: '#06b6d4', requirements: ['Коммуникационные технологии', 'Протоколы связи'] },
  { id: 'navigator-leader', name: 'Штурман Экипажа', description: 'Лидер навигационной команды', icon: Navigation, branch: 'leadership', level: 2, color: '#0891b2', glowColor: '#0891b2', requirements: ['Лидерские качества', 'Навигационная экспертиза'] },
  { id: 'commander', name: 'Командир Отряда', description: 'Командир космического отряда', icon: Shield, branch: 'leadership', level: 3, color: '#0e7490', glowColor: '#0e7490', requirements: ['Стратегическое мышление', 'Управление командой'] },
  { id: 'keeper', name: 'Хранитель Станции «Алабуга.TECH»', description: 'Высший ранг космического специалиста', icon: Crown, branch: 'final', level: 4, color: '#fbbf24', glowColor: '#fbbf24', requirements: ['Мастерство во всех областях', 'Исключительное лидерство'] }
];

const RankCard: React.FC<{ rank: RankData; isSelected: boolean; onClick: () => void; delay: number }>= ({ rank, isSelected, onClick, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = rank.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.1, duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] }}
      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${isSelected ? 'border-cyan-400 bg-cyan-400/10 shadow-2xl' : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'} ${isHovered ? 'scale-105' : ''}`}
      style={{ boxShadow: isSelected || isHovered ? `0 0 30px ${rank.glowColor}40, 0 0 60px ${rank.glowColor}20` : undefined }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 rounded-xl opacity-20 blur-xl" style={{ background: `radial-gradient(circle at center, ${rank.color}40, transparent 70%)` }} />
      <div className="relative z-10 flex items-center gap-4 mb-4">
        <div className="p-3 rounded-full border-2" style={{ borderColor: rank.color, backgroundColor: `${rank.color}20` }}>
          <Icon className="w-8 h-8" style={{ color: rank.color }} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">{rank.name}</h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${rank.color}30`, color: rank.color }}>
              {rank.branch === 'tech' ? 'Техническая' : rank.branch === 'research' ? 'Исследовательская' : rank.branch === 'leadership' ? 'Лидерская' : 'Финальная'}
            </span>
            <span className="text-gray-400 text-sm">Уровень {rank.level}</span>
      </div>
    </div>
  </div>
      <p className="text-gray-300 text-sm mb-4 relative z-10">{rank.description}</p>
      {rank.requirements && (
        <div className="relative z-10">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Требования:</h4>
          <ul className="space-y-1">
            {rank.requirements.map((req, index) => (
              <li key={index} className="flex items-center gap-2 text-xs text-gray-500">
                <ChevronRight className="w-3 h-3" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}
      {isSelected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
      )}
    </motion.div>
  );
};

const RanksDiagram: React.FC = () => {
  const [selectedRank, setSelectedRank] = useState<string>('cadet');
  const [currentBranch, setCurrentBranch] = useState<'all' | 'tech' | 'research' | 'leadership' | 'final'>('all');
  const color = useMotionValue(COLORS_TOP[0]);
  const textControls = useAnimation();

  useEffect(() => {
    animate(color, COLORS_TOP, { ease: 'easeInOut', duration: 10, repeat: Infinity, repeatType: 'mirror' });
    textControls.start({ opacity: 1, y: 0, transition: { duration: 1, ease: [0.2, 0.65, 0.3, 0.9] } });
  }, [color, textControls]);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const filteredRanks = currentBranch === 'all' ? rankSystem : rankSystem.filter(r => r.branch === currentBranch);
  const selectedRankData = rankSystem.find(r => r.id === selectedRank);

  const branchFilters = [
    { id: 'all', name: 'Все ранги', icon: Zap },
    { id: 'tech', name: 'Техническая', icon: Satellite },
    { id: 'research', name: 'Исследовательская', icon: BookOpen },
    { id: 'leadership', name: 'Лидерская', icon: Shield },
    { id: 'final', name: 'Финальная', icon: Crown },
  ];

  return (
    <motion.section style={{ backgroundImage }} className="relative min-h-screen overflow-hidden bg-gray-950 px-4 py-24 text-gray-200">
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
        </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={textControls} className="text-center mb-16">
          <motion.span className="inline-block rounded-full bg-gray-600/50 px-4 py-2 text-sm mb-6" whileHover={{ scale: 1.05 }}>
            🚀 Космическая Система Рангов
          </motion.span>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent mb-6">
            Система Рангов
            <br />
            <span className="text-cyan-400">Алабуга.TECH</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Нелинейная система развития с тремя специализированными ветками и финальным объединяющим рангом
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-4 mb-12">
          {branchFilters.map((filter) => {
            const FilterIcon = filter.icon;
            return (
              <motion.button key={filter.id} onClick={() => setCurrentBranch(filter.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${currentBranch === filter.id ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400' : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <FilterIcon className="w-4 h-4" />
                {filter.name}
              </motion.button>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredRanks.map((rank, index) => (
            <RankCard key={rank.id} rank={rank} isSelected={selectedRank === rank.id} onClick={() => setSelectedRank(rank.id)} delay={index} />
          ))}
        </div>

        {selectedRankData && (
          <motion.div key={selectedRank} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="p-4 rounded-full border-2" style={{ borderColor: selectedRankData.color, backgroundColor: `${selectedRankData.color}20` }}>
                <selectedRankData.icon className="w-12 h-12" style={{ color: selectedRankData.color }} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedRankData.name}</h2>
                <p className="text-gray-300 text-lg">{selectedRankData.description}</p>
        </div>
      </div>
            {selectedRankData.requirements && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Требования для получения:</h3>
                  <ul className="space-y-3">
                    {selectedRankData.requirements.map((req, index) => (
                      <motion.li key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center gap-3 text-gray-300">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedRankData.color }} />
                        {req}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Характеристики:</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Ветка развития:</span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${selectedRankData.color}30`, color: selectedRankData.color }}>
                        {selectedRankData.branch === 'tech' ? 'Аналитико-Техническая' : selectedRankData.branch === 'research' ? 'Гуманитарно-Исследовательская' : selectedRankData.branch === 'leadership' ? 'Коммуникационно-Лидерская' : 'Финальная'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Уровень:</span>
                      <span className="text-white font-bold">{selectedRankData.level}</span>
          </div>
        </div>
      </div>
    </div>
            )}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="text-center mt-16">
          <motion.button className="group relative flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-white font-semibold transition-all duration-300 mx-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Начать Космическое Путешествие
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
    </motion.section>
  );
};

export default RanksDiagram;



