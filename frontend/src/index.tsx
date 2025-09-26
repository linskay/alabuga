import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ClickSpark from './components/ClickSpark';
import reportWebVitals from './reportWebVitals';
import ErrorBoundary from './ErrorBoundary';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClickSpark sparkColor="#8ee0ff" sparkCount={10} sparkRadius={18} duration={450} />
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

reportWebVitals();
