import React from 'react';
import { motion } from 'framer-motion';

interface BackButtonProps {
  onBack: () => void;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onBack, className = "" }) => {
  return (
    <motion.button
      onClick={onBack}
      className={`px-4 py-2 text-white/80 hover:text-white transition-colors duration-300 flex items-center gap-2 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Назад
    </motion.button>
  );
};

export default BackButton;
