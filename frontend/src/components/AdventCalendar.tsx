import React, { memo, useEffect, useMemo, useState } from 'react';

export type AdventDay = {
  id: number;
  title?: string;
  phrase?: string; // 📜 Мотивационная фраза
  reward?: string; // 🎁 Награда
  tip?: string;    // 🛰 Совет
  task?: string;   // 🔧 Задание
  opened?: boolean;
};

export type AdventCalendarData = {
  theme?: 'motivation' | 'rewards' | 'tips' | 'custom';
  days: AdventDay[];
  centerTitle?: string;
};

type AdventCalendarProps = {
  data: AdventCalendarData;
  onOpenDay?: (dayId: number) => void;
  interactive?: boolean;
};

const Planet: React.FC<{ x: number; y: number; size: number; color: string; glow: string; dimmed?: boolean; label?: string; onClick?: () => void }>
  = ({ x, y, size, color, glow, dimmed, label, onClick }) => {
  return (
    <div
      className="absolute rounded-full cursor-pointer flex items-center justify-center select-none"
      onClick={onClick}
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}66, #0b0b0b 70%)`,
        boxShadow: dimmed ? `0 0 8px ${glow}55, inset 0 0 8px ${glow}22` : `0 0 16px ${glow}, 0 0 48px ${glow}aa, inset 0 0 12px ${glow}88`,
        border: `2px solid ${glow}`
      }}
    >
      {label && <span className="text-white text-xs font-semibold" style={{ textShadow: '0 0 4px rgba(255,255,255,0.6)' }}>{label}</span>}
    </div>
  );
};

const Orbit: React.FC<{ r: number; color: string; dashed?: boolean }>= memo(({ r, color, dashed }) => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
       style={{ width: r*2, height: r*2, border: dashed? `2px dashed ${color}`:`2px solid ${color}`, boxShadow: `0 0 18px ${color}55` }} />
));

const AdventCalendar: React.FC<AdventCalendarProps> = ({ data, onOpenDay, interactive=true }) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    let id: number; const loop = () => { setT(prev=>prev+0.01); id=requestAnimationFrame(loop); }; loop(); return ()=>cancelAnimationFrame(id);
  }, []);

  const orbits = useMemo(() => {
    const n = Math.max(1, Math.ceil(data.days.length / 8));
    return Array.from({ length: n }).map((_, i) => 110 + i * 60);
  }, [data.days.length]);

  const palette = ['#22d3ee', '#a78bfa', '#60a5fa', '#06b6d4'];

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      <style>
        {`@keyframes glow { 0%,100%{opacity:.8} 50%{opacity:1} }`}
      </style>

      {orbits.map((r, idx) => (
        <Orbit key={r} r={r} color={palette[idx % palette.length]} dashed={idx % 2 === 1} />
      ))}

      {/* Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="w-28 h-28 rounded-full overflow-hidden shadow-2xl relative"
             style={{ boxShadow: '0 0 24px rgba(99,102,241,0.6), 0 0 64px rgba(34,211,238,0.35)' }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg" alt="center" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-400/20 animate-pulse" />
        </div>
        {data.centerTitle && <div className="mt-2 text-white/90 text-sm" style={{ textShadow: '0 0 6px rgba(255,255,255,0.6)' }}>{data.centerTitle}</div>}
      </div>

      {/* Planets */}
      {data.days.map((day, i) => {
        const ringIdx = Math.floor(i / 8);
        const r = orbits[Math.min(ringIdx, orbits.length-1)] || 110;
        const within = i % 8; const base = (2*Math.PI/8)*within;
        const speed = (ringIdx % 2 === 0 ? 0.12 : -0.09);
        const angle = t*speed + base;
        const x = Math.cos(angle) * r; const y = Math.sin(angle) * r;
        const opened = !!day.opened;
        const color = opened ? '#a78bfa' : '#334155';
        const glow = opened ? '#8b5cf6' : '#334155';
        return (
          <Planet key={day.id} x={x} y={y} size={48} color={color} glow={glow} dimmed={!opened} label={`${day.id}`} onClick={() => interactive && onOpenDay?.(day.id)} />
        );
      })}
    </div>
  );
};

export default AdventCalendar;


