import { initializeAnalytics, setUserProperties } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { BrowserRouter as Router } from 'react-router-dom';
import { Workbox } from 'workbox-window';
import packageInfo from '../package.json';
import { wrapPromise } from './api/utils';
import App from './App';
import ServiceWorkerProvider from './components/ServiceWorkerProvider';
import config from './config';
import './index.css';

const initSW = async (): Promise<Workbox | undefined> => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    const wb = new Workbox('/service-worker.js');
    await wb.register();
    return wb;
  }
};

const res = wrapPromise(initSW());

const app = initializeApp(config.firebase);
const standalone = window.matchMedia('(display-mode: standalone)').matches;
const data = {
  app_version: packageInfo.version,
  app_name: 'UniBus Web App',
  standalone,
};
const analytics = initializeAnalytics(app, {
  config: data,
});
setUserProperties(analytics, data);

const AppLayout = () => {
  return (
    <ServiceWorkerProvider res={res}>
      <Router>
        <App />
      </Router>
    </ServiceWorkerProvider>
  );
};

export default AppLayout;
