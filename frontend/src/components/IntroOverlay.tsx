import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroOverlayProps {
  isVisible: boolean;
  onEnter: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ isVisible, onEnter }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    if (isVisible) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
        >
          {/* Animated cursor */}
          <motion.div
            className="fixed w-16 h-16 border-2 border-white/30 rounded-full pointer-events-none mix-blend-difference"
            style={{
              left: mousePosition.x - 32,
              top: mousePosition.y - 32,
            }}
            animate={{
              scale: isHovering ? 1.5 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {/* Main content */}
          <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="mb-8 sm:mb-12"
            >
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-3 sm:mb-4 tracking-wider">
                АЛАБУГА
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/80 font-light tracking-widest">
                ОСОБАЯ ЭКОНОМИЧЕСКАЯ ЗОНА
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mb-12 sm:mb-16"
            >
              <p className="text-base sm:text-lg text-white/70 mb-6 sm:mb-8">
                Нажмите Войти для продолжения
              </p>
              
              <motion.button
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={onEnter}
                className="relative w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg overflow-hidden group text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Войти</span>
              </motion.button>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              className="absolute top-20 left-20 w-4 h-4 bg-blue-400/30 rounded-full"
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-40 right-32 w-6 h-6 bg-cyan-400/30 rounded-full"
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            <motion.div
              className="absolute bottom-32 left-1/4 w-3 h-3 bg-white/20 rounded-full"
              animate={{
                y: [0, -25, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroOverlay;
