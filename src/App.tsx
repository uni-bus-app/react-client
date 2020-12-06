import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { MotionValue } from 'framer-motion';
import logo from './logo.svg';
import './App.css';
import { Map } from './components/Map/Map';
import { NewPanelComponent } from './components/NewPanel/NewPanel';
import Home from './components/Home/Home';
import { Stop } from './models/stop';
import { TimesListComponent } from './components/TimesList/TimesList';
import StopView from './components/StopView/StopView';
import Settings from './components/Settings/Settings';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

function App() {
  const [value, setValue] = useState<MotionValue<number>>(new MotionValue(0));
  const [currentStop, setCurrentStop] = useState<Stop>();
  const onPanelLoad = (motionValue: MotionValue<number>) => {
    setValue(motionValue);
  };
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const handleDarkModeChange = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setDarkMode(checked);
  };
  const onMarkerSelect = (stop: Stop) => {
    console.log(stop);
    setCurrentStop(stop);
  };

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  return (
    // <div className="App">
    <>
      <ThemeProvider theme={theme}>
        <Map
          position={{ lat: 50.794236, lng: -1.075 }}
          padding={{ bottom: 812 / 2 }}
          logoPosition={value}
          stopMarkersEnabled={true}
          routeOverlayEnabled={true}
          darkModeEnabled={darkMode}
          currentStop={currentStop}
          onMarkerSelect={onMarkerSelect}
        />
        <NewPanelComponent
          onLoad={onPanelLoad}
          panel1Children={
            <Router>
              <Switch>
                <Route path="/home">home</Route>
                <Route path="/stopview">stopview</Route>
              </Switch>
            </Router>
          }
          panel2Children={
            <Router>
              <Switch>
                <Route path="/stopview">stopview</Route>
                <Route path="/settings">settings</Route>
              </Switch>
            </Router>
          }
        />
      </ThemeProvider>
    </>
    // </div>
  );
}

export default App;
