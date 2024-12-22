import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/globals.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorker';
import { DarkModeProvider } from './contexts/DarkModeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </React.StrictMode>
);

// Update service worker registration
serviceWorkerRegistration.register({
  onUpdate: registration => {
    if (registration && registration.waiting) {
      registration.waiting.addEventListener('statechange', event => {
        if (event.target.state === 'activated') {
          window.location.reload();
        }
      });
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }
});