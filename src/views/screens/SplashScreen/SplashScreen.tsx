import { BackHandler, Image, StatusBar, View } from 'react-native';
import React, { useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import CommonText from '../../components/commonText';
import { AllNavParamList } from '../../../navigation/AllNavParamList';
import { getStyles } from './SplashScreen.styles';
import { useTheme } from '../../../hooks/useTheme';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../../store/slices/authSlice';
import BiometricService from '../../../services/BiometricService';
import { Logo } from '../../../assets/images';

type NavigationProp = StackNavigationProp<AllNavParamList, 'SplashScreen'>;
type Props = {
  navigation: NavigationProp;
};

export default function SplashScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const styles = getStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNavigation();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (routeName: keyof AllNavParamList) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      }),
    );
  };

  const handleNavigation = async () => {
    try {
      const storageData = await AsyncStorage.multiGet([
        'userData',
        'token',
        'loggedIn',
      ]);
      const userDataRaw = storageData[0][1];
      const token = storageData[1][1];
      const loggedIn = storageData[2][1];

      const isLoggedIn = loggedIn === 'true';

      if (isLoggedIn && token) {
        const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
        dispatch(setUser(userData));
        dispatch(setToken(token));

        const isBiometricEnabled = await BiometricService.isBiometricEnabled();
        const { available } = await BiometricService.isBiometricAvailable();

        if (!isBiometricEnabled || !available) {
          navigateTo('Dashboard');
          return;
        }

        const biometricResult =
          await BiometricService.authenticateWithBiometrics();

        if (biometricResult.success) {
          navigateTo('Dashboard');
        } else if (biometricResult.cancelled) {
          BackHandler.exitApp();
        } else {
          navigateTo('Onboarding');
        }
      } else {
        navigateTo('Onboarding');
      }
    } catch (error) {
      console.error('Navigation Error:', error);
      navigateTo('Onboarding');
    }
  };

  return (
    <>
      <StatusBar backgroundColor={theme.background} barStyle={'dark-content'} />
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo} />
        <CommonText style={styles.title}>Spend Mate</CommonText>
      </View>
    </>
  );
}
