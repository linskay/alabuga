import React from 'react';

type RankNode = {
  id: string;
  title: string;
  color: string;
  subtitle?: string;
};

const ranksTech: RankNode[] = [
  { id: 'tech1', title: 'Навигатор\nТраекторий', color: '#06B6D4' },
  { id: 'tech2', title: 'Аналитик\nОрбит', color: '#06B6D4' },
  { id: 'tech3', title: 'Архитектор\nСтанции', color: '#06B6D4' },
];
const ranksHum: RankNode[] = [
  { id: 'hum1', title: 'Хронист\nГалактики', color: '#F59E0B' },
  { id: 'hum2', title: 'Исследователь\nКультур', color: '#F59E0B' },
  { id: 'hum3', title: 'Мастер\nЛектория', color: '#F59E0B' },
];
const ranksLead: RankNode[] = [
  { id: 'lead1', title: 'Связист\nЗвёздного Флота', color: '#22C55E' },
  { id: 'lead2', title: 'Штурман\nЭкипажа', color: '#22C55E' },
  { id: 'lead3', title: 'Командир\nОтряда', color: '#22C55E' },
];

const startRank: RankNode = { id: 'start', title: 'Космо-\nКадет', color: '#60A5FA' };
const finalRank: RankNode = { id: 'final', title: 'Хранитель\nСтанции\n«Алабуга.TECH»', color: '#A78BFA' };

const NeonBox: React.FC<{rank: RankNode}> = ({ rank }) => (
  <div className="relative rounded-xl p-[2px]">
    <div className="absolute inset-0 rounded-xl" style={{
      background: `conic-gradient(from 0deg, ${rank.color}, transparent 30%, ${rank.color})`,
      filter: 'blur(10px)', opacity: 0.55
    }} />
    <div className="relative rounded-xl px-4 py-3 text-center text-white/90"
      style={{
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), rgba(2,6,23,0.8))',
        boxShadow: `0 0 24px ${rank.color}33, inset 0 0 24px ${rank.color}22`,
        border: `1px solid ${rank.color}66`,
        minWidth: 160
      }}
    >
      <div className="whitespace-pre leading-tight font-semibold tracking-wide">
        {rank.title}
      </div>
    </div>
  </div>
);

const RanksDiagram: React.FC = () => {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left: Branch paths */}
      <div className="relative p-4 rounded-2xl" style={{
        background: 'linear-gradient(180deg, rgba(2,6,23,0.7), rgba(2,6,23,0.4))',
        border: '1px solid rgba(148,163,184,0.2)'
      }}>
        <div className="flex items-center justify-center mb-6">
          <NeonBox rank={startRank} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[ranksTech, ranksHum, ranksLead].map((list, idx) => (
            <div key={idx} className="flex flex-col items-center gap-4 relative">
              {list.map((r) => <NeonBox key={r.id} rank={r} />)}
              <div className="absolute top-1/2 -left-6 right-0 h-[2px]" style={{
                background: `linear-gradient(90deg, transparent, ${list[0].color}, transparent)`,
                filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.25))'
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Right: Final rank funnel */}
      <div className="relative p-4 rounded-2xl overflow-hidden" style={{
        background: 'linear-gradient(180deg, rgba(2,6,23,0.7), rgba(2,6,23,0.4))',
        border: '1px solid rgba(148,163,184,0.2)'
      }}>
        <div className="absolute inset-0 opacity-40" style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(6,182,212,0.15), transparent 40%), radial-gradient(circle at 70% 70%, rgba(167,139,250,0.15), transparent 40%)'
        }} />
        <div className="relative flex flex-col items-center gap-6">
          <div className="text-sm text-white/70">Слияние веток и условия повышения</div>
          <div className="grid grid-cols-3 gap-4 w-full">
            {[ranksTech[2], ranksHum[2], ranksLead[2]].map((r) => (
              <NeonBox key={`p-${r.id}`} rank={r} />
            ))}
          </div>
          <div className="w-full h-[2px]" style={{
            background: 'linear-gradient(90deg, #06B6D4, #F59E0B, #22C55E)',
            boxShadow: '0 0 16px rgba(255,255,255,0.25)'
          }} />
          <NeonBox rank={finalRank} />
          <div className="text-xs text-white/60 text-center max-w-md leading-relaxed">
            Опыт, миссии, компетенции. Требования настраиваются, есть дефолты и ручная настройка.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RanksDiagram;


