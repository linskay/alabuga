import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface LensProps {
  zoomFactor?: number;
  lensSize?: number;
  isStatic?: boolean;
  position?: { x: number; y: number };
}

const AnimatedCursor: React.FC<LensProps> = ({ zoomFactor = 3.0, lensSize = 160, isStatic = false, position = { x: 200, y: 150 } }) => {
  const hovering = true;
  const [mousePosition, setMousePosition] = useState({ x: position.x, y: position.y });

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove as any);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {isStatic ? (
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.58 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 overflow-hidden"
            style={{
              WebkitMaskImage: `radial-gradient(circle ${lensSize / 2}px at ${position.x}px ${position.y}px, black 100%, transparent 100%)`,
              maskImage: `radial-gradient(circle ${lensSize / 2}px at ${position.x}px ${position.y}px, black 100%, transparent 100%)`,
              transformOrigin: `${position.x}px ${position.y}px`
            }}
          >
            <div className="absolute inset-0" style={{ transform: `scale(${zoomFactor})`, transformOrigin: `${position.x}px ${position.y}px` }} />
          </motion.div>
          <div
            className="absolute"
            style={{
              left: position.x - lensSize / 2,
              top: position.y - lensSize / 2,
              width: lensSize,
              height: lensSize,
              borderRadius: '50%',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)',
              background: 'radial-gradient(circle at center, transparent 60%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0.2) 80%, transparent 100%)'
            }}
          />
        </div>
      ) : (
        <AnimatePresence>
          {hovering && (
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.58 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute inset-0 overflow-hidden"
                style={{
                  WebkitMaskImage: `radial-gradient(circle ${lensSize / 2}px at ${mousePosition.x}px ${mousePosition.y}px, black 100%, transparent 100%)`,
                  maskImage: `radial-gradient(circle ${lensSize / 2}px at ${mousePosition.x}px ${mousePosition.y}px, black 100%, transparent 100%)`,
                  transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`,
                  zIndex: 50
                }}
              >
                <div className="absolute inset-0" style={{ transform: `scale(${zoomFactor})`, transformOrigin: `${mousePosition.x}px ${mousePosition.y}px` }} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.58 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute z-[60]"
                style={{
                  left: mousePosition.x - lensSize / 2,
                  top: mousePosition.y - lensSize / 2,
                  width: lensSize,
                  height: lensSize,
                  borderRadius: '50%',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)',
                  background: 'radial-gradient(circle at center, transparent 60%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0.2) 80%, transparent 100%)'
                }}
              />
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default AnimatedCursor;
