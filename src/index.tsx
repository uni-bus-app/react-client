import { getAnalytics, setUserProperties } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import packageInfo from '../package.json';
import App from './App';
import ServiceWorkerProvider from './components/ServiceWorkerProvider';
import config from './config';
import './index.css';
import reportWebVitals from './reportWebVitals';

const app = initializeApp(config.firebase);
const analytics = getAnalytics(app);
setUserProperties(analytics, {
  app_version: packageInfo.version,
  app_name: 'UniBus Web App',
});

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ServiceWorkerProvider>
        <Router>
          <App />
        </Router>
      </ServiceWorkerProvider>
    </StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
