import { set } from 'idb-keyval';
import { createContext, useContext, useState } from 'react';
import { SettingsItems } from './types';

const defaultSettings: SettingsItems = {
  useSystemTheme: true,
  darkModeOverride: false,
  useLocation: true,
  useNotifications: false,
};

interface ContextState extends SettingsItems {
  setValue: <K extends keyof SettingsItems>(
    name: K,
    value: SettingsItems[K]
  ) => void;
}

const SettingsContext = createContext<ContextState>({
  ...defaultSettings,
  setValue: () => {},
});

const SettingsProvider = ({ children }: any) => {
  const [state, setState] = useState<SettingsItems>(defaultSettings);
  const setValue = <K extends keyof SettingsItems>(
    name: K,
    value: SettingsItems[K]
  ) => {
    setState((oldValue: any) => ({ ...oldValue, [name]: value }));
    set(name, value);
  };

  const value: ContextState = { ...state, setValue };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): ContextState => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsProvider;
