import { createContext, useContext, useEffect, useState } from 'react';
import * as serviceWorkerRegistration from '../../serviceWorkerRegistration';

type ContextState = {
  registration?: ServiceWorkerRegistration;
};

const ServiceWorkerContext = createContext<ContextState | undefined>(undefined);

interface ServiceworkerProviderProps {
  children: JSX.Element;
}

const ServiceWorkerProvider = (props: ServiceworkerProviderProps) => {
  const { children } = props;
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>();
  useEffect(() => {
    serviceWorkerRegistration.register({
      onSuccess(registration) {
        setRegistration(registration);
      },
      onUpdate(registration) {},
    });
  }, []);
  const value = { registration };
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
