import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import BackButton from './BackButton';

interface HeaderProps {
  onMenuToggle: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, showBackButton = false, onBack }) => {
  const [showLogin, setShowLogin] = useState(false);

  const handleMouseEnter = () => {
    setShowLogin(true);
  };

  const handleMouseLeave = () => {
    setShowLogin(false);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 h-16 sm:h-20 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-4 sm:px-8 z-50"
      style={{
        background: 'rgba(36, 43, 140, 0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {/* Логотип с надписью слева */}
      <motion.div
        className="flex items-center space-x-3"
        whileHover={{ scale: 1.05 }}
      >
        {showBackButton && onBack && (
          <BackButton onBack={onBack} />
        )}
        <img 
          src="/images/logo.png" 
          alt="Алабуга.TECH" 
          className="w-8 h-8 sm:w-10 sm:h-10"
        />
        <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
          Алабуга.TECH
        </h1>
      </motion.div>

      {/* Кнопка входа справа */}
      <div className="relative">
        <motion.button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600/80 to-blue-500/80 backdrop-blur-sm text-white font-semibold rounded-lg hover:from-blue-500/90 hover:to-blue-400/90 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base border border-white/20"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="hidden sm:inline">Вход в систему</span>
          <span className="sm:hidden">Вход</span>
        </motion.button>

        <AnimatePresence>
          {showLogin && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 z-50"
            >
              <LoginForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
