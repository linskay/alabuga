import React from 'react';
import BaseDashboardPage from '../components/BaseDashboardPage';
import TerminalScreen from '../components/screens/TerminalScreen';

interface TerminalPageProps {
  onBack: () => void;
  onNavigateToPage?: (page: 'profile' | 'map' | 'missions' | 'ship' | 'crew' | 'terminal' | 'admin') => void;
  onExit?: () => void;
}

const TerminalPage: React.FC<TerminalPageProps> = ({ onBack, onNavigateToPage, onExit }) => {
  return (
    <BaseDashboardPage
      currentScreen="terminal"
      onBack={onBack}
      onNavigateToPage={onNavigateToPage}
      onExit={onExit}
    >
      <TerminalScreen />
    </BaseDashboardPage>
  );
};

export default TerminalPage;
