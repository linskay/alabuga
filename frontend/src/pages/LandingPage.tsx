import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import HomePage from './HomePage';
import ScrollPage from './ScrollPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import CookiesPage from './CookiesPage';

const LandingPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'scroll' | 'privacy' | 'cookies'>('home');

  useEffect(() => {
    // Check current page based on hash
    if (window.location.hash === '#privacy-policy') {
      setCurrentPage('privacy');
    } else if (window.location.hash === '#cookies') {
      setCurrentPage('cookies');
    }

    // Listen for hash changes
    const handleHashChange = () => {
      if (window.location.hash === '#privacy-policy') {
        setCurrentPage('privacy');
      } else if (window.location.hash === '#cookies') {
        setCurrentPage('cookies');
      } else if (window.location.hash === '') {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleEnter = () => {
    setCurrentPage('scroll');
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  const handlePrivacyClick = () => {
    setCurrentPage('privacy');
    window.history.pushState(null, '', '#privacy-policy');
  };

  const handlePrivacyBack = () => {
    setCurrentPage('home');
    window.history.pushState(null, '', '#');
  };

  const handleCookiesClick = () => {
    setCurrentPage('cookies');
    window.history.pushState(null, '', '#cookies');
  };

  const handleCookiesBack = () => {
    setCurrentPage('home');
    window.history.pushState(null, '', '#');
  };

  return (
    <AnimatePresence mode="wait">
      {currentPage === 'home' ? (
        <HomePage key="home" onEnter={handleEnter} onPrivacyClick={handlePrivacyClick} onCookiesClick={handleCookiesClick} />
      ) : currentPage === 'scroll' ? (
        <ScrollPage key="scroll" onBack={handleBack} onPrivacyClick={handlePrivacyClick} onCookiesClick={handleCookiesClick} />
      ) : currentPage === 'privacy' ? (
        <PrivacyPolicyPage key="privacy" onBack={handlePrivacyBack} />
      ) : (
        <CookiesPage key="cookies" onBack={handleCookiesBack} />
      )}
    </AnimatePresence>
  );
};

export default LandingPage;