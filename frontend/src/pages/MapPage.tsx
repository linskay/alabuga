import React from 'react';
import BaseDashboardPage from '../components/BaseDashboardPage';
import MapScreen from '../components/screens/MapScreen';

interface MapPageProps {
  onBack: () => void;
  onNavigateToPage?: (page: 'profile' | 'map' | 'missions' | 'ship' | 'crew' | 'terminal' | 'admin') => void;
  onExit?: () => void;
}

const MapPage: React.FC<MapPageProps> = ({ onBack, onNavigateToPage, onExit }) => {
  return (
    <BaseDashboardPage
      currentScreen="map"
      onBack={onBack}
      onNavigateToPage={onNavigateToPage}
      onExit={onExit}
    >
      <MapScreen />
    </BaseDashboardPage>
  );
};

export default MapPage;
