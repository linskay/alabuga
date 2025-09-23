import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ClickSpark from './components/ClickSpark';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ClickSpark sparkColor="#8ee0ff" sparkCount={10} sparkRadius={18} duration={450} />
    <App />
  </React.StrictMode>
);

reportWebVitals();
