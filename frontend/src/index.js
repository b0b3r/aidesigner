import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWithReactFlow from './AppWithReactFlow';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Используем только новую версию на React Flow
const USE_REACT_FLOW = true;

root.render(
  <React.StrictMode>
    <AppWithReactFlow />
  </React.StrictMode>
); 