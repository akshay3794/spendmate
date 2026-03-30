import NetInfo from '@react-native-community/netinfo';
import apiClient from '../apiClient';
import { ENDPOINTS } from '../apiUrls';

export const formatErrorMessages = (
  errorObj: Record<string, string | string[]>,
): string => {
  if (!errorObj || typeof errorObj !== 'object') return '';

  const fields = Object.keys(errorObj);
  if (fields.length === 0) return '';

  // If there's only one error, return it as-is
  if (fields.length === 1) {
    const singleError = errorObj[fields[0]];
    return Array.isArray(singleError) ? singleError[0] : singleError;
  }

  const firstMsg = Array.isArray(errorObj[fields[0]])
    ? (errorObj[fields[0]] as string[])[0]
    : (errorObj[fields[0]] as string);

  // Remove leading "The email has / This email has"
  const baseMessage = firstMsg.replace(
    /^(This|The)\s+[\w_]+\s+(has|have)\s+/i,
    '',
  );

  // Format field names: email, partner 2 email
  const formattedFields = fields
    .map(field => field.replace(/_/g, ' '))
    .join(' and ');

  return `The ${formattedFields} have ${baseMessage}`;
};

export const getBudgetList = async ({
  page,
  year,
  month,
}: {
  page: Number;
  year?: Number;
  month?: Number;
}) => {
  const netState = await NetInfo.fetch();

  if (!netState.isConnected) {
    throw new Error('No internet connection');
  }

  try {
    const params: Record<string, any> = {};

    if (page !== undefined) params.page = page;
    if (year) params.year = year;
    if (month) params.month = month;

    const response = await apiClient.get(ENDPOINTS.budgetList, { params });
    return response.data;
  } catch (error: any) {
    if (error.response.status === 422) {
      let errors = error?.response?.data?.errors;
      let newErr = formatErrorMessages(errors);
      throw new Error(newErr);
    } else {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    }
  }
};
export const createBudgetApi = async (data: any) => {
  const netState = await NetInfo.fetch();

  if (!netState.isConnected) {
    throw new Error('No internet connection');
  }

  try {
    const response = await apiClient.post(ENDPOINTS.createBudget, data);
    return response.data;
  } catch (error: any) {
    if (error.response.status === 422) {
      let errors = error?.response?.data?.errors;
      let newErr = formatErrorMessages(errors);
      throw new Error(newErr);
    } else {
      throw new Error(error?.response?.data?.message ?? 'Something went wrong');
    }
  }
};
