import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { moderateScale } from 'react-native-size-matters';
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
      padding: Metrics._15,
    },
    reportContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: Metrics._50,
      backgroundColor: theme.primaryLight,
      paddingHorizontal: Metrics._12,
      borderRadius: Metrics._8,
    },
    reportText: {
      color: theme.primary,
    },
    listContentContainer: {
      flexGrow: 1,
    },
    header: {
      fontSize: Fonts.largeText,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fabContainer: {
      position: 'absolute',
      right: moderateScale(20),
      bottom: moderateScale(20),
      width: moderateScale(50),
      height: moderateScale(50),
      borderRadius: moderateScale(25),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.primary,
    },
  });
};
