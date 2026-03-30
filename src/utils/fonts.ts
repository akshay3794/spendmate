import { Dimensions, Platform } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const Fonts = {
  headingLarge: moderateScale(36),
  heading: moderateScale(32),
  headingSmall: moderateScale(28),
  titleLarge: moderateScale(26),
  titleMedium: moderateScale(24),
  title: moderateScale(22),
  extraLargeText: moderateScale(20),
  largeText: moderateScale(18),
  text: moderateScale(16),
  smallText: moderateScale(14),
  extraSmallText: moderateScale(12),
  miniText: moderateScale(10),
  extraMiniText: moderateScale(8),
  headerHeight:
    Platform.OS === 'android' ? moderateScale(60) : moderateScale(80),
  deviceHeight: Dimensions.get('window').height,
  deviceWidth: Dimensions.get('window').width,
};
