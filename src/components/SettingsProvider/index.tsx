import { createContext, useContext, useState, useEffect } from 'react';
import { SettingsItems } from './types';
import { get, set } from 'idb-keyval'; // Import idb-keyval package

const defaultSettings: SettingsItems = {
  useSystemTheme: true,
  darkModeOverride: false,
  useLocation: true,
  useNotifications: false,
  lowDataMode: false,
  favouriteStop: '6TRxDIF8NDpofem64867',
  rainbowNav: false,
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

  useEffect(() => {
    loadSettingsFromIDB();
  }, []);

  const setValue = <K extends keyof SettingsItems>(
    name: K,
    value: SettingsItems[K]
  ) => {
    const updatedSettings = { ...state, [name]: value };
    setState(updatedSettings);
    setSettingsToIDB(updatedSettings);
  };

  const setSettingsToIDB = async (settings: SettingsItems) => {
    try {
      await set('settings', settings);
    } catch (error) {
      console.error('Error saving settings to IndexedDB:', error);
    }
  };

  const loadSettingsFromIDB = async () => {
    try {
      const savedSettings = await get('settings');
      if (savedSettings !== undefined && savedSettings !== null) {
        setState(savedSettings);
        console.log(savedSettings, 'settings loaded from IndexedDB');
      }
    } catch (error) {
      console.error('Error loading settings from IndexedDB:', error);
    }
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
