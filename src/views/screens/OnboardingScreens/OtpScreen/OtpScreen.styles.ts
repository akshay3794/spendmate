import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Fonts } from '../../../../utils/fonts';
import { useTheme } from '../../../../hooks/useTheme';
import { Metrics } from '../../../../utils/metrics';

export const getStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: moderateScale(15),
      alignItems: 'center',
    },
    title: {
      fontSize: Fonts.titleLarge,
      color: theme.primary,
      fontFamily: 'PoppinsSemiBold',
    },
    subTitle: {
      fontSize: Fonts.text,
      color: theme.black,
      marginBottom: moderateScale(40),
    },
    resendBox: {
      flexDirection: 'row',
      marginTop: Metrics._20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    resendText: {
      color: theme.grey,
    },
    linkText: {
      fontSize: Fonts.text,
      color: theme.primary,
    },
    errorBox: {
      width: '100%',
      marginTop: Metrics._15,
      alignItems: 'flex-end',
    },
    error: {
      fontSize: Fonts.miniText,
      color: theme.error,
    },
  });
};
