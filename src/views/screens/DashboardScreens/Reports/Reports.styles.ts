import { StyleSheet } from 'react-native';
import { useTheme } from '../../../../hooks/useTheme';
import { moderateScale } from 'react-native-size-matters';
import { Fonts } from '../../../../utils/fonts';

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
      padding: moderateScale(15),
    },
    switchContainer: {
      flexDirection: 'row',
      width: '100%',
      height: moderateScale(50),
      borderRadius: moderateScale(25),
      backgroundColor: theme.primaryLight,
      marginBottom: moderateScale(20),
      padding: moderateScale(4),
    },
    switch: {
      width: '50%',
      height: '100%',
      borderRadius: moderateScale(40),
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeSwitch: {
      backgroundColor: theme.primary,
    },
    inactiveSwitch: {
      backgroundColor: theme.primaryLight,
    },
    selectedText: {
      fontFamily: 'PoppinsSemiBold',
      color: theme.white,
    },
    row: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    filterRow: {
      gap: moderateScale(12),
      alignItems: 'flex-start',
      zIndex: 30,
    },
    filterField: {
      flex: 1,
    },
    card: {
      backgroundColor: theme.white,
      borderRadius: moderateScale(16),
      padding: moderateScale(16),
      marginBottom: moderateScale(16),
      shadowColor: theme.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: Fonts.text,
      fontFamily: 'PoppinsSemiBold',
      marginBottom: moderateScale(6),
    },
    sectionSubtitle: {
      color: theme.grey,
      marginBottom: moderateScale(16),
    },
    chartScrollContent: {
      paddingRight: moderateScale(12),
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: moderateScale(30),
    },
    emptyText: {
      color: theme.grey,
      textAlign: 'center',
    },
    statsRow: {
      flexDirection: 'row',
      gap: moderateScale(12),
      marginBottom: moderateScale(16),
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.primaryLight,
      borderRadius: moderateScale(14),
      padding: moderateScale(14),
    },
    statLabel: {
      color: theme.grey,
      marginBottom: moderateScale(4),
    },
    statValue: {
      fontSize: Fonts.largeText,
      fontFamily: 'PoppinsSemiBold',
      color: theme.primary,
    },
    chartLegendList: {
      marginTop: moderateScale(16),
      gap: moderateScale(10),
    },
    legendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    legendInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: moderateScale(12),
    },
    legendDot: {
      width: moderateScale(10),
      height: moderateScale(10),
      borderRadius: moderateScale(5),
      marginRight: moderateScale(10),
    },
    legendLabel: {
      flex: 1,
    },
    legendValue: {
      fontFamily: 'PoppinsSemiBold',
    },
    budgetInfo: {
      marginBottom: moderateScale(16),
    },
    budgetHeading: {
      fontFamily: 'PoppinsSemiBold',
      marginBottom: moderateScale(4),
    },
    budgetMeta: {
      color: theme.grey,
    },
  });
};
