import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { Fonts } from '../../../../utils/fonts';
import { Metrics } from '../../../../utils/metrics';

export const getStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    flx: {
      flex: 1,
    },
    subContainer: {
      flexGrow: 1,
      padding: Metrics._15,
    },
    card: {
      width: '100%',
      padding: Metrics._10,
      borderRadius: Metrics._10,
      backgroundColor: theme.white,
      alignItems: 'center',
    },
    shortCard: {
      width: '48%',
      padding: Metrics._10,
      borderRadius: Metrics._20,
      backgroundColor: theme.white,
      flexDirection: 'row',
      elevation: 5,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    title1: {
      fontSize: Fonts.smallText,
    },
    amount1: {
      fontSize: Fonts.title,
      fontFamily: 'PoppinsBold',
    },
    title2: {
      fontSize: Fonts.smallText,
      color: theme.white,
    },
    amount2: {
      fontSize: Fonts.title,
      fontFamily: 'PoppinsBold',
      color: theme.white,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: Metrics._10,
    },
    view: {
      fontSize: Fonts.smallText,
      textDecorationLine: 'underline',
      color: theme.primary,
    },

    listContentContainer: {
      flexGrow: 1,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
