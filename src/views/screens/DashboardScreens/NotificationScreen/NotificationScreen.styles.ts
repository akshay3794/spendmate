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
    subContainer: {
      flex: 1,
      padding: Metrics._16,
    },
    flx: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      gap: Metrics._8,
    },
    card: {
      backgroundColor: theme.white,
      borderRadius: Metrics._12,
      padding: Metrics._14,
      gap: Metrics._6,
    },
    title: {
      fontSize: Fonts.smallText,
      color: theme.black,
    },
    message: {
      color: theme.grey,
      lineHeight: Metrics._20,
    },
    timestamp: {
      fontSize: Fonts.extraSmallText,
      color: theme.grey,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    footerContainer: {
      paddingVertical: Metrics._12,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
