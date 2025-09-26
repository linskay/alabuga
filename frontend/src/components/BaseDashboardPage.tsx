import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import Loader from './Loader';
import AnimatedStars from './AnimatedStars';
import StonesMenu from './StonesMenu';
import { ScreenType } from '../pages/DashboardPage';

interface BaseDashboardPageProps {
  currentScreen: ScreenType;
  onBack: () => void;
  onNavigateToPage?: (page: 'profile' | 'map' | 'missions' | 'ship' | 'crew' | 'terminal' | 'admin') => void;
  onExit?: () => void;
  children: React.ReactNode;
}

const BaseDashboardPage: React.FC<BaseDashboardPageProps> = ({ 
  currentScreen, 
  onBack, 
  onNavigateToPage, 
  onExit,
  children 
}) => {
  const [showLoader, setShowLoader] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  // Removed global cursor-follow glow
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Проверяем, загружены ли все ресурсы
    const checkIfLoaded = () => {
      if (document.readyState === 'complete') {
        setShowLoader(false);
        setIsLoaded(true);
      }
    };

    // Если страница уже загружена
    if (document.readyState === 'complete') {
      setShowLoader(false);
      setIsLoaded(true);
    } else {
      // Слушаем событие загрузки
      window.addEventListener('load', checkIfLoaded);
      
      // Fallback таймер на случай, если событие load не сработает
      const fallbackTimer = setTimeout(() => {
        setShowLoader(false);
        setIsLoaded(true);
      }, 2000);

      return () => {
        window.removeEventListener('load', checkIfLoaded);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  // Эффект для скрытия хедера при скролле
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Скролл вниз - скрываем хедер
        setHeaderVisible(false);
      } else {
        // Скролл вверх - показываем хедер
        setHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Removed mousemove listener


  return (
    <div className="relative w-full min-h-screen bg-gradient-cosmic" style={{ cursor: 'default' }}>
      {/* Loader */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center"
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Cosmic Background (no cursor glow) */}
      <div className="absolute inset-0">
        <AnimatedStars />
        <div className="cosmic-orb cosmic-orb-1"></div>
        <div className="cosmic-orb cosmic-orb-2"></div>
        <div className="cosmic-orb cosmic-orb-3"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: headerVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <Header 
          onMenuToggle={() => {}} 
          showBackButton={false} 
          onBack={onBack} 
          showLoginButton={false} 
          showExitButton={true}
          onExitClick={onExit}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full flex flex-col"
      >
        {/* Stones Menu */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full flex justify-center pt-20 pb-4"
        >
          <StonesMenu
            onNavigateToPage={onNavigateToPage || (() => {})}
          />
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-7xl">
            {children}
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BaseDashboardPage;
