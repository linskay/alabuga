import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCursor from '../components/AnimatedCursor';
import HorizontalImageScroll from '../components/HorizontalImageScroll';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

interface ScrollPageProps {
  onBack: () => void;
  onEnterDashboard?: () => void;
  onPrivacyClick?: () => void;
  onCookiesClick?: () => void;
}

const ScrollPage: React.FC<ScrollPageProps> = ({ onBack, onEnterDashboard, onPrivacyClick, onCookiesClick }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

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
      }, 1000);

      return () => {
        window.removeEventListener('load', checkIfLoaded);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #148cdc 0%, #148cdc 20%, white 40%, white 60%, #148cdc 80%, #148cdc 100%)',
        cursor: 'default'
      }}
    >
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

      {/* Animated Cursor */}
      <AnimatedCursor />

      {/* Header */}
      <Header 
        onMenuToggle={toggleMenu} 
        showBackButton={true} 
        onBack={onBack}
        showLoginButton={true}
        onLoginClick={onEnterDashboard}
      />

      {/* Horizontal Scroll Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <HorizontalImageScroll />
      </motion.div>
      
      {/* Footer */}
      <Footer onPrivacyClick={onPrivacyClick} onCookiesClick={onCookiesClick} />
    </div>
  );
};

export default ScrollPage;
