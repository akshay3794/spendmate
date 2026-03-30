import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AllNavParamList } from './AllNavParamList';
import SplashScreen from '../views/screens/SplashScreen/SplashScreen';
import OnboardingNavigation from './OnboardingNavigation';
import DashboardNavigation from './DashboardNavigation';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHandleLogout } from '../utils/handleLogout';

const Stack = createStackNavigator<AllNavParamList>();

const AppNavigator = () => {
  const handleLogout = useHandleLogout();
  useEffect(() => {
    const logoutListener = EventRegister.addEventListener(
      'FORCE_LOGOUT',
      async () => {
        const data = await AsyncStorage.getItem('loggedIn');
        const loggedIn = data ? JSON.parse(data) : null;
        if (loggedIn) {
          await handleLogout();
        }
      },
    );

    return () => {
      EventRegister.removeEventListener(logoutListener as any);
    };
  }, [handleLogout]);
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
