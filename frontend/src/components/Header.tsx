import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import BackButton from './BackButton';
import LoginButton from './LoginButton';
import ExitButton from './ExitButton';
import AnimatedTitle from './AnimatedTitle';

interface HeaderProps {
  onMenuToggle: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  showLoginButton?: boolean;
  onLoginClick?: () => void;
  showExitButton?: boolean;
  onExitClick?: () => void;
  show404Button?: boolean;
  on404Click?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, showBackButton = false, onBack, showLoginButton = true, onLoginClick, showExitButton = false, onExitClick, show404Button = false, on404Click }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);
  const lastByTargetRef = useRef(new WeakMap<EventTarget, number>());

  useEffect(() => {
    const getScrollTop = (target?: EventTarget | null) => {
      const t = target as any;
      if (t && typeof t.scrollTop === 'number') return t.scrollTop as number;
      return (document.scrollingElement?.scrollTop ?? window.scrollY ?? 0) as number;
    };
    lastYRef.current = getScrollTop();
    const handleScroll = (ev: Event) => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(() => {
        const target = ev.target as EventTarget | null;
        const prev = lastByTargetRef.current.get(target || document) ?? lastYRef.current;
        const currentY = getScrollTop(target);
        const delta = currentY - prev;
        // Порог в 8px, чтобы не дёргалось
        if (Math.abs(delta) > 8) {
          if (delta > 0 && currentY > 40) {
            setIsHidden(true); // скролл вниз — прячем
          } else {
            setIsHidden(false); // скролл вверх — показываем
          }
          lastYRef.current = currentY;
          lastByTargetRef.current.set(target || document, currentY);
        }
        if (currentY < 10) {
          setIsHidden(false);
        }
        tickingRef.current = false;
      });
    };
    window.addEventListener('scroll', handleScroll as any, { passive: true });
    // capture = true, чтобы ловить scroll на вложенных контейнерах с overflow
    document.addEventListener('scroll', handleScroll as any, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', handleScroll as any);
      document.removeEventListener('scroll', handleScroll as any, { capture: true } as any);
    };
  }, []);

  const handleMouseEnter = () => {
    setShowLogin(true);
  };

  const handleMouseLeave = () => {
    setShowLogin(false);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: isHidden ? -100 : 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 h-16 sm:h-20 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-4 sm:px-8 z-50"
      style={{
        background: 'rgba(36, 43, 140, 0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {/* Логотип с анимированной надписью */}
      <motion.div
        className="flex items-center space-x-3"
        whileHover={{ scale: 1.05 }}
      >
        {showBackButton && onBack && (
          <BackButton onBack={onBack} />
        )}
        <div className="relative group">
          <img 
            src="/images/logo.png" 
            alt="Алабуга.TECH" 
            className="w-8 h-8 sm:w-10 sm:h-10 relative z-10 transition-all duration-300 group-hover:scale-110"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(0, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(0, 255, 255, 0.2))',
              animation: 'pulse 2s ease-in-out infinite alternate'
            }}
            onError={(e) => {
              // Fallback к текстовому логотипу если изображение не загружается
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) {
                fallback.style.display = 'flex';
                console.log('Logo image failed to load, showing fallback');
              }
            }}
            onLoad={() => {
              console.log('Logo image loaded successfully');
            }}
          />
          {/* Fallback логотип */}
          <div 
            className="w-8 h-8 sm:w-10 sm:h-10 relative z-10 transition-all duration-300 group-hover:scale-110 items-center justify-center font-bold text-cyan-400 text-xs sm:text-sm"
            style={{
              display: 'none',
              filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(0, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(0, 255, 255, 0.2))',
              animation: 'pulse 2s ease-in-out infinite alternate'
            }}
          >
            AT
          </div>
          {/* Дополнительное свечение */}
          <div 
            className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full opacity-30 transition-all duration-300 group-hover:opacity-50 group-hover:scale-150"
            style={{
              background: 'radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%)',
              animation: 'pulse 2s ease-in-out infinite alternate',
              transform: 'scale(1.5)',
              zIndex: 1
            }}
          />
        </div>
        <div className="relative">
          <AnimatedTitle />
        </div>
      </motion.div>

      {/* Кнопки справа */}
      <div className="flex items-center space-x-3">
        {/* Кнопка входа */}
        {showLoginButton && (
          <div className="relative">
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <LoginButton onClick={onLoginClick || (() => {})}>
                <span className="hidden sm:inline">Вход в систему</span>
                <span className="sm:hidden">Вход</span>
              </LoginButton>
            </div>

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
        )}

        {/* Кнопка 404 (для демонстрации) */}
        {show404Button && (
          <button
            onClick={on404Click}
            className="px-3 py-1 bg-red-500/20 border border-red-400/30 rounded text-red-300 text-sm hover:bg-red-500/30 transition-all duration-300"
          >
            404
          </button>
        )}

        {/* Кнопка выхода */}
        {showExitButton && (
          <ExitButton onClick={onExitClick} />
        )}
      </div>
      
      {/* CSS для анимации свечения */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0% {
              filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.6)) drop-shadow(0 0 20px rgba(0, 255, 255, 0.4)) drop-shadow(0 0 30px rgba(0, 255, 255, 0.2));
            }
            100% {
              filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.8)) drop-shadow(0 0 25px rgba(0, 255, 255, 0.6)) drop-shadow(0 0 35px rgba(0, 255, 255, 0.4));
            }
          }
        `
      }} />
    </motion.header>
  );
};

export default Header;
