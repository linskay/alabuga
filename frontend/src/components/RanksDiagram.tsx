import React, { useEffect, useState } from 'react';
import { backend, RankDTO } from '../api';
import { motion, useAnimation, useMotionTemplate, useMotionValue, animate } from 'framer-motion';
// Simple white outline SVG icons
const IconWrap = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: '#ffffff' }}>{children}</span>
);
const Satellite = (p: any) => (
  <IconWrap>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M13 7l-1 1 3 3 1-1z"/><path d="M8 12l4 4"/><path d="M2 22l6-6"/><rect x="14" y="2" width="8" height="6" rx="1"/><path d="M12 16l6-6"/>
    </svg>
  </IconWrap>
);
const Radar = (p: any) => (
  <IconWrap>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10"/><path d="M12 12l6-6"/><path d="M12 2a10 10 0 0 1 10 10"/>
    </svg>
  </IconWrap>
);
const Building = (p: any) => (
  <IconWrap>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
    </svg>
  </IconWrap>
);
const BookOpen = (p: any) => (
  <IconWrap>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 4h8a4 4 0 0 1 4 4v12H6a4 4 0 0 1-4-4z"/><path d="M22 4h-8a4 4 0 0 0-4 4v12h8a4 4 0 0 0 4-4z"/>
    </svg>
  </IconWrap>
);
const Users = (p: any) => (
  <IconWrap>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  </IconWrap>
);
const GraduationCap = (p: any) => (
  <IconWrap>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 10L12 2 2 10l10 6 10-6z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  </IconWrap>
);
const Radio = (p: any) => (
  <IconWrap>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2" y="8" width="20" height="14" rx="2"/><path d="M6 12h12"/><path d="M10 16h8"/><path d="M2 8l20-6"/>
    </svg>
  </IconWrap>
);
const Navigation = (p: any) => (
  <IconWrap>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
  </IconWrap>
);
const Shield = (p: any) => (
  <IconWrap>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  </IconWrap>
);
const Crown = (p: any) => (
  <IconWrap>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 18l4-12 6 6 6-6 4 12z"/><path d="M2 18h20"/>
    </svg>
  </IconWrap>
);
const ChevronRight = (p: any) => (
  <IconWrap>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  </IconWrap>
);
const Zap = (p: any) => (
  <IconWrap>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  </IconWrap>
);

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

const STATIC_RANKS: RankData[] = [
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
      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${isSelected ? 'border-cyan-400 bg-gray-900/50' : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'} ${isHovered ? 'scale-105' : ''}`}
      style={{}}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* card inner gradient background */}
      <div className="absolute inset-0 rounded-xl opacity-20 blur-xl"
        style={{ background: `radial-gradient(circle at 30% 20%, ${rank.color}33, transparent 60%), radial-gradient(circle at 70% 80%, ${rank.color}26, transparent 65%)` }}
      />
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
  const [ranks, setRanks] = useState<RankData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const color = useMotionValue(COLORS_TOP[0]);
  const textControls = useAnimation();

  useEffect(() => {
    animate(color, COLORS_TOP, { ease: 'easeInOut', duration: 10, repeat: Infinity, repeatType: 'mirror' });
    textControls.start({ opacity: 1, y: 0, transition: { duration: 1, ease: [0.2, 0.65, 0.3, 0.9] } });
  }, [color, textControls]);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const filteredRanks = (ranks ?? STATIC_RANKS).filter(r => currentBranch === 'all' ? true : r.branch === currentBranch);
  const selectedRankData = (ranks ?? STATIC_RANKS).find(r => r.id === selectedRank);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await backend.ranks.list();
        if (!mounted) return;
        const mapped: RankData[] = data.map((d: RankDTO) => ({
          id: String(d.id),
          name: d.name,
          description: d.description || '',
          icon: Zap,
          branch: (d.branch as any) || 'tech',
          level: d.level ?? 0,
          color: '#0ea5e9',
          glowColor: '#0ea5e9',
        }));
        setRanks(mapped);
      } catch (e: any) {
        setError(e?.message || 'Не удалось загрузить ранги');
      }
    })();
    return () => { mounted = false; };
  }, []);

  const branchFilters = [
    { id: 'all', name: 'Все ранги', icon: Zap },
    { id: 'tech', name: 'Техническая', icon: Satellite },
    { id: 'research', name: 'Исследовательская', icon: BookOpen },
    { id: 'leadership', name: 'Лидерская', icon: Shield },
    { id: 'final', name: 'Финальная', icon: Crown },
  ];

  return (
    <motion.section className="relative min-h-screen overflow-hidden px-4 py-12 text-gray-200 bg-transparent">
      <div className="relative z-10 max-w-7xl mx-auto">

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

        {error && (
          <div className="mb-4 text-sm text-red-300">{error} — показаны демонстрационные данные</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 bg-transparent">
          {filteredRanks.map((rank, index) => (
            <RankCard key={rank.id || `rank-${index}`} rank={rank} isSelected={selectedRank === rank.id} onClick={() => setSelectedRank(rank.id)} delay={index} />
          ))}
        </div>
              
        {selectedRankData && (
          <motion.div key={selectedRank} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-xl border border-gray-700 p-8">
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

        {/* CTA removed per request */}
      </div>
      {/* Overlay removed per request */}
    </motion.section>
  );
};

export default RanksDiagram;



