import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedCursor from '../components/AnimatedCursor';
import HorizontalImageScroll from '../components/HorizontalImageScroll';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface ScrollPageProps {
  onBack: () => void;
  onPrivacyClick?: () => void;
  onCookiesClick?: () => void;
}

const ScrollPage: React.FC<ScrollPageProps> = ({ onBack, onPrivacyClick, onCookiesClick }) => {
  const [showMenu, setShowMenu] = useState(false);

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
      {/* Animated Cursor */}
      <AnimatedCursor />

      {/* Header */}
      <Header 
        onMenuToggle={toggleMenu} 
        showBackButton={true} 
        onBack={onBack}
      />

      {/* Horizontal Scroll Content */}
      <HorizontalImageScroll />
      
      {/* Footer */}
      <Footer onPrivacyClick={onPrivacyClick} onCookiesClick={onCookiesClick} />
    </div>
  );
};

export default ScrollPage;
