import React, { ReactNode, useMemo } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Themes } from '../../utils/colors';
import { useTheme } from '../../hooks/useTheme';
import { Fonts } from '../../utils/fonts';

type Props = {
  style?: StyleProp<TextStyle>;
  children: ReactNode;
  onTextPress?: () => void;
};

const CommonText = ({ style, children, onTextPress }: Props) => {
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Text
      allowFontScaling={false}
      style={[styles.text, style]}
      onPress={onTextPress}
    >
      {children}
    </Text>
  );
};

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    text: {
      fontFamily: 'PoppinsRegular',
      fontSize: Fonts.smallText,
      color: theme.black,
    },
  });

export default CommonText;
