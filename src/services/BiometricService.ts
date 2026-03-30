import ReactNativeBiometrics from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

const BIOMETRIC_ENABLED_KEY = 'BIOMETRIC_ENABLED';
const BIOMETRIC_TOKEN_SERVICE = 'spendmate.biometric.token';

class BiometricService {
  async isBiometricAvailable() {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      return { available, biometryType };
    } catch (error) {
      return { available: false, biometryType: null };
    }
  }

  async triggerBiometricPropmt() {
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to login',
        cancelButtonText: 'cancel',
      });
      return success;
    } catch (error) {
      return false;
    }
  }

  async enableBiometrics(token: string) {
    await Keychain.setGenericPassword('refreshToken', token, {
      service: BIOMETRIC_TOKEN_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
    });
    await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
  }

  async isBiometricEnabled() {
    return (await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY)) === 'true';
  }

  async getStoredToken() {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: BIOMETRIC_TOKEN_SERVICE,
      });
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async authenticateWithBiometrics() {
    try {
      const result = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to continue',
        fallbackPromptMessage: 'Enter PIN',
        cancelButtonText: 'Cancel',
      });

      return result.success;
    } catch (error) {
      return false;
    }
  }

  async resetBiometric() {
    await Keychain.resetGenericPassword({ service: BIOMETRIC_TOKEN_SERVICE });
    await AsyncStorage.removeItem(BIOMETRIC_ENABLED_KEY);
  }
}

export default new BiometricService();
