import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCursor from '../components/AnimatedCursor';
// import ParallaxBackground from '../components/ParallaxBackground';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/ui/Loader';

interface HomePageProps {
  onEnter: () => void;
  onPrivacyClick?: () => void;
  onCookiesClick?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onEnter, onPrivacyClick, onCookiesClick }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Проверяем, загружена ли страница
    const checkLoaded = () => {
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
      window.addEventListener('load', checkLoaded);
    }

    return () => {
      window.removeEventListener('load', checkLoaded);
    };
  }, []);

  const handleLearnMore = () => {
    onEnter(); // Переходим на страницу с горизонтальной прокруткой
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #148cdc 0%, #148cdc 20%, white 40%, white 60%, #148cdc 80%, #148cdc 100%)'
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

      {/* Parallax Background - убираем, так как используем градиент */}
      {/* <ParallaxBackground scrollY={0} /> */}

      {/* Header */}
      <Header onMenuToggle={toggleMenu} />

      {/* Main Content */}
      <div className="relative w-full h-full flex flex-col">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full flex-1 flex items-center justify-center"
        >
          <div className="text-center px-8 max-w-6xl mx-auto">
            <motion.h1
              className="text-6xl sm:text-8xl lg:text-9xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              АЛАБУГА
            </motion.h1>

            <motion.p
              className="text-2xl sm:text-3xl lg:text-4xl font-light mb-4 text-blue-200 tracking-widest"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Самая эффективная особая экономическая зона России
            </motion.p>

            <motion.p
              className="text-lg sm:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Инновации, технологии и возможности для вашего бизнеса. 
              Присоединяйтесь к лидерам экономического развития.
            </motion.p>

            <motion.div
              className="flex justify-center items-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <motion.button
                onClick={handleLearnMore}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Узнать больше
              </motion.button>
            </motion.div>
          </div>

          {/* Floating White Circles and Rings */}
          {/* Left side circles */}
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 border-2 border-white/20 rounded-full"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            className="absolute top-1/3 left-5 w-12 h-12 bg-white/10 rounded-full blur-sm"
            animate={{
              y: [0, 15, 0],
              x: [0, -5, 0],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          <motion.div
            className="absolute bottom-1/3 left-8 w-16 h-16 border border-white/15 rounded-full"
            animate={{
              y: [0, -25, 0],
              x: [0, 8, 0],
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          <motion.div
            className="absolute top-1/2 left-12 w-8 h-8 bg-white/8 rounded-full"
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
              scale: [1, 1.4, 1],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />

          {/* Right side circles */}
          <motion.div
            className="absolute top-16 right-12 w-24 h-24 border-2 border-white/25 rounded-full"
            animate={{
              y: [0, -15, 0],
              x: [0, -8, 0],
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />

          <motion.div
            className="absolute top-1/4 right-6 w-14 h-14 bg-white/12 rounded-full blur-sm"
            animate={{
              y: [0, 18, 0],
              x: [0, 12, 0],
              scale: [1, 1.25, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          />

          <motion.div
            className="absolute bottom-1/4 right-10 w-18 h-18 border border-white/20 rounded-full"
            animate={{
              y: [0, -22, 0],
              x: [0, -6, 0],
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />

          <motion.div
            className="absolute top-2/3 right-8 w-10 h-10 bg-white/6 rounded-full"
            animate={{
              y: [0, 25, 0],
              x: [0, 15, 0],
              scale: [1, 1.5, 1],
              opacity: [0.08, 0.2, 0.08],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5,
            }}
          />

          {/* Additional floating elements */}
          <motion.div
            className="absolute top-1/6 left-1/4 w-6 h-6 border border-white/10 rounded-full"
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.6, 1],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          />

          <motion.div
            className="absolute bottom-1/6 right-1/3 w-8 h-8 bg-white/5 rounded-full blur-sm"
            animate={{
              y: [0, 20, 0],
              x: [0, -18, 0],
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
          />
        </motion.main>
        
        {/* Footer */}
        <Footer onPrivacyClick={onPrivacyClick} onCookiesClick={onCookiesClick} />
      </div>
    </div>
  );
};

export default HomePage;
