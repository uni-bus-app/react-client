import { useEffect, useRef, useState } from 'react';
import { useServiceWorker } from '../components/ServiceWorkerProvider';
import { SWBroadcastMessage } from '../types';

const useUpdate = () => {
  const { registration } = useServiceWorker();
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [restarting, setRestarting] = useState<boolean>(false);
  const updateAvailableTimeout = useRef<boolean>(false);
  const updateAvailableTimeout1 = useRef<boolean>(false);
  const restartingTimeout = useRef<number>(0);
  const checkForUpdates = async () => {
    registration?.update();
  };
  const restart = async () => {
    setRestarting(true);
    registration?.waiting?.addEventListener('statechange', (event) => {
      const { state } = event.target as ServiceWorker;
      if (state === 'activated') {
        window.location.reload();
      }
    });
    registration?.waiting?.postMessage({
      type: SWBroadcastMessage.SkipWaiting,
    });
  };
  const visibilityChange = async () => {
    if (document.hidden) {
      if (updateAvailableTimeout.current && !updateAvailableTimeout1.current) {
        window.removeEventListener('visibilitychange', visibilityChange);
        restart();
      }
    } else {
      await checkForUpdates();
    }
  };
  const updateFound = (ev: any) => {
    const target = ev.target as ServiceWorkerRegistration;
    if (!target.installing) {
      return false;
    }
    target.installing.addEventListener('statechange', (event) => {
      const { state } = event.target as ServiceWorker;
      if (
        navigator.serviceWorker.controller?.scriptURL.includes('ngsw-worker.js')
      ) {
        return;
      }
      if (state === 'installed') {
        setUpdateAvailable(true);
      }
      //  else if (state === 'activated') {
      //   window.location.reload();
      // }
    });
  };
  useEffect(() => {
    if (registration) {
      registration.addEventListener('updatefound', updateFound);
      window.addEventListener('visibilitychange', visibilityChange);
      return () => {
        registration.removeEventListener('updatefound', updateFound);
        window.removeEventListener('visibilitychange', visibilityChange);
      };
    }
  }, [registration]);
  useEffect(() => {
    updateAvailableTimeout.current = updateAvailable;
  }, [updateAvailable]);
  useEffect(() => {
    updateAvailableTimeout1.current = restarting;
  }, [restarting]);
  return { checkForUpdates, updateAvailable, restart, restarting };
};

export default useUpdate;
