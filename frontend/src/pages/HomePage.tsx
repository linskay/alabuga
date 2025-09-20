import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import ParallaxBackground from '../components/ParallaxBackground';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import AnimatedStars from '../components/AnimatedStars';
import AnimatedText from '../components/AnimatedText';
import ScrollHint from '../components/ScrollHint';
import styled from 'styled-components';

interface HomePageProps {
  onEnter: () => void;
  onScroll?: () => void;
  onPrivacyClick?: () => void;
  onCookiesClick?: () => void;
}

// Стилизованная кнопка "Войти"
const StyledButton = styled.div`
  .entry-button {
    --line_color: #6acff6;
    --back_color: #6acff6;
  }
  
  .button {
    position: relative;
    z-index: 0;
    width: 240px;
    height: 56px;
    text-decoration: none;
    font-size: 14px;
    font-weight: bold;
    color: white;
    letter-spacing: 2px;
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .button__text {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  
  .button::before,
  .button::after,
  .button__text::before,
  .button__text::after {
    content: "";
    position: absolute;
    height: 3px;
    border-radius: 2px;
    background: var(--line_color);
    transition: all 0.5s ease;
  }
  
  .button::before {
    top: 0;
    left: 54px;
    width: calc(100% - 56px * 2 - 16px);
  }
  
  .button::after {
    top: 0;
    right: 54px;
    width: 8px;
  }
  
  .button__text::before {
    bottom: 0;
    right: 54px;
    width: calc(100% - 56px * 2 - 16px);
  }
  
  .button__text::after {
    bottom: 0;
    left: 54px;
    width: 8px;
  }
  
  .button__line {
    position: absolute;
    top: 0;
    width: 56px;
    height: 100%;
    overflow: hidden;
  }
  
  .button__line::before {
    content: "";
    position: absolute;
    top: 0;
    width: 150%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 300px;
    border: solid 3px var(--line_color);
  }
  
  .button__line:nth-child(1),
  .button__line:nth-child(1)::before {
    left: 0;
  }
  
  .button__line:nth-child(2),
  .button__line:nth-child(2)::before {
    right: 0;
  }
  
  .button:hover {
    letter-spacing: 6px;
  }
  
  .button:hover::before,
  .button:hover .button__text::before {
    width: 8px;
  }
  
  .button:hover::after,
  .button:hover .button__text::after {
    width: calc(100% - 56px * 2 - 16px);
  }
  
  .button__drow1,
  .button__drow2 {
    position: absolute;
    z-index: -1;
    border-radius: 16px;
    transform-origin: 16px 16px;
  }
  
  .button__drow1 {
    top: -16px;
    left: 40px;
    width: 32px;
    height: 0;
    transform: rotate(30deg);
  }
  
  .button__drow2 {
    top: 44px;
    left: 77px;
    width: 32px;
    height: 0;
    transform: rotate(-127deg);
  }
  
  .button__drow1::before,
  .button__drow1::after,
  .button__drow2::before,
  .button__drow2::after {
    content: "";
    position: absolute;
  }
  
  .button__drow1::before {
    bottom: 0;
    left: 0;
    width: 0;
    height: 32px;
    border-radius: 16px;
    transform-origin: 16px 16px;
    transform: rotate(-60deg);
  }
  
  .button__drow1::after {
    top: -10px;
    left: 45px;
    width: 0;
    height: 32px;
    border-radius: 16px;
    transform-origin: 16px 16px;
    transform: rotate(69deg);
  }
  
  .button__drow2::before {
    bottom: 0;
    left: 0;
    width: 0;
    height: 32px;
    border-radius: 16px;
    transform-origin: 16px 16px;
    transform: rotate(-146deg);
  }
  
  .button__drow2::after {
    bottom: 26px;
    left: -40px;
    width: 0;
    height: 32px;
    border-radius: 16px;
    transform-origin: 16px 16px;
    transform: rotate(-262deg);
  }
  
  .button__drow1,
  .button__drow1::before,
  .button__drow1::after,
  .button__drow2,
  .button__drow2::before,
  .button__drow2::after {
    background: var(--back_color);
    opacity: 0.7;
  }
  
  .button:hover .button__drow1 {
    animation: drow1 ease-in 0.06s;
    animation-fill-mode: forwards;
  }
  
  .button:hover .button__drow1::before {
    animation: drow2 linear 0.08s 0.06s;
    animation-fill-mode: forwards;
  }
  
  .button:hover .button__drow1::after {
    animation: drow3 linear 0.03s 0.14s;
    animation-fill-mode: forwards;
  }
  
  .button:hover .button__drow2 {
    animation: drow4 linear 0.06s 0.2s;
    animation-fill-mode: forwards;
  }
  
  .button:hover .button__drow2::before {
    animation: drow3 linear 0.03s 0.26s;
    animation-fill-mode: forwards;
  }
  
  .button:hover .button__drow2::after {
    animation: drow5 linear 0.06s 0.32s;
    animation-fill-mode: forwards;
  }
  
  @keyframes drow1 {
    0% { height: 0; }
    100% { height: 100px; }
  }
  
  @keyframes drow2 {
    0% { width: 0; opacity: 0; }
    10% { opacity: 0; }
    11% { opacity: 1; }
    100% { width: 120px; }
  }
  
  @keyframes drow3 {
    0% { width: 0; }
    100% { width: 80px; }
  }
  
  @keyframes drow4 {
    0% { height: 0; }
    100% { height: 120px; }
  }
  
  @keyframes drow5 {
    0% { width: 0; }
    100% { width: 124px; }
  }
`;


const HomePage: React.FC<HomePageProps> = ({ onEnter, onScroll, onPrivacyClick, onCookiesClick }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showVideo, setShowVideo] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Проверяем, загружена ли страница
    const checkLoaded = () => {
      if (document.readyState === 'complete') {
        setShowLoader(false);
        setIsLoaded(true);
        
        // Последовательность анимаций
        setTimeout(() => {
          setShowVideo(true);
        }, 500);
        
        setTimeout(() => {
          setShowText(true);
        }, 2000);
        
        setTimeout(() => {
          setShowButton(true);
        }, 20000);
      }
    };

    // Если страница уже загружена
    if (document.readyState === 'complete') {
      setShowLoader(false);
      setIsLoaded(true);
      
      // Последовательность анимаций
      setTimeout(() => {
        setShowVideo(true);
      }, 500);
      
      setTimeout(() => {
        setShowText(true);
      }, 2000);
      
      setTimeout(() => {
        setShowButton(true);
      }, 20000);
    } else {
      // Слушаем событие загрузки
      window.addEventListener('load', checkLoaded);
    }

    return () => {
      window.removeEventListener('load', checkLoaded);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Если пользователь скроллит вниз, переходим на ScrollPage
      if (e.deltaY > 0) {
        onScroll?.();
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [onScroll]);

  const handleLearnMore = () => {
    onEnter(); // Переходим сразу на Dashboard
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-cosmic" style={{ cursor: 'default' }}>
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


      {/* Parallax Background - убираем, так как используем градиент */}
      {/* <ParallaxBackground scrollY={0} /> */}

      {/* Header */}
      <Header onMenuToggle={toggleMenu} showLoginButton={false} />

      {/* Animated Cosmic Background */}
      <div className="absolute inset-0">
        <AnimatedStars />
        <div className="cosmic-orb cosmic-orb-1"></div>
        <div className="cosmic-orb cosmic-orb-2"></div>
        <div className="cosmic-orb cosmic-orb-3"></div>
        
        {/* Mouse-following gradient */}
        <div 
          className="mouse-gradient"
          style={{
            left: mousePosition.x - 200,
            top: mousePosition.y - 200,
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative w-full h-full flex flex-col">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full flex-1 flex items-end justify-center pb-20"
        >
          {/* Видео с эффектом размытия */}
          <AnimatePresence>
            {showVideo && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  filter: "blur(0px)" 
                }}
                exit={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-20 left-0 right-0 bottom-0 flex items-center justify-center z-20"
              >
                <div className="relative w-full h-full max-w-4xl max-h-4xl">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl shadow-2xl"
                    style={{
                      filter: 'blur(0px)',
                      transition: 'filter 2s ease-in-out',
                      maskImage: 'radial-gradient(ellipse 80% 80% at center, black 40%, transparent 100%)',
                      WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at center, black 40%, transparent 100%)'
                    }}
                  >
                    <source src="/images/cosmosstart.mp4" type="video/mp4" />
                  </video>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Анимированный текст */}
          <AnimatePresence>
            {showText && <AnimatedText />}
          </AnimatePresence>

          {/* Кнопка Войти */}
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-30"
              >
                <StyledButton>
                  <div className="flex justify-center items-center">
                    <div 
                      className="button entry-button"
                      onClick={handleLearnMore}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="button__line" />
                      <div className="button__line" />
                      <span className="button__text">ВОЙТИ</span>
                      <div className="button__drow1" />
                      <div className="button__drow2" />
                    </div>
                  </div>
                </StyledButton>
                
                {/* Scroll Hint */}
                <motion.div
                  className="mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  <ScrollHint />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
