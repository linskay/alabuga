import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import HomePage from './HomePage';
import ScrollPage from './ScrollPage';
import DashboardPage from './DashboardPage';
import MapPage from './MapPage';
import MissionsPage from './MissionsPage';
import ShipPage from './ShipPage';
import CrewPage from './CrewPage';
import TerminalPage from './TerminalPage';
import AdminPage from './AdminPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import CookiesPage from './CookiesPage';
import NotFoundPage from '../components/NotFoundPage';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [currentPage, setCurrentPage] = useState<'home' | 'scroll' | 'dashboard' | 'profile' | 'map' | 'missions' | 'ship' | 'crew' | 'terminal' | 'admin' | 'privacy' | 'cookies' | '404'>('home');

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
    setCurrentPage('dashboard'); // Переходим сразу на Dashboard
  };

  const handleScroll = () => {
    setCurrentPage('scroll'); // Переходим на ScrollPage при скролле
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  const handleEnterDashboard = () => {
    setCurrentPage('dashboard'); // Переходим на Dashboard
  };

  const handleBackFromDashboard = () => {
    setCurrentPage('scroll'); // Возвращаемся к ScrollPage
  };

  // Handlers for individual pages
  const handleNavigateToPage = (page: 'profile' | 'map' | 'missions' | 'ship' | 'crew' | 'terminal' | 'admin') => {
    setCurrentPage(page);
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleExit = () => {
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

  const handle404Back = () => {
    setCurrentPage('dashboard');
  };

  const show404 = () => {
    setCurrentPage('404');
  };

  // Экспортируем функцию для использования в других компонентах
  (window as any).show404 = show404;

  // Управляем флагом для отключения ClickSpark на home/scroll
  useEffect(() => {
    const isLanding = currentPage === 'home' || currentPage === 'scroll';
    if (isLanding) {
      document.body.setAttribute('data-clickspark', 'off');
    } else {
      document.body.removeAttribute('data-clickspark');
    }
    return () => {
      // не трогаем здесь, управление выше по эффекту
    };
  }, [currentPage]);

  return (
    <AnimatePresence mode="wait">
      {currentPage === 'home' ? (
        <HomePage key="home" onEnter={handleEnter} onScroll={handleScroll} onPrivacyClick={handlePrivacyClick} onCookiesClick={handleCookiesClick} />
      ) : currentPage === 'scroll' ? (
        <ScrollPage key="scroll" onBack={handleBack} onEnterDashboard={handleEnterDashboard} onPrivacyClick={handlePrivacyClick} onCookiesClick={handleCookiesClick} />
      ) : currentPage === 'dashboard' ? (
        <DashboardPage key="dashboard" onBack={handleBackFromDashboard} onNavigateToPage={handleNavigateToPage} onExit={handleExit} />
      ) : currentPage === 'profile' ? (
        <DashboardPage key="profile" onBack={handleBackFromDashboard} onNavigateToPage={handleNavigateToPage} onExit={handleExit} />
      ) : currentPage === 'map' ? (
        <MapPage key="map" onBack={handleBackToDashboard} onNavigateToPage={handleNavigateToPage} onExit={handleExit} />
      ) : currentPage === 'missions' ? (
        <MissionsPage key="missions" onBack={handleBackToDashboard} onNavigateToPage={handleNavigateToPage} onExit={handleExit} />
      ) : currentPage === 'ship' ? (
        <ShipPage key="ship" onBack={handleBackToDashboard} onNavigateToPage={handleNavigateToPage} onExit={handleExit} />
      ) : currentPage === 'crew' ? (
        <CrewPage key="crew" onBack={handleBackToDashboard} onNavigateToPage={handleNavigateToPage} onExit={handleExit} />
      ) : currentPage === 'terminal' ? (
        <TerminalPage key="terminal" onBack={handleBackToDashboard} onNavigateToPage={handleNavigateToPage} onExit={handleExit} />
      ) : currentPage === 'admin' ? (
        <AdminPage key="admin" onBack={handleBackToDashboard} onNavigateToPage={handleNavigateToPage} onExit={handleExit} />
      ) : currentPage === 'privacy' ? (
        <PrivacyPolicyPage key="privacy" onBack={handlePrivacyBack} />
      ) : currentPage === 'cookies' ? (
        <CookiesPage key="cookies" onBack={handleCookiesBack} />
      ) : currentPage === '404' ? (
        <NotFoundPage key="404" onBack={handle404Back} />
      ) : (
        <NotFoundPage key="404-fallback" onBack={handle404Back} />
      )}
    </AnimatePresence>
  );
};

export default LandingPage;