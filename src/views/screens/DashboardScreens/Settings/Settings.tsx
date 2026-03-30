import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { getStyles } from './Settings.styles';
import Header from '../../../components/header';
import SettingsCard from '../../../components/settingsCard';
import BiometricService from '../../../../services/BiometricService';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AllNavParamList } from '../../../../navigation/AllNavParamList';
import { logoutApi } from '../../../../api/auth/authAPI';
import { logout } from '../../../../store/slices/authSlice';
import { CommonActions } from '@react-navigation/native';

type Props = {
  navigation: BottomTabNavigationProp<AllNavParamList, 'Setting'>;
};

const Settings = ({ navigation }: Props) => {
  const styles = getStyles();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onLogoutPress = () => {
    Alert.alert('Spendmate', 'Are you sure you want to logout?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => handleLogout() },
    ]);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutApi();
      dispatch(logout());
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter(key => key !== 'loginDetails');
      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
      }
      await BiometricService.resetBiometric();
      Toast.show({ text1: 'Spendmate', text2: 'Logged out', type: 'success' });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        }),
      );
    } catch (error: any) {
      Toast.show({ text1: 'Spendmate', text2: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header label={'Settings'} showBackButton={false} />
      <ScrollView contentContainerStyle={styles.subContainer}>
        <SettingsCard title="Profile" onPress={() => {}} />
        <SettingsCard
          title="Change Currency"
          onPress={() => navigation.navigate('Currency')}
        />
        <SettingsCard
          title="Logout"
          onPress={() => onLogoutPress()}
          showLine={false}
          showIcon={false}
        />
      </ScrollView>
    </View>
  );
};

export default Settings;
