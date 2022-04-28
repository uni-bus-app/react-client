import { useEffect, useRef, useState } from 'react';
import { useServiceWorker } from '../components/ServiceWorkerProvider';
import { WorkboxLifecycleEvent } from 'workbox-window';

const useUpdate = () => {
  const { registration: wb } = useServiceWorker();
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [restarting, setRestarting] = useState<boolean>(false);
  const restartTimeoutID = useRef<number>(0);
  const updateAvailableRef = useRef<boolean>(false);
  const isRestartingRef = useRef<boolean>(false);
  const checkForUpdates = async () => await wb?.update();
  const restart = async () => {
    setRestarting(true);
    window.removeEventListener('visibilitychange', visibilityChange);
    wb?.addEventListener('controlling', () => {
      window.location.reload();
    });
    wb?.messageSkipWaiting();
  };
  const visibilityChange = async () => {
    console.log('visibilit change', document.hidden);
    if (document.hidden) {
      if (updateAvailableRef.current && !isRestartingRef.current) {
        restartTimeoutID.current = window.setTimeout(() => {
          restart();
        }, 1000);
      }
    } else {
      if (restartTimeoutID.current) {
        window.clearTimeout(restartTimeoutID.current);
        restartTimeoutID.current = 0;
      }
      await checkForUpdates();
    }
  };
  const updateFound = (ev: WorkboxLifecycleEvent) => {
    if (
      window.navigator.userAgent.match(/iPad/i) ||
      window.navigator.userAgent.match(/iPhone/i)
    ) {
      updateAvailableRef.current = true;
    } else {
      setUpdateAvailable(true);
    }
  };
  useEffect(() => {
    if (wb) {
      wb.addEventListener('waiting', updateFound);
      window.addEventListener('visibilitychange', visibilityChange);
      return () => {
        wb.removeEventListener('waiting', updateFound);
        window.removeEventListener('visibilitychange', visibilityChange);
      };
    }
  }, [wb]);
  useEffect(() => {
    updateAvailableRef.current = updateAvailable;
  }, [updateAvailable]);
  useEffect(() => {
    isRestartingRef.current = restarting;
  }, [restarting]);
  return { checkForUpdates, updateAvailable, restart, restarting };
};

export default useUpdate;
