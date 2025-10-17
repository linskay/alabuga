import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { motion } from 'framer-motion';
import ShinyText from './ShinyText';
import styled, { keyframes } from 'styled-components';

type BranchKey = 'tech' | 'humanities' | 'leadership';

type Competency = {
  id: string;
  name: string;
  branch: BranchKey;
  radius: number;
  size: number;
  speed: number;
  phase: number;
};

const branchMeta: Record<BranchKey, { label: string; color: string; short: string }>= {
  tech: { label: 'Аналитико-Техническая', color: '#06B6D4', short: 'Тех' },
  humanities: { label: 'Гуманитарно-Исследовательская', color: '#F59E0B', short: 'Гум' },
  leadership: { label: 'Коммуникационно-Лидерская', color: '#22C55E', short: 'Лид' },
};

const defaultCompetencies: Competency[] = [
  { id: 'mission-power', name: 'Сила Миссии', branch: 'leadership', radius: 280, size: 48, speed: 0.28, phase: 0.0 },
  { id: 'breakthrough-impulse', name: 'Импульс Прорыва', branch: 'leadership', radius: 280, size: 46, speed: 0.28, phase: 2.09 },
  { id: 'communications', name: 'Канал Связи', branch: 'humanities', radius: 280, size: 46, speed: 0.28, phase: 4.18 },

  { id: 'analytics', name: 'Модуль Аналитики', branch: 'tech', radius: 200, size: 46, speed: 0.5, phase: 0.7 },
  { id: 'command', name: 'Пульт Командования', branch: 'leadership', radius: 200, size: 44, speed: -0.45, phase: 2.9 },
  { id: 'law', name: 'Кодекс Звёздного Права', branch: 'humanities', radius: 200, size: 44, speed: 0.45, phase: 5.1 },

  { id: 'holo-thinking', name: 'Голограммное Мышление', branch: 'tech', radius: 120, size: 42, speed: -0.7, phase: 0.0 },
  { id: 'economics', name: 'Кредитный Поток', branch: 'tech', radius: 120, size: 40, speed: 0.7, phase: 2.09 },
  { id: 'aeronav', name: 'Курс Аэронавигации', branch: 'tech', radius: 120, size: 42, speed: -0.7, phase: 4.18 },
];

const OrbitRing: React.FC<{ radius: number; color: string; label: string }>= ({ radius, color, label }) => {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{ width: radius * 2, height: radius * 2, zIndex: 1 }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${color}60`,
          boxShadow: `0 0 24px ${color}40, inset 0 0 24px ${color}20`,
        }}
      />
      {/* animated highlight arc */}
      <AnimatedArc $color={color} className="absolute inset-0 rounded-full pointer-events-none" />
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-wide" style={{ color }}>
        {label}
      </div>
    </div>
  );
};

// arrows removed per design

const CompetencyMap: React.FC<{ competencies?: Competency[]; userAngle?: number }>= ({ competencies = defaultCompetencies, userAngle = Math.PI/6 }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setTime(t => t + dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Compute dynamic geometry based on content
  const maxOrbitRadius = useMemo(() => {
    const radii = [120, 200, 280, ...competencies.map(c => c.radius)];
    return radii.reduce((m, r) => Math.max(m, r), 0);
  }, [competencies]);
  const padding = 40;
  const baseSize = useMemo(() => (maxOrbitRadius + padding) * 2, [maxOrbitRadius]);
  const center = useMemo(() => ({ x: maxOrbitRadius + padding, y: maxOrbitRadius + padding }), [maxOrbitRadius]);

  // reserved for future grouping/metrics

  const userPos = (radius: number) => ({
    x: center.x + Math.cos(userAngle) * radius,
    y: center.y + Math.sin(userAngle) * radius,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const sunSize = 300;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth || el.getBoundingClientRect().width || baseSize;
      const next = Math.max(0.5, Math.min(1, w / baseSize));
      setScale(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseSize]);

  return (
    <div ref={containerRef} className="relative w-full overflow-visible" style={{ height: baseSize * scale }}>
      <div className="absolute left-1/2 top-1/2" style={{ width: baseSize, height: baseSize, transform: `translate(-50%, -50%) scale(${scale})`, transformOrigin: 'center' }}>
      {/* backdrop disabled to avoid oval under the sun */}

      {/* Center sun (styled) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: sunSize, height: sunSize, zIndex: 10 }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', transformOrigin: 'center', width: '100%', height: '100%', zIndex: 2 }}>
          <SunWrapper>
            <div className="section-banner-sun" style={{ width: '100%', height: '100%' }}>
              <div id="star-1">
                <div className="curved-corner-star">
                  <div id="curved-corner-bottomright" />
                  <div id="curved-corner-bottomleft" />
                </div>
                <div className="curved-corner-star">
                  <div id="curved-corner-topright" />
                  <div id="curved-corner-topleft" />
                </div>
              </div>
              <div id="star-2">
                <div className="curved-corner-star">
                  <div id="curved-corner-bottomright" />
                  <div id="curved-corner-bottomleft" />
                </div>
                <div className="curved-corner-star">
                  <div id="curved-corner-topright" />
                  <div id="curved-corner-topleft" />
                </div>
              </div>
              <div id="star-3">
                <div className="curved-corner-star">
                  <div id="curved-corner-bottomright" />
                  <div id="curved-corner-bottomleft" />
                </div>
                <div className="curved-corner-star">
                  <div id="curved-corner-topright" />
                  <div id="curved-corner-topleft" />
                </div>
              </div>
              <div id="star-4">
                <div className="curved-corner-star">
                  <div id="curved-corner-bottomright" />
                  <div id="curved-corner-bottomleft" />
                </div>
                <div className="curved-corner-star">
                  <div id="curved-corner-topright" />
                  <div id="curved-corner-topleft" />
                </div>
              </div>
              <div id="star-5">
                <div className="curved-corner-star">
                  <div id="curved-corner-bottomright" />
                  <div id="curved-corner-bottomleft" />
                </div>
                <div className="curved-corner-star">
                  <div id="curved-corner-topright" />
                  <div id="curved-corner-topleft" />
                </div>
              </div>
              <div id="star-6">
                <div className="curved-corner-star">
                  <div id="curved-corner-bottomright" />
                  <div id="curved-corner-bottomleft" />
                </div>
                <div className="curved-corner-star">
                  <div id="curved-corner-topright" />
                  <div id="curved-corner-topleft" />
                </div>
              </div>
              <div id="star-7">
                <div className="curved-corner-star">
                  <div id="curved-corner-bottomright" />
                  <div id="curved-corner-bottomleft" />
                </div>
                <div className="curved-corner-star">
                  <div id="curved-corner-topright" />
                  <div id="curved-corner-topleft" />
                </div>
              </div>
            </div>
          </SunWrapper>
        </div>
      </div>

      {/* Rings per branch (drawn behind via z-index) */}
      <OrbitRing radius={120} color={branchMeta.tech.color} label={branchMeta.tech.label} />
      <OrbitRing radius={200} color={branchMeta.humanities.color} label={branchMeta.humanities.label} />
      <OrbitRing radius={280} color={branchMeta.leadership.color} label={branchMeta.leadership.label} />

      {/* Light beam separator between competencies and ranks */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: -24, width: baseSize * 0.6, height: 10, zIndex: 0 }}>
        <Beam />
      </div>

      {/* User markers per ring */}
      {[120,200,280].map((r, i) => {
        const p = userPos(r);
        return (
          <div key={r} className="absolute w-3 h-3 rounded-full" style={{
            left: p.x - 6, top: p.y - 6, background: '#fff', boxShadow: `0 0 14px ${i===0?branchMeta.tech.color:i===1?branchMeta.humanities.color:branchMeta.leadership.color}`
          }} />
        );
      })}

      {/* Competencies */}
      {competencies.map(c => {
        const angle = c.phase + time * c.speed;
        const x = center.x + Math.cos(angle) * c.radius;
        const y = center.y + Math.sin(angle) * c.radius;
        const color = branchMeta[c.branch].color;
        return (
          <div key={c.id} className="absolute"
            style={{ left: x - c.size/2, top: y - c.size/2, width: c.size, height: c.size }}
          >
            {/* progress/rank ring */}
            <div className="relative w-full h-full rounded-full flex items-center justify-center text-[10px] font-semibold px-2 text-center"
              style={{
                background: 'rgba(10,15,25,0.55)',
                border: `1px solid ${color}88`,
                color: '#ffffff',
                boxShadow: `0 0 10px ${color}66`
              }}
              title={c.name}
            >
              <div className="leading-tight">
                <div>{c.name}</div>
                <div className="mt-1 text-[9px] opacity-80">
                  <ShinyText
                    text={c.branch === 'leadership' ? 'коммуникативная' : c.branch === 'humanities' ? 'гуманитарная' : 'аналитическая'}
                    speed={6}
                  />
                </div>
              </div>
            </div>
            {/* arrows removed */}
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default CompetencyMap;

// Styled sun center
const SunWrapper = styled.div`
  .section-banner-sun {
    height: 100%;
    width: 100%;
    position: relative;
    transition: left 0.3s linear;
    background: url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAFAAUADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0T5f71GV/vfrWz/YVv3mk/IUDRrQnaJ2J9MjNfH/U666L70e79apdzJVVPWQCpo7UynCOGP1xVl9MhR8LOPoRzRFYAyHbIAB3PBqVSknZoHWi1dMb/Zc2MlkH1NJ/ZzDrKP8AgKk0PCJJNiM7MO4bdSPp90vKKxH0x/Wnydo3JU31lYja3jQ4ac5/3f8A69RMIx0kJ/Sh1dSQ4O73qq8gVsGsJzUehvCLfUsKN3Q/rUghJ/jX/vqq0ckeRnOPatqDT47iESRTvg+oq6MHV0jqyKs/Z7lH7FNt3bhj1qBo5FP3x+dbK6S4zunYj0Wqsmn3G47Izj1bFa1MLUitYszhXi3ujOxKO/6UZk9vyratJ4wPInBDjj1FJqFonkl4ozuHcVP1f3OaMv8AMaxHvcskYuZPRaa0si/wr+dK+9RmmKXZgAuSfQVySbvZNnUl1EFxJ3j/ACNPFwT/AAtUwtLs8iCTH+7TmgZFzIQr/wBw9atQqdyXKBALj2enCcnuwq/Alg6AycMOoOasRppgPJix7jP863hQnL7SMZVYr7LMxJCzDLnH1rUjhtggLSNuPZmIqdbjTIfutFn/AGV/wFMbVbBGyNxPriumNGENZVInPOc5/DFkyWaEZCLj13E0j28UYy7Ko/CqcmsbiTE4HopFULi7edsyOPwqalahFe4rsUKFST97Q1sWx6ЗаXa74WaMnqA2QKp3tg9r93LrjJIXp9a2rQr8vNsvIwpOjzWe/mUkkLKWMm1MeuM0xrk4AjYjPqSKSQZUq3yn6VXMX71ULkbuQSK4HOS0R3RjF7lkT9d7AEe9RZ...") center/cover no-repeat;
    border-radius: 50%;
    animation: sunRotate 30s linear 0s infinite, shadowPulse 5s ease-in-out infinite;
    box-shadow:
      0 0 40px 20px rgba(255,140,0,0.8),
      inset -5px 0 10px 1px #ffb453,
      inset 15px 2px 40px 20px #bb6d01c5,
      inset -24px -2px 50px 25px #ffa265c2,
      inset 150px 0 80px 35px #c55f00aa;
  }
  @keyframes sunRotate { 0% { background-position: 0 0; } 100% { background-position: 400px 0; } }
  @keyframes shadowPulse {
    0%, 100% {
      box-shadow:
        0 0 40px 20px rgba(255,140,0,0.8),
        inset -5px 0 10px 1px #ffb453,
        inset 15px 2px 40px 20px #bb6d01c5,
        inset -24px -2px 50px 25px #ffa265c2,
        inset 150px 0 80px 35px #c55f00aa;
    }
    50% {
      box-shadow:
        0 0 60px 30px rgba(255,140,0,0.9),
        inset -5px 0 20px 5px #ffb453,
        inset 15px 2px 60px 30px #bb6d01c5,
        inset -24px -2px 70px 35px #ffa265c2,
        inset 150px 0 100px 45px #c55f00aa;
    }
  }
  .curved-corner-star { display: flex; position: relative; }
  #curved-corner-bottomleft, #curved-corner-bottomright, #curved-corner-topleft, #curved-corner-topright { width: 4px; height: 5px; overflow: hidden; position: relative; }
  #curved-corner-bottomleft:before, #curved-corner-bottomright:before, #curved-corner-topleft:before, #curved-corner-topright:before {
    content: '';
    display: block;
    width: 200%;
    height: 200%;
    position: absolute;
    border-radius: 50%;
  }
  #curved-corner-bottomleft:before { bottom: 0; left: 0; box-shadow: -5px 5px 0 0 white; }
  #curved-corner-bottomright:before { bottom: 0; right: 0; box-shadow: 5px 5px 0 0 white; }
  #curved-corner-topleft:before { top: 0; left: 0; box-shadow: -5px -5px 0 0 white; }
  #curved-corner-topright:before { top: 0; right: 0; box-shadow: 5px -5px 0 0 white; }
  @keyframes twinkling { 0%,100% { opacity: 0.1; } 50% { opacity: 1; } }
  #star-1, #star-2, #star-3, #star-4, #star-5, #star-6, #star-7 { position: absolute; }
  #star-1 { left: -20px; animation: twinkling 3s infinite; }
  #star-2 { left: -40px; top: 30px; animation: twinkling 2s infinite; }
  #star-3 { left: 260px; top: 90px; animation: twinkling 4s infinite; }
  #star-4 { left: 160px; top: 250px; animation: twinkling 3s infinite; }
  #star-5 { left: 50px; top: 230px; animation: twinkling 1.5s infinite; }
  #star-6 { left: 200px; top: -40px; animation: twinkling 4s infinite; }
  #star-7 { left: 230px; top: 60px; animation: twinkling 2s infinite; }
`;
// Animated orbit arc
const sweep = keyframes`
  0% { transform: rotate(0deg); opacity: 0.15; }
  50% { opacity: 0.4; }
  100% { transform: rotate(360deg); opacity: 0.15; }
`;
const AnimatedArc = styled.div<{ $color: string }>`
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(from 0deg, transparent 0turn, ${p => p.$color}80 0.05turn, transparent 0.1turn);
    filter: blur(2px);
    animation: ${sweep} 8s linear infinite;
  }
`;

// Light beam separator
const glow = keyframes`
  0%,100% { opacity: 0.6; }
  50% { opacity: 1; }
`;
const Beam = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  pointer-events: none;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(0,174,239,0.45) 20%, rgba(0,174,239,0.15) 45%, transparent 70%);
    filter: blur(6px);
    animation: ${glow} 3s ease-in-out infinite;
  }
`;
 
