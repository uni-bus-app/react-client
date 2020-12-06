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
  const onPanelLoad = (motionValue: MotionValue<number>) => {
    setValue(motionValue);
  };
  const [stops, setStops] = useState([]);
  const [currentStop, setCurrentStop] = useState<Stop>();
  useEffect(() => {
    const getData = async () => {
      const res = await getStops();
      setStops(res);
    };
    getData();
  }, []);
  const selectStop = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCurrentStop(event.target.value as Stop);
  };
  return (
    // <div className="App">
    <>
      <Map
        position={{ lat: 50.794236, lng: -1.075 }}
        padding={{ bottom: 812 / 2 }}
        logoPosition={value}
        stopMarkersEnabled={true}
        routeOverlayEnabled={true}
        currentStop={currentStop}
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
    </>
    // </div>
  );
}

export default App;
