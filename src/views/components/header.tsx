import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import { Themes } from '../../utils/colors';
import { moderateScale } from 'react-native-size-matters';
import CommonText from './commonText';
import { Fonts } from '../../utils/fonts';
import { useTheme } from '../../hooks/useTheme';
import { ArrowLeft, Bell, SlidersHorizontal } from 'lucide-react-native';

type Props = {
  label: String;
  showBackButton: boolean;
  onBackPress?: () => void;
  showNotificationIcon?: boolean;
  onNotificationPress?: () => void;
  showFilterIcon?: boolean;
  onFilterIconPress?: () => void;
};

const Header = ({
  label,
  showBackButton = false,
  onBackPress,
  showNotificationIcon = false,
  onNotificationPress,
  showFilterIcon = false,
  onFilterIconPress,
}: Props) => {
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.container}>
      {showBackButton ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onBackPress && onBackPress()}
          style={styles.notificationBack}
        >
          <ArrowLeft />
        </TouchableOpacity>
      ) : (
        <View style={styles.empty} />
      )}
      <CommonText style={styles.label}>{label}</CommonText>
      {showNotificationIcon ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onNotificationPress && onNotificationPress()}
          style={styles.notificationBack}
        >
          <Bell color={theme.primary} size={moderateScale(20)} />
        </TouchableOpacity>
      ) : showFilterIcon ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onFilterIconPress && onFilterIconPress()}
          style={styles.notificationBack}
        >
          <SlidersHorizontal color={theme.primary} size={moderateScale(20)} />
        </TouchableOpacity>
      ) : (
        <View style={styles.empty} />
      )}
    </View>
  );
};

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: Fonts.headerHeight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: moderateScale(16),
      backgroundColor: theme.white,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: moderateScale(1),
      },
      shadowOpacity: moderateScale(0.22),
      shadowRadius: moderateScale(2.22),
      elevation: moderateScale(3),
    },
    label: {
      fontSize: Fonts.titleMedium,
      color: theme.black,
      fontFamily: 'PoppinsSemiBold',
    },
    empty: {
      width: moderateScale(20),
    },
    notificationBack: {
      width: moderateScale(30),
      height: moderateScale(30),
      borderRadius: moderateScale(15),
      backgroundColor: theme.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Header;
