import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Fonts } from '../../../../utils/fonts';
import { useTheme } from '../../../../hooks/useTheme';

export const getStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      padding: moderateScale(15),
      alignItems: 'center',
      justifyContent: 'center',
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
    forgotText: {
      width: '100%',
      textAlign: 'right',
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
