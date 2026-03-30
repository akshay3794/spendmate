import * as Keychain from 'react-native-keychain';

export const storeToken = async (token: string) => {
  await Keychain.setGenericPassword('auth', token, {
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  });
};

export const getToken = async () => {
  const credentials = await Keychain.getGenericPassword();
  return credentials ? credentials.password : null;
};

export const removeToken = async () => {
  await Keychain.resetGenericPassword();
};

export const storePin = async (pin: string) => {
  await Keychain.setInternetCredentials('pin', 'user', pin);
};

export const getStoredPin = async () => {
  const credentials = await Keychain.getInternetCredentials('pin');
  return credentials ? credentials.password : null;
};
