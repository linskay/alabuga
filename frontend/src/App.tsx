import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState<string>('Loading...');

  useEffect(() => {
    // Пример запроса к бэкенду
    fetch('/api/hello')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(() => setMessage('Could not connect to the backend'));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Alabuga Project</h1>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
