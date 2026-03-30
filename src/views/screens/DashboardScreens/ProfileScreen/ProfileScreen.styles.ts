import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';

export const getStyles = () => {
  const { theme } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });
};
