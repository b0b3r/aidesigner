import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AppWithReactFlow from './AppWithReactFlow';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Переключатель между старой и новой версией
const USE_REACT_FLOW = true; // Изменить на false для возврата к старому канвасу

root.render(
  <React.StrictMode>
    {USE_REACT_FLOW ? <AppWithReactFlow /> : <App />}
  </React.StrictMode>
); 