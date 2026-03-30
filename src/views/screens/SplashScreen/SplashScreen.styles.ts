import { StyleSheet } from 'react-native';
import { Fonts } from '../../../utils/fonts';
import { useTheme } from '../../../hooks/useTheme';
import { Metrics } from '../../../utils/metrics';

export const getStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: Fonts.extraLargeText,
      color: theme.primary,
      fontFamily: 'PoppinsSemiBold',
    },
    logo: {
      width: Metrics._150,
      height: Metrics._150,
    },
  });
};
