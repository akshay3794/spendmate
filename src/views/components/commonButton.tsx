import React, { useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import CommonText from './commonText';
import { Fonts } from '../../utils/fonts';
import { Themes } from '../../utils/colors';
import { useTheme } from '../../hooks/useTheme';

type ButtonProps = {
  fullWidth?: boolean;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
};

const CommonButton: React.FC<ButtonProps> = ({
  fullWidth = false,
  label,
  onPress,
  disabled = false,
  buttonStyle,
  textStyle,
  iconStyle,
}) => {
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const containerStyle = useMemo(
    () => [
      fullWidth ? styles.fullWidthStyle : styles.normalStyle,
      disabled && styles.disabledButton,
      buttonStyle,
    ],
    [fullWidth, disabled, buttonStyle, styles],
  );

  const labelStyle = useMemo(
    () => [
      fullWidth ? styles.fullWidthLabel : styles.label,
      disabled && styles.disabledText,
      textStyle,
    ],
    [fullWidth, disabled, textStyle, styles],
  );

  return (
    <TouchableOpacity
      style={containerStyle}
      activeOpacity={0.8}
      onPress={disabled ? undefined : onPress}
    >
      <CommonText style={labelStyle}>{label}</CommonText>
    </TouchableOpacity>
  );
};

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    fullWidthStyle: {
      ...baseButtonStyle(theme),
      width: '100%',
      height: moderateScale(50),
    },
    normalStyle: {
      ...baseButtonStyle(theme),
      paddingVertical: moderateScale(5),
      paddingHorizontal: moderateScale(8),
    },
    fullWidthLabel: {
      fontSize: Fonts.largeText,
      color: theme.buttonText,
      fontWeight: '500',
    },
    label: {
      fontSize: Fonts.smallText,
      color: theme.buttonText,
      fontWeight: '500',
    },
    disabledButton: {
      backgroundColor: theme.disabled,
      borderColor: theme.disabled,
    },
    disabledText: {
      color: theme.buttonText,
    },
  });

const baseButtonStyle = (theme: typeof Themes.light): ViewStyle => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.primary,
  shadowColor: theme.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
  borderRadius: moderateScale(10),
  marginTop: moderateScale(16),
  borderWidth: 1,
  borderColor: theme.primary,
});

export default CommonButton;
