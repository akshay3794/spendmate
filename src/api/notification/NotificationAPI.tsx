import NetInfo from '@react-native-community/netinfo';
import apiClient from '../apiClient';
import { ENDPOINTS } from '../apiUrls';

export const getNotificationList = async ({ page }: { page?: number } = {}) => {
  const netState = await NetInfo.fetch();

  if (!netState.isConnected) {
    throw new Error('No internet connection');
  }

  try {
    const params: Record<string, any> = {};

    if (page !== undefined) params.page = page;

    const response = await apiClient.get(ENDPOINTS.notificationList, {
      params: params,
    });
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
