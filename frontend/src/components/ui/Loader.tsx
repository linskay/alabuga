import React from 'react';
import { motion } from 'framer-motion';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div
        className="relative w-11 h-11"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateX: [0, -385, -385],
          rotateY: [0, 25, 385],
          rotate: [45, 45, 45]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Face 1 - Back */}
        <motion.div
          className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500"
          style={{
            transform: 'translateZ(-22px) rotateY(180deg)'
          }}
        />
        
        {/* Face 2 - Right */}
        <motion.div
          className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500"
          style={{
            transform: 'rotateY(-270deg) translateX(50%)',
            transformOrigin: 'top right'
          }}
        />
        
        {/* Face 3 - Left */}
        <motion.div
          className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500"
          style={{
            transform: 'rotateY(270deg) translateX(-50%)',
            transformOrigin: 'center left'
          }}
        />
        
        {/* Face 4 - Top */}
        <motion.div
          className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500"
          style={{
            transform: 'rotateX(90deg) translateY(-50%)',
            transformOrigin: 'top center'
          }}
        />
        
        {/* Face 5 - Bottom */}
        <motion.div
          className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500"
          style={{
            transform: 'rotateX(-90deg) translateY(50%)',
            transformOrigin: 'bottom center'
          }}
        />
        
        {/* Face 6 - Front */}
        <motion.div
          className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500"
          style={{
            transform: 'translateZ(22px)'
          }}
        />
      </motion.div>
    </div>
  );
};

export default Loader;
