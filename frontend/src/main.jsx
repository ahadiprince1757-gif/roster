import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { FarmProvider } from './context/FarmContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FarmProvider>
        <App />
      </FarmProvider>
    </AuthProvider>
  </StrictMode>,
);
