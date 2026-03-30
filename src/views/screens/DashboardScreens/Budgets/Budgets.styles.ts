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
    box: {
      flex: 1,
      padding: moderateScale(15),
    },
    flx: {
      flex: 1,
    },
    subContainer: {
      flexGrow: 1,
      gap: Metrics._10,
    },
    emptyBox: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    line: {
      width: '100%',
      height: Metrics._1,
      backgroundColor: theme.grey3,
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
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
  });
};
