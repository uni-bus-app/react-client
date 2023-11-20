import { initializeAnalytics, setUserProperties } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import packageInfo from '../package.json';
import App from './App';
import ServiceWorkerProvider from './components/ServiceWorkerProvider';
import config from './config';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Workbox } from 'workbox-window';
import SettingsProvider from './components/SettingsProvider';
import LoadingScreen from './beta-components/LoadingScreen';

export const wrapPromise = (
  promise: Promise<any>
): {
  read: () => any;
} => {
  let status = 'pending';
  let result: any;
  const suspender = promise.then(
    (r: any) => {
      status = 'success';
      result = r;
    },
    (e: any) => {
      status = 'error';
      result = e;
    }
  );
  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    },
  };
};

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

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <Suspense fallback={<div>Loading...</div>}>
        <ServiceWorkerProvider res={res}>
          <Router>
            <Suspense fallback={<LoadingScreen />}>
              <SettingsProvider>
                <App />
              </SettingsProvider>
            </Suspense>
          </Router>
        </ServiceWorkerProvider>
      </Suspense>
    </StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
