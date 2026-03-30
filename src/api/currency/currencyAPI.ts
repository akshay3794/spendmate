import NetInfo from '@react-native-community/netinfo';
import apiClient from '../apiClient';
import { ENDPOINTS } from '../apiUrls';

export const getCurrencyList = async () => {
  const netState = await NetInfo.fetch();

  if (!netState.isConnected) {
    throw new Error('No internet connection');
  }

  try {
    const response = await apiClient.get(ENDPOINTS.currency);
    return response.data;
  } catch (error: any) {
    if (error.response.status === 422) {
      let errors = error?.response?.data?.errors;
      throw new Error(errors);
    } else {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    }
  }
};

export const getUserCurrency = async () => {
  const netState = await NetInfo.fetch();

  if (!netState.isConnected) {
    throw new Error('No internet connection');
  }

  try {
    const response = await apiClient.get(ENDPOINTS.userCurrency);
    return response.data;
  } catch (error: any) {
    if (error.response.status === 422) {
      let errors = error?.response?.data?.errors;
      throw new Error(errors);
    } else {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    }
  }
};

export const saveUserCurrency = async (data: any) => {
  const netState = await NetInfo.fetch();

  if (!netState.isConnected) {
    throw new Error('No internet connection');
  }

  try {
    const response = await apiClient.post(ENDPOINTS.saveCurrency, data);
    return response.data;
  } catch (error: any) {
    if (error.response.status === 422) {
      let errors = error?.response?.data?.errors;
      throw new Error(errors);
    } else {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    }
  }
};
