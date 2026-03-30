import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

let pendingNotificationNavigation = false;

export function navigateToNotificationScreen() {
  if (!navigationRef.isReady()) {
    pendingNotificationNavigation = true;
    return;
  }

  pendingNotificationNavigation = false;
  navigationRef.dispatch(
    CommonActions.navigate({
      name: 'Dashboard',
      params: {
        screen: 'HomeStack',
        params: {
          screen: 'NotificationScreen',
        },
      },
    }),
  );
}

export function flushPendingNotificationNavigation() {
  if (pendingNotificationNavigation) {
    navigateToNotificationScreen();
  }
}
