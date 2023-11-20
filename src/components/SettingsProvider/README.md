# Settings Provider

This component is a context wrapper for storing user config settings.
Allowing the config values to be read/updated easily throughout the app.

## Usage

The main SettingsProvider component should be rendered closest to the top of the component tree.
All the components which needs access to the settings context should be rendered as a child of SettingsProvider.

```tsx
const App = () => {
  return (
    <>
      <SettingsProvider>
        <AppLayout></AppLayout>
      </SettingsProvider>
    </>
  );
};
```

### useSettings Hook

This hook can be used anywhere in the SettingsProvider to read/update the settings data.

```tsx
const AppLayout = () => {
  const settings = useSettings();
  return (
    <>
      <ThemeProvider darkMode={settings.darkModeEnabled}>
        <Toggle
          onChange={(checked) => {
            settings.setValue(SettingsItemsNames.DarkModeEnabled, checked);
          }}
        />
      </ThemeProvider>
    </>
  );
};
```

### Types

When adding new settings items or updating the existing ones, you must update all the types.

This interface represents all settings items and their expected types.

```ts
export interface SettingsItems {
  useSystemTheme: boolean;
  darkModeOverride: boolean;
}
```

String names for each settings items, this is used for setting a settings item value.

```ts
export enum SettingsItemsNames {
  UseSystemTheme = 'useSystemTheme',
  DarkModeOverride = 'darkModeOverride',
}
```

This object stores the default values for each settings item, these are used on first startup, or if the value cannot be found in the localdb.

```ts
const defaultSettings: SettingsItems = {
  useSystemTheme: true,
  darkModeOverride: false,
};
```
