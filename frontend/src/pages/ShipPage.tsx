import React from 'react';
import BaseDashboardPage from '../components/BaseDashboardPage';
import ShipScreen from '../components/screens/ShipScreen';

interface ShipPageProps {
  onBack: () => void;
  onNavigateToPage?: (page: 'profile' | 'map' | 'missions' | 'ship' | 'crew' | 'terminal' | 'admin') => void;
  onExit?: () => void;
}

const ShipPage: React.FC<ShipPageProps> = ({ onBack, onNavigateToPage, onExit }) => {
  return (
    <BaseDashboardPage
      currentScreen="ship"
      onBack={onBack}
      onNavigateToPage={onNavigateToPage}
      onExit={onExit}
    >
      <ShipScreen />
    </BaseDashboardPage>
  );
};

export default ShipPage;
