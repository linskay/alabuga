import React from 'react';
import { motion } from 'framer-motion';

const ScrollHint: React.FC = () => {
  return (
    <motion.div
      className="flex flex-col items-center space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Текст "Для кого мы?" */}
      <motion.p
        className="text-white text-base font-medium tracking-wide"
        style={{
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        Для кого мы?
      </motion.p>
      {/* Анимированный шарик в овальчике */}
      <motion.div
        className="relative w-8 h-12 border-2 border-white/60 rounded-full flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        <motion.div
          className="w-2 h-2 bg-white rounded-full mt-2"
          animate={{
            y: [0, 20, 0],
            opacity: [1, 0.3, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Текст "scroll me" */}
      <motion.p
        className="text-white text-sm font-light tracking-wider"
        style={{
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        scroll me
      </motion.p>
    </motion.div>
  );
};

export default ScrollHint;
