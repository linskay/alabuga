import React from 'react';
import BaseDashboardPage from '../components/BaseDashboardPage';
import CrewScreen from '../components/screens/CrewScreen';

interface CrewPageProps {
  onBack: () => void;
  onNavigateToPage?: (page: 'profile' | 'map' | 'missions' | 'ship' | 'crew' | 'terminal' | 'admin') => void;
  onExit?: () => void;
}

const CrewPage: React.FC<CrewPageProps> = ({ onBack, onNavigateToPage, onExit }) => {
  return (
    <BaseDashboardPage
      currentScreen="crew"
      onBack={onBack}
      onNavigateToPage={onNavigateToPage}
      onExit={onExit}
    >
      <CrewScreen />
    </BaseDashboardPage>
  );
};

export default CrewPage;
