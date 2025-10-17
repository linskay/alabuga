import React from 'react';
import BaseDashboardPage from '../components/BaseDashboardPage';
import MissionsScreen from '../components/screens/MissionsScreen';

interface MissionsPageProps {
  onBack: () => void;
  onNavigateToPage?: (page: 'profile' | 'map' | 'missions' | 'ship' | 'crew' | 'terminal' | 'admin') => void;
  onExit?: () => void;
}

const MissionsPage: React.FC<MissionsPageProps> = ({ onBack, onNavigateToPage, onExit }) => {
  return (
    <BaseDashboardPage
      currentScreen="missions"
      onBack={onBack}
      onNavigateToPage={onNavigateToPage}
      onExit={onExit}
    >
      <MissionsScreen />
    </BaseDashboardPage>
  );
};

export default MissionsPage;
