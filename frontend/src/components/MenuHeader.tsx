import React from 'react';
import { motion } from 'framer-motion';
import AnimatedMenuButton from './AnimatedMenuButton';
import ExitButton from './ExitButton';

interface MenuHeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 h-16 sm:h-20 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 sm:px-8 z-50"
    >
      <AnimatedMenuButton 
        onClick={onMenuToggle} 
        isOpen={isMenuOpen}
      />

      <motion.h1
        className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent"
        whileHover={{ scale: 1.05 }}
      >
        МЕНЮ
      </motion.h1>

      <ExitButton />
    </motion.header>
  );
};

export default MenuHeader;
