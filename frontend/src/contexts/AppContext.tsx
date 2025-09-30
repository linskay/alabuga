import { createContext, useContext, useState, useCallback } from 'react';

interface AppContextType {
  refreshUserData: () => void;
  refreshArtifacts: () => void;
  refreshMissions: () => void;
  refreshShop: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshTriggers, setRefreshTriggers] = useState({
    userData: 0,
    artifacts: 0,
    missions: 0,
    shop: 0,
  });

  const refreshUserData = useCallback(() => {
    setRefreshTriggers(prev => ({ ...prev, userData: prev.userData + 1 }));
  }, []);

  const refreshArtifacts = useCallback(() => {
    setRefreshTriggers(prev => ({ ...prev, artifacts: prev.artifacts + 1 }));
  }, []);

  const refreshMissions = useCallback(() => {
    setRefreshTriggers(prev => ({ ...prev, missions: prev.missions + 1 }));
  }, []);

  const refreshShop = useCallback(() => {
    setRefreshTriggers(prev => ({ ...prev, shop: prev.shop + 1 }));
  }, []);

  return (
    <AppContext.Provider value={{
      refreshUserData,
      refreshArtifacts,
      refreshMissions,
      refreshShop,
    }}>
      {children}
    </AppContext.Provider>
  );
};
