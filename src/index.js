// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { startSessionMaintenance, isAuthenticated, sessionManager } from './utils/sessionUtils';

// Global session management initialization
const initializeSessionManagement = () => {
  // Start session maintenance if user is authenticated
  if (isAuthenticated()) {
    console.log('🔐 User is authenticated, starting session maintenance...');
    startSessionMaintenance();
  }
  
  // Make sessionManager available globally for debugging
  if (process.env.NODE_ENV === 'development') {
    window.sessionManager = sessionManager;
    console.log('🔧 sessionManager available globally for debugging');
  }
  
  // Add global error handler for session issues
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('token') || event.reason?.message?.includes('auth')) {
      console.warn('Auth-related error detected:', event.reason.message);
    }
  });
};

// Initialize before React renders
initializeSessionManagement();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.sessionManager) {
    window.sessionManager.stop();
  }
});