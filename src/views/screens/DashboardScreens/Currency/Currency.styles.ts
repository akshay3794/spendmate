import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
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
    },
  });
};
