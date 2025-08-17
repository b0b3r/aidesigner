import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Используем только новую версию на React Flow
// const USE_REACT_FLOW = true; // Удалено - не используется

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 