import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { moderateScale } from 'react-native-size-matters';

export const getStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    subContainer: {
      padding: moderateScale(15),
    },
  });
};
