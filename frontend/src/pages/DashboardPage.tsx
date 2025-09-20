import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnimatedStars from '../components/AnimatedStars';
import StonesMenu from '../components/StonesMenu';
import ProfileScreen from '../components/screens/ProfileScreen';

export type ScreenType = 'profile' | 'map' | 'missions' | 'ship' | 'crew' | 'terminal' | 'admin';

interface DashboardPageProps {
  onBack?: () => void;
  onNavigateToPage?: (page: 'profile' | 'map' | 'missions' | 'ship' | 'crew' | 'terminal' | 'admin') => void;
  onExit?: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onBack, onNavigateToPage, onExit }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('profile');
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Анимация загрузки
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleScreenChange = (screen: ScreenType) => {
    if (screen === 'profile') {
      setCurrentScreen(screen);
    } else if (onNavigateToPage) {
      // Navigate to separate page for other screens
      onNavigateToPage(screen as 'map' | 'missions' | 'ship' | 'crew' | 'terminal' | 'admin');
    }
  };

  const renderCurrentScreen = () => {
    // Only render ProfileScreen since other screens are now separate pages
    return <ProfileScreen />;
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-cosmic" style={{ cursor: 'default' }}>
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

      {/* Header */}
      <Header 
        onMenuToggle={() => {}} 
        showLoginButton={false} 
        showExitButton={true}
        onExitClick={onExit}
      />

      {/* Cosmic Radial Menu */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-20 left-8 z-50"
      >
        <StonesMenu 
          onNavigateToPage={onNavigateToPage || (() => {})}
        />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full h-full"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            {renderCurrentScreen()}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <Footer onPrivacyClick={() => {}} onCookiesClick={() => {}} />

      {/* Floating UI Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left side floating elements */}
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 border-2 border-cyan-400/20 rounded-full"
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
          className="absolute top-1/3 left-5 w-12 h-12 bg-cyan-400/10 rounded-full blur-sm"
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

        {/* Right side floating elements */}
        <motion.div
          className="absolute top-16 right-12 w-20 h-20 border-2 border-purple-400/25 rounded-full"
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
          className="absolute top-1/4 right-6 w-14 h-14 bg-purple-400/12 rounded-full blur-sm"
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
      </div>
    </div>
  );
};

export default DashboardPage;
