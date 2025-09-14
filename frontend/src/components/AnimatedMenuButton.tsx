import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedMenuButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

const AnimatedMenuButton: React.FC<AnimatedMenuButtonProps> = ({ onClick, isOpen = false }) => {
  const [isChecked, setIsChecked] = useState(isOpen);

  useEffect(() => {
    setIsChecked(isOpen);
  }, [isOpen]);

  const handleClick = () => {
    setIsChecked(!isChecked);
    onClick();
  };

  return (
    <div className="relative">
      <input
        id="menu-checkbox"
        type="checkbox"
        checked={isChecked}
        onChange={() => {}} // Controlled by handleClick
        className="hidden"
      />
      
      <motion.label
        htmlFor="menu-checkbox"
        onClick={handleClick}
        className="relative w-12 h-12 cursor-pointer flex items-center justify-center transition-all duration-500 hover:scale-105 p-1 rounded-lg hover:bg-white/10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Bar 1 - Top */}
        <motion.div
          className="absolute w-6 h-1 bg-blue-400 rounded-full"
          animate={{
            rotate: isChecked ? 45 : 0,
            y: isChecked ? 0 : -6,
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Bar 2 - Middle */}
        <motion.div
          className="absolute w-6 h-1 bg-blue-400 rounded-full"
          animate={{
            scaleX: isChecked ? 0 : 1,
            opacity: isChecked ? 0 : 1,
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Bar 3 - Bottom */}
        <motion.div
          className="absolute w-6 h-1 bg-blue-400 rounded-full"
          animate={{
            rotate: isChecked ? -45 : 0,
            y: isChecked ? 0 : 6,
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.label>
    </div>
  );
};

export default AnimatedMenuButton;
