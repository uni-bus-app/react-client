import { createContext, useContext, useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';

type ContextState = {
  wb?: Workbox;
  registration?: Workbox;
};

const ServiceWorkerContext = createContext<ContextState | undefined>(undefined);

interface ServiceworkerProviderProps {
  res: any;
  children: JSX.Element;
}

const ServiceWorkerProvider = (props: ServiceworkerProviderProps) => {
  const { res, children } = props;
  const [wb, setWb] = useState<Workbox>();
  const [registration, setRegistration] = useState<Workbox>();
  const thing = res.read();
  useEffect(() => {
    if (thing) {
      setWb(thing.wb);
      setRegistration(thing.reg);
    }
  }, [thing]);
  // useEffect(() => {
  //   window.setTimeout(() => {
  //     if (process.env.NODE_ENV === 'production') {
  //       const wb = new Workbox('/service-worker.js', { scope: '/' });
  //       setWb(wb);
  //       setRegistration(wb);
  //       wb.register().then((reg) => {
  //         navigator.permissions
  //           .query({ name: 'periodic-background-sync' } as any)
  //           .then((status) => {
  //             console.log(status);
  //             if (status.state === 'granted') {
  //               navigator.serviceWorker.ready.then((reg: any) => {
  //                 try {
  //                   if ('periodicSync' in reg) {
  //                     reg.periodicSync.register('sync-db', {
  //                       minInterval: 24 * 60 * 60 * 1000,
  //                     });
  //                   }
  //                 } catch (error) {
  //                   console.log(error);
  //                 }
  //               });
  //             }
  //           });
  //       });
  //     }
  //   }, 2000);
  // }, []);
  const value = { registration, wb };
  return (
    <ServiceWorkerContext.Provider value={value}>
      {children}
    </ServiceWorkerContext.Provider>
  );
};

export const useServiceWorker = (): ContextState => {
  const context = useContext(ServiceWorkerContext);
  if (context === undefined) {
    throw new Error(
      'useServiceWorker must be used within a ServiceWorkerProvider'
    );
  }
  return context;
};

export default ServiceWorkerProvider;
