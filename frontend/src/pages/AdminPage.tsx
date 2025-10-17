import React from 'react';
import BaseDashboardPage from '../components/BaseDashboardPage';
import AdminScreen from '../components/screens/AdminScreen';

interface AdminPageProps {
  onBack: () => void;
  onNavigateToPage?: (page: 'profile' | 'map' | 'missions' | 'ship' | 'crew' | 'terminal' | 'admin') => void;
  onExit?: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onBack, onNavigateToPage, onExit }) => {
  return (
    <BaseDashboardPage
      currentScreen="admin"
      onBack={onBack}
      onNavigateToPage={onNavigateToPage}
      onExit={onExit}
    >
      <AdminScreen />
    </BaseDashboardPage>
  );
};

export default AdminPage;
