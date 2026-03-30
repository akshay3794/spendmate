import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './store/store';
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeScreen from './views/components/safeScreens';
import Toast from 'react-native-toast-message';
import Orientation from 'react-native-orientation-locker';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hydrateTheme } from './store/slices/themeSlice';
import {
  handleInitialNotificationNavigation,
  notificationListener,
  registerNotificationOpenHandlers,
  requestUserPermission,
  setupBackgroundNotificationHandler,
} from './utils/notificationService';
import {
  flushPendingNotificationNavigation,
  navigationRef,
} from './navigation/navigationService';

const AppContent = () => {
  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  useEffect(() => {
    requestUserPermission();
    setupBackgroundNotificationHandler();
    const unsubscribeForegroundMessages = notificationListener();
    const unsubscribeNotificationOpen = registerNotificationOpenHandlers();
    handleInitialNotificationNavigation();

    return () => {
      unsubscribeForegroundMessages?.();
      unsubscribeNotificationOpen?.();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <SafeScreen>
          <NavigationContainer
            ref={navigationRef}
            onReady={flushPendingNotificationNavigation}
          >
            <AppNavigator />
            <Toast position="bottom" />
          </NavigationContainer>
        </SafeScreen>
      </I18nextProvider>
    </SafeAreaProvider>
  );
};

const AppWithLogoutListener = () => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('APP_THEME');
        if (savedTheme === 'dark' || savedTheme === 'light') {
          dispatch(hydrateTheme(savedTheme));
        }
      } catch (e) {
        console.error('Failed to load theme:', e);
      } finally {
        setLoaded(true);
      }
    };

    loadTheme();
  }, [dispatch]);

  if (!loaded) return null;

  return <AppContent />;
};

const RootApp = () => {
  return (
    <Provider store={store}>
      <AppWithLogoutListener />
    </Provider>
  );
};

export default RootApp;
