import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import StaticMap from './components/Map/static';
import './index.css';
import reportWebVitals from './reportWebVitals';

const AppLayout = lazy(() => import('./AppLayout'));

const AppShell = () => {
  const { matches } = window.matchMedia('(prefers-color-scheme: dark)');
  return (
    <>
      <StaticMap visible={true} />
      <div
        style={
          matches
            ? {
                backgroundColor: 'rgb(66, 66, 66)',
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '57%',
              }
            : undefined
        }
      />
    </>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <Suspense fallback={<AppShell />}>
        <AppLayout />
      </Suspense>
    </StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
