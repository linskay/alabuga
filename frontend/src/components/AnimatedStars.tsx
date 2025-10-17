import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

type Star = {
  id: number;
  x: number; // percent
  y: number; // percent
  size: number; // px
  delay: number;
  twinkleDuration: number;
  driftX: number; // px
  driftY: number; // px
  driftDurationX: number; // s
  driftDurationY: number; // s
};

function createLayer(count: number, options: { minSize: number; maxSize: number; drift: number; minDriftS: number; maxDriftS: number; twinkleMinS: number; twinkleMaxS: number }) {
  const { minSize, maxSize, drift, minDriftS, maxDriftS, twinkleMinS, twinkleMaxS } = options;
  return Array.from({ length: count }, (_, i) => {
    const size = minSize + Math.random() * (maxSize - minSize);
    return {
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size,
      delay: Math.random() * 6,
      twinkleDuration: twinkleMinS + Math.random() * (twinkleMaxS - twinkleMinS),
      driftX: (Math.random() - 0.5) * drift,
      driftY: (Math.random() - 0.5) * drift,
      driftDurationX: minDriftS + Math.random() * (maxDriftS - minDriftS),
      driftDurationY: minDriftS + Math.random() * (maxDriftS - minDriftS),
    } as Star;
  });
}

const AnimatedStars: React.FC = () => {
  // Стабилизируем набор звёзд между рендерами
  const { near, mid, far, twinkles } = useMemo(() => {
    return {
      near: createLayer(40, { minSize: 2, maxSize: 3.5, drift: 80, minDriftS: 30, maxDriftS: 60, twinkleMinS: 1.8, twinkleMaxS: 3.2 }),
      mid: createLayer(60, { minSize: 1.3, maxSize: 2.2, drift: 60, minDriftS: 40, maxDriftS: 80, twinkleMinS: 2.2, twinkleMaxS: 3.8 }),
      far: createLayer(80, { minSize: 0.8, maxSize: 1.4, drift: 40, minDriftS: 60, maxDriftS: 120, twinkleMinS: 2.5, twinkleMaxS: 4.5 }),
      twinkles: Array.from({ length: 25 }, (_, i) => ({ id: i })),
    };
  }, []);

  const renderLayer = (stars: Star[], opacity = 1) => (
    <>
      {stars.map((star) => (
        <motion.div
          key={`star-${opacity}-${star.id}`}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity,
            willChange: 'transform, opacity'
          }}
          animate={{
            opacity: [0.4 * opacity, 1 * opacity, 0.4 * opacity],
            x: [0, star.driftX, 0],
            y: [0, star.driftY, 0],
          }}
          transition={{
            opacity: { duration: star.twinkleDuration, repeat: Infinity, ease: 'easeInOut', delay: star.delay },
            x: { duration: star.driftDurationX, repeat: Infinity, repeatType: 'mirror', ease: 'linear' },
            y: { duration: star.driftDurationY, repeat: Infinity, repeatType: 'mirror', ease: 'linear' },
          }}
        />
      ))}
    </>
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {renderLayer(far, 0.7)}
      {renderLayer(mid, 0.85)}
      {renderLayer(near, 1)}

      {twinkles.map((t) => (
        <motion.div
          key={`twinkle-${t.id}`}
          className="absolute bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 0.5}px`,
            height: `${Math.random() * 2 + 0.5}px`,
            opacity: 0.8,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1.6, 0.6] }}
          transition={{ duration: 1 + Math.random() * 2.5, repeat: Infinity, delay: Math.random() * 4, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

export default AnimatedStars;
