import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import mobileAds, { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';

const transactionSuccessAd = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

let isAdsInitialized = false;
let isTransactionAdLoaded = false;
let hasAttachedListeners = false;

const attachTransactionAdListeners = () => {
  if (hasAttachedListeners) {
    return;
  }

  transactionSuccessAd.addAdEventListener(AdEventType.LOADED, () => {
    isTransactionAdLoaded = true;
  });

  const handleClosedOrError = () => {
    isTransactionAdLoaded = false;
    transactionSuccessAd.load();
  };

  transactionSuccessAd.addAdEventListener(AdEventType.CLOSED, handleClosedOrError);
  transactionSuccessAd.addAdEventListener(AdEventType.ERROR, handleClosedOrError);

  hasAttachedListeners = true;
};

export const initializeGoogleAds = async () => {
  if (isAdsInitialized) {
    return;
  }

  try {
    if (Platform.OS === 'ios') {
      const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      if (result === RESULTS.DENIED) {
        await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      }
    }

    await mobileAds().initialize();
    attachTransactionAdListeners();
    transactionSuccessAd.load();
    isAdsInitialized = true;
  } catch (error) {
    console.warn('Failed to initialize Google Ads:', error);
  }
};

export const showTransactionSuccessAd = async () => {
  if (!isAdsInitialized) {
    return;
  }

  if (!isTransactionAdLoaded) {
    transactionSuccessAd.load();
    return;
  }

  try {
    await transactionSuccessAd.show();
  } catch (error) {
    console.warn('Failed to show transaction success ad:', error);
  }
};
