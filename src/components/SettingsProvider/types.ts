export interface SettingsItems {
  useSystemTheme: boolean;
  darkModeOverride: boolean;
  useLocation: boolean;
  useNotifications: boolean;
  favouriteStop: string | null;
  lowDataMode: boolean;
  rainbowNav: boolean;
  initialSetup: boolean;
}

export enum SettingsItemsNames {
  UseSystemTheme = 'useSystemTheme',
  DarkModeOverride = 'darkModeOverride',
  UseLocation = 'useLocation',
  UseNotifications = 'useNotifications',
  favouriteStop = 'favouriteStop',
  lowDataMode = 'lowDataMode',
  rainbowNav = 'rainbowNav',
  initialSetup = 'initialSetup',
}
