import React from 'react';
import LandingPage from './pages/LandingPage';
import { AppProvider } from './contexts/AppContext';

function App() {
  return (
    <AppProvider>
      <LandingPage onEnter={() => {}} />
    </AppProvider>
  );
}

export default App;
