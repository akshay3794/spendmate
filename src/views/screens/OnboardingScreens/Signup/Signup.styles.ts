import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { moderateScale } from 'react-native-size-matters';
import { Fonts } from '../../../../utils/fonts';

export const getStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      padding: moderateScale(15),
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: Fonts.title,
      fontFamily: 'PoppinsSemiBold',
    },
    subContainer: {
      fontSize: Fonts.smallText,
      marginBottom: moderateScale(20),
      textAlign: 'center',
    },
    footer: {
      marginTop: moderateScale(20),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    footerText: {},
    signup: {
      color: theme.primary,
      fontFamily: 'PoppinsSemiBold',
    },
  });
};
