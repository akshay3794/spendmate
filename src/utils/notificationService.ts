import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, PermissionsAndroid, Platform } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { navigateToNotificationScreen } from '../navigation/navigationService';

let foregroundUnsubscribe: (() => void) | undefined;
let openedAppUnsubscribe: (() => void) | undefined;
const PENDING_NOTIFICATION_NAVIGATION = 'PENDING_NOTIFICATION_NAVIGATION';

async function markPendingNotificationNavigation() {
  await AsyncStorage.setItem(PENDING_NOTIFICATION_NAVIGATION, 'true');
}

async function consumePendingNotificationNavigation() {
  const shouldNavigate = await AsyncStorage.getItem(
    PENDING_NOTIFICATION_NAVIGATION,
  );

  if (shouldNavigate === 'true') {
    await AsyncStorage.removeItem(PENDING_NOTIFICATION_NAVIGATION);
    navigateToNotificationScreen();
    return true;
  }

  return false;
}

export async function requestUserPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export async function getFCMToken() {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  return token;
}

async function createNotificationChannel() {
  return notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
}

export function notificationListener() {
  foregroundUnsubscribe?.();
  foregroundUnsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('Foreground Message:', remoteMessage);

    await displayNotification(remoteMessage);
  });

  return foregroundUnsubscribe;
}

async function displayNotification(remoteMessage: any) {
  const channelId = await createNotificationChannel();

  await notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
}

export async function setupBackgroundNotificationHandler() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in background!', remoteMessage);
    await displayNotification(remoteMessage);
  });
}

notifee.onBackgroundEvent(async ({ type }) => {
  if (type === EventType.PRESS) {
    await markPendingNotificationNavigation();
  }
});

export function registerNotificationOpenHandlers() {
  openedAppUnsubscribe?.();
  openedAppUnsubscribe = messaging().onNotificationOpenedApp(() => {
    navigateToNotificationScreen();
  });

  const foregroundEventUnsubscribe = notifee.onForegroundEvent(({ type }) => {
    if (type === EventType.PRESS) {
      navigateToNotificationScreen();
    }
  });

  const appStateSubscription = AppState.addEventListener(
    'change',
    nextAppState => {
      if (nextAppState === 'active') {
        consumePendingNotificationNavigation();
      }
    },
  );

  return () => {
    openedAppUnsubscribe?.();
    openedAppUnsubscribe = undefined;
    foregroundEventUnsubscribe();
    appStateSubscription.remove();
  };
}

export async function handleInitialNotificationNavigation() {
  const hasPendingNavigation = await consumePendingNotificationNavigation();
  if (hasPendingNavigation) {
    return;
  }

  const initialNotification = await notifee.getInitialNotification();
  if (initialNotification) {
    navigateToNotificationScreen();
    return;
  }

  const initialRemoteMessage = await messaging().getInitialNotification();
  if (initialRemoteMessage) {
    navigateToNotificationScreen();
  }
}
