import React, { memo, useEffect, useMemo, useState } from 'react';

type PlanetConfig = {
  id: string;
  orbitRadius: number;
  size: number;
  speed: number; // radians per frame tick
  phaseShift: number; // radians
  iconKey: keyof typeof planetIcons;
  label: string;
  color: string;
};

// Nicer inline SVG icons (white, with subtle strokes)
const planetIcons = {
  mission: (
    <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none" stroke="#fff" strokeWidth="2">
      <circle cx="32" cy="32" r="10" fill="#ffffff" opacity="0.2" />
      <path d="M8 32c10-8 38-8 48 0" strokeLinecap="round"/>
      <path d="M8 32c10 8 38 8 48 0" strokeLinecap="round" opacity="0.6"/>
      <circle cx="32" cy="32" r="6" fill="#fff" />
    </svg>
  ),
  impulse: (
    <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none" stroke="#fff" strokeWidth="2">
      <path d="M6 32h16l6-16 8 32 6-16h16" strokeLinecap="round"/>
      <path d="M6 24h8M6 40h8" opacity="0.6"/>
    </svg>
  ),
  channel: (
    <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none" stroke="#fff" strokeWidth="2">
      <circle cx="20" cy="32" r="4" fill="#fff"/>
      <path d="M24 32h12"/>
      <circle cx="46" cy="24" r="3"/>
      <circle cx="46" cy="40" r="3"/>
      <path d="M36 28l8-4M36 36l8 4"/>
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none" stroke="#fff" strokeWidth="2">
      <rect x="10" y="14" width="44" height="36" rx="4" opacity="0.6"/>
      <path d="M16 42l8-10 8 6 10-14 6 8"/>
    </svg>
  ),
  command: (
    <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none" stroke="#fff" strokeWidth="2">
      <path d="M32 8l10 32H22L32 8z"/>
      <circle cx="32" cy="48" r="4" fill="#fff"/>
    </svg>
  ),
  law: (
    <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none" stroke="#fff" strokeWidth="2">
      <path d="M32 14v28"/>
      <path d="M12 24h40"/>
      <path d="M16 24l8 12a8 8 0 1 1-16 0l8-12zM48 24l8 12a8 8 0 1 1-16 0l8-12z"/>
    </svg>
  ),
  hologram: (
    <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none" stroke="#fff" strokeWidth="2">
      <rect x="16" y="12" width="32" height="20" rx="3"/>
      <path d="M16 40l16 12 16-12"/>
      <path d="M20 18h8M36 18h8" opacity="0.6"/>
    </svg>
  ),
  finance: (
    <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none" stroke="#fff" strokeWidth="2">
      <circle cx="32" cy="32" r="12"/>
      <path d="M28 24h6a4 4 0 1 1 0 8h-4a4 4 0 1 0 0 8h8" strokeLinecap="round"/>
    </svg>
  ),
  navigation: (
    <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none" stroke="#fff" strokeWidth="2">
      <path d="M10 54l44-22-22 44-4-18-18-4z"/>
      <circle cx="32" cy="32" r="3" fill="#fff"/>
    </svg>
  )
} as const;

const Earth: React.FC = () => (
  <div className="w-32 h-32 rounded-full relative shadow-2xl overflow-hidden">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg"
      alt="Earth"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-pulse" />
  </div>
);

const OrbitPath: React.FC<{ radius: number; color: string; dashed?: boolean }> = memo(({ radius, color, dashed }) => (
  <div
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
    style={{
      width: `${radius * 2}px`,
      height: `${radius * 2}px`,
      border: dashed ? `2px dashed ${color}` : `2px solid ${color}`,
      boxShadow: `0 0 20px ${color}, 0 0 40px ${color}50`,
      borderRadius: '50%'
    }}
  />
));

const OrbitLabel: React.FC<{ radius: number; text: string; angularSpeed: number }> = memo(({ radius, text, angularSpeed }) => {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    let id: number;
    const animate = () => {
      setAngle(prev => prev + angularSpeed);
      id = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(id);
  }, [angularSpeed]);

  return (
    <div
      className="absolute top-1/2 left-1/2 text-xs md:text-sm text-white select-none"
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        transform: `rotate(${angle}rad) translateY(-${radius}px) rotate(${-angle}rad)`,
        transformOrigin: 'center center',
        textAlign: 'center'
      }}
    >
      {text}
    </div>
  );
});

// Semi-circular branch badge follows exact x/y along orbit
const OrbitArcBadge: React.FC<{ radius: number; label: string; color: string; angle: number; offsetPercent?: number }> = memo(({ radius, label, color, angle, offsetPercent = 0.06 }) => {
  const offset = Math.max(6, radius * offsetPercent);
  const r = radius + offset;
  const x = Math.cos(angle) * r;
  const y = Math.sin(angle) * r;
  return (
    <div
      className="absolute top-1/2 left-1/2 select-none pointer-events-none"
      style={{ transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))` }}
    >
      <div
        className="px-4 py-1.5 md:py-2 text-[11px] md:text-xs font-medium text-white rounded-full"
        style={{
          background: `linear-gradient(135deg, ${color}aa, #0b0b0bcc)`,
          whiteSpace: 'nowrap',
          boxShadow: `0 0 10px ${color}66`
        }}
      >
        <span style={{ textShadow: '0 0 6px rgba(255,255,255,0.6)' }}>{label}</span>
      </div>
    </div>
  );
});

const OrbitingPlanet: React.FC<{ config: PlanetConfig; angle: number; onSelect: (id: string) => void }> = memo(({ config, angle, onSelect }) => {
  const { orbitRadius, size, label, iconKey, color } = config;
  const [isHovered, setIsHovered] = useState(false);
  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  return (
    <div
      className="absolute top-1/2 left-1/2 transition-all duration-500 ease-out z-10"
      style={{ transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`, width: `${size}px`, height: `${size}px`, zIndex: isHovered ? 20 : 10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative w-full h-full flex items-center justify-center rounded-full cursor-pointer transition-transform duration-300"
        style={{
          animation: 'glow 2s infinite alternate',
          background: `radial-gradient(circle at 30% 30%, ${color}55, #111 70%)`,
          boxShadow: isHovered ? `0 0 24px ${color}, 0 0 48px ${color}` : `0 0 8px ${color}, 0 0 16px ${color}88`,
          border: `2px solid ${color}`
        }}
        onClick={() => onSelect(config.id)}
      >
        {planetIcons[iconKey]}
        {isHovered && (
          <div className="absolute top-full mt-1 px-2 py-1 bg-gray-900/95 text-white text-xs rounded whitespace-nowrap">
            {label}
          </div>
        )}
      </div>
    </div>
  );
});

const CosmicOrbits: React.FC = () => {
  const [time, setTime] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setTime(prev => prev + 0.01);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const planetsConfig: PlanetConfig[] = useMemo(() => ([
    { id: 'mission', orbitRadius: 100, size: 52, speed: 0.2, phaseShift: 0, iconKey: 'mission', label: 'Сила Миссии', color: '#22d3ee' },
    { id: 'impulse', orbitRadius: 100, size: 52, speed: 0.2, phaseShift: (2 * Math.PI) / 3, iconKey: 'impulse', label: 'Импульс Прорыва', color: '#a78bfa' },
    { id: 'channel', orbitRadius: 100, size: 52, speed: 0.2, phaseShift: (4 * Math.PI) / 3, iconKey: 'channel', label: 'Канал Связи', color: '#60a5fa' },

    { id: 'analytics', orbitRadius: 150, size: 54, speed: -0.15, phaseShift: 0, iconKey: 'analytics', label: 'Модуль Аналитики', color: '#34d399' },
    { id: 'command', orbitRadius: 150, size: 54, speed: -0.15, phaseShift: (2 * Math.PI) / 3, iconKey: 'command', label: 'Пульт Командования', color: '#f59e0b' },
    { id: 'law', orbitRadius: 150, size: 54, speed: -0.15, phaseShift: (4 * Math.PI) / 3, iconKey: 'law', label: 'Кодекс Звёздного Права', color: '#f472b6' },

    { id: 'hologram', orbitRadius: 200, size: 56, speed: 0.1, phaseShift: 0, iconKey: 'hologram', label: 'Голограммное Мышление', color: '#06b6d4' },
    { id: 'finance', orbitRadius: 200, size: 56, speed: 0.1, phaseShift: (2 * Math.PI) / 3, iconKey: 'finance', label: 'Кредитный Поток', color: '#22c55e' },
    { id: 'navigation', orbitRadius: 200, size: 56, speed: 0.1, phaseShift: (4 * Math.PI) / 3, iconKey: 'navigation', label: 'Курс Аэронавигации', color: '#f97316' }
  ]), []);

  const infoById = useMemo(() => ({
    mission: {
      title: 'Сила Миссии (Вера в дело)',
      story: 'Первые колонисты Марса 2081 года провели 72 часа в полной изоляции после сбоя систем связи. Их спасла не техника, а непоколебимая вера в общее дело — каждый продолжал выполнять свой участок работы, зная: другие делают то же самое. Именно эта синхронность действий спасла миссию.',
      fact: 'Экипаж МКС разработал ритуал — перед сложными операциями они одновременно касаются стенки модуля «Заря». Это физическое напоминание: они часть одного целого.'
    },
    impulse: {
      title: 'Импульс Прорыва (Стремление к большему)',
      story: 'В 2063 году инженер-стажёр Элайза Ким предложили переработать систему жизнеобеспечения, сократив энергопотребление на 23%. Коллеги называли это безумием. Она работала над проектом 11 месяцев, и сегодня её модификации стоят на каждом корабле дальнего следования.',
      fact: 'Космический зонд «Вояджер-1» продолжал передавать данные далеко за пределами расчётного срока службы. Его последнее сообщение: «Я всё ещё здесь». '
    },
    channel: {
      title: 'Канал Связи (Общение)',
      story: 'Во время стыковки «Союза» с модулем «Рассвет» в 2034 году отказала автоматика. Оператор ЦУПа Алина Петрова 47 минут голосом вела космонавта через ручное сближение. Её спокойный и чёткий инструктаж вошёл в учебники по космической связи.',
      fact: 'Стандартная фраза «Приём», завершающая сеанс связи, была введена после инцидента 2019 года, когда астронавт не понял, что канал уже отключён, и 3 минуты говорил в пустоту.'
    },
    analytics: {
      title: 'Модуль Аналитики (Аналитика)',
      story: 'Аналитик миссии «Кеплер» Марк Тэннен обнаружил аномалию в данных — микроскопическое падение яркости звезды раз в 387 дней. Так был открыт Кеплер-186f — первая планета земного типа в зоне обитаемости. Потребовалось 14 месяцев проверки 2,3 петабайт информации.',
      fact: 'Система предупреждения о космическом мусоре на МКС анализирует траектории 25,000 объектов одновременно и выдаёт расчёт времени до столкновения с точностью до 0,01 секунды.'
    },
    command: {
      title: 'Пульт Командования (Командование)',
      story: 'Капитан Шарлотта Рейнольдс во время вспышки на Солнце в 2072 году приняла решение развернуть корабль спиной к звезде, пожертвовав панелями солнечных батарей, но сохранив жизнь экипажа из 12 человек. Её хладнокровие изучают в академии Звёздного Флота.',
      fact: 'В ЦУПе Хьюстона есть «золотое кресло» — место главного оператора. Его конструкция не менялась с 1960-х годов, так как считается эргономически идеальной для принятия решений в критических ситуациях.'
    },
    law: {
      title: 'Кодекс Звёздного Права (Юриспруденция)',
      story: 'Первый космический договор 2028 года был написан на листе бумаги во время лунной миссии. Командир кораблей «Арес» и «Селена» расписались шариковой ручкой, которая сейчас хранится в музее космонавтики как символ честного слова.',
      fact: 'До 2050 года космические споры решались по морскому праву, пока не был принят Единый космический кодекс, состоящий всего из 17 статей.'
    },
    hologram: {
      title: 'Голограммное Мышление (Трёхмерное мышление)',
      story: 'Инженер Такеши Ямамото смог мысленно воссоздать схему повреждённого реактора и найти обходной путь для энергоснабжения станции «Гармония». Он 6 часов работал с голографическими схемами, не делая ни одной пометки на бумаге.',
      fact: 'Космонавты проходят тест на пространственное мышление с помощью специальных очков, которые проецируют 3D-схемы прямо на сетчатку глаза.'
    },
    finance: {
      title: 'Кредитный Поток (Базовая экономика)',
      story: 'Первая межорбитальная сделка состоялась в 2044 году — 3 тонны воды с Луны обменяли на 2 кристалла для квантовых компьютеров с Земли. Курс обмена рассчитывали 4 дня, используя 11 различных экономических моделей.',
      fact: 'На МКС до сих пор используется бартерная система — научные данные обмениваются на продовольствие и оборудование между странами-участницами.'
    },
    navigation: {
      title: 'Курс Аэронавигации (Основы аэронавигации)',
      story: 'Штурман Алиса Воронцова в 2065 году провела корабль через пояс астероидов, используя только оптические датчики после полного отказа компьютеров. Её ручные расчёты траектории оказались точнее машинных.',
      fact: 'Навигационные компьютеры космических кораблей до сих проходят тестирование на точность с помощью секстанта — прибора, изобретённого в XVIII веке.'
    }
  } as const), []);

  return (
    <div className="w-full h-[75vh] md:h-[85vh] flex items-center justify-center relative overflow-auto px-4 pt-10 pb-16">
      <style>
        {`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 8px #fff, 0 0 20px #0ff50f; }
          50% { box-shadow: 0 0 16px #fff, 0 0 40px #0ff50f; }
        }
        @keyframes comet {
          0% { transform: translate(-20%, -20%) rotate(15deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate(120%, 120%) rotate(15deg); opacity: 0; }
        }
        `}
      </style>

      {/* Comets removed per request */}

      <OrbitPath radius={100} color="#22d3ee" />
      <OrbitPath radius={150} color="#3b82f6" dashed />
      <OrbitPath radius={200} color="#06b6d4" />

      {/* Branch badges fixed at readable angles; placed outside the line. */}
      <OrbitArcBadge radius={100} label="Кольцо Посланцев" color="#22d3ee" angle={-Math.PI / 2 - 0.25} offsetPercent={0.08} />
      <OrbitArcBadge radius={150} label="Академия Звёздного Флота" color="#3b82f6" angle={-Math.PI / 2} offsetPercent={0.08} />
      <OrbitArcBadge radius={200} label="Пояс Испытаний" color="#06b6d4" angle={-Math.PI / 2 + 0.25} offsetPercent={0.08} />

      <Earth />
      {/* Center branch badge for Earth (Dock) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+28px)] select-none pointer-events-none">
        <div className="px-4 py-1.5 text-[11px] md:text-xs font-medium text-white rounded-full" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,.66), rgba(0,0,0,.7))', boxShadow: '0 0 10px rgba(99,102,241,.4)' }}>
          Док Лунной Базы
        </div>
      </div>

      {planetsConfig.map(config => {
        const angle = time * config.speed + config.phaseShift;
        return (
          <OrbitingPlanet
            key={config.id}
            config={config}
            angle={angle}
            onSelect={(id) => setSelectedId(id)}
          />
        );
      })}

      {selectedId && (
        <BottomInfoCard
          color={planetsConfig.find(p => p.id === selectedId)!.color}
          title={infoById[selectedId as keyof typeof infoById].title}
          story={infoById[selectedId as keyof typeof infoById].story}
          fact={infoById[selectedId as keyof typeof infoById].fact}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};

// Starfield background
const StarField: React.FC<{ count?: number }> = ({ count = 100 }) => {
  const stars = useMemo(() => (
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 1.8 + 0.6,
      opacity: Math.random() * 0.7 + 0.3,
      twinkle: Math.random() > 0.5
    }))
  ), [count]);

  return (
    <div className="absolute inset-0 -z-10">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: '#fff',
            opacity: s.opacity,
            boxShadow: '0 0 6px #fff',
            animation: s.twinkle ? 'pulse 2.6s ease-in-out infinite' : undefined
          }}
        />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} }`}</style>
    </div>
  );
};

// Bottom-centered info card
const BottomInfoCard: React.FC<{ color: string; title: string; story: string; fact: string; onClose: () => void }>
  = ({ color, title, story, fact, onClose }) => {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
      <div className="relative w-[92vw] md:w-[680px] bg-gray-900/85 backdrop-blur text-white rounded-xl p-4 shadow-2xl ring-1 ring-white/10">
        <div className="pointer-events-auto">
          <div className="text-sm md:text-base font-semibold mb-1" style={{ textShadow: '0 0 8px rgba(255,255,255,0.4)' }}>{title}</div>
          <div className="text-gray-200 text-xs md:text-sm mb-2"><span className="opacity-70">ИСТОРИЯ:</span> {story}</div>
          <div className="text-gray-300 text-xs md:text-sm"><span className="opacity-70">ФАКТ:</span> {fact}</div>
        </div>
        <button aria-label="close" className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 text-white" onClick={onClose}>✕</button>
        <div className="pointer-events-none absolute inset-0 rounded-xl" style={{
          padding: 2,
          background: `conic-gradient(from 0deg, ${color}, transparent 60%)`,
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor' as unknown as undefined,
          maskComposite: 'exclude'
        }} />
      </div>
    </div>
  );
};

export default CosmicOrbits;


