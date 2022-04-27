import { getAnalytics, setUserProperties } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { version } from '../package.json';
import App from './App';
import ServiceWorkerProvider from './components/ServiceWorkerProvider';
import config from './config';
import './index.css';
import reportWebVitals from './reportWebVitals';

const app = initializeApp(config.firebase);
const analytics = getAnalytics(app);
setUserProperties(analytics, { app_version: version });

ReactDOM.render(
  <React.StrictMode>
    <ServiceWorkerProvider>
      <Router>
        <App />
      </Router>
    </ServiceWorkerProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
