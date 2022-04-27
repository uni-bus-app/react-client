import { createContext, useContext, useEffect, useState } from 'react';

type ContextState = {
  registration?: ServiceWorkerRegistration;
};

const ServiceWorkerContext = createContext<ContextState | undefined>(undefined);

interface ServiceworkerProviderProps {
  children: JSX.Element;
  res: any;
}

const ServiceWorkerProvider = (props: ServiceworkerProviderProps) => {
  const { children, res } = props;
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>();
  const swReg = res.read();
  useEffect(() => {
    setRegistration(swReg);
  }, [swReg]);
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
