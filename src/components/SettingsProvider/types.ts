export interface SettingsItems {
  useSystemTheme: boolean;
  darkModeOverride: boolean;
  useLocation: boolean;
  useNotifications: boolean;
}

export enum SettingsItemsNames {
  UseSystemTheme = 'useSystemTheme',
  DarkModeOverride = 'darkModeOverride',
  UseLocation = 'useLocation',
  UseNotifications = 'useNotifications',
}
