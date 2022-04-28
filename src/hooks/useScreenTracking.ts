import { getAnalytics, logEvent } from 'firebase/analytics';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const useScreenTracking = () => {
  const { pathname } = useLocation();
  const currentScreen = useRef<string>('');
  const currentScreenClass = useRef<string>('');
  useEffect(() => {
    const screen = pathname.replace('/', '');
    if (screen && screen !== currentScreen.current) {
      const screen_class = `app-${screen}`;
      const prevScreen = {
        firebase_previous_class: currentScreenClass.current,
        firebase_previous_screen: currentScreen.current,
      };
      logEvent(getAnalytics(), 'screen_view', {
        firebase_screen: screen,
        firebase_screen_class: screen_class,
        firebase_event_origin: 'auto',
        screen_name: screen,
        screen_class,
        outlet: 'primary',
        page_path: pathname,
        page_title: document.title,
        ...(currentScreen.current ? prevScreen : {}),
      });
      currentScreen.current = screen;
      currentScreenClass.current = screen_class;
    }
  }, [pathname]);
};

export default useScreenTracking;
