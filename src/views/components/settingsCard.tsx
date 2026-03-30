import { TouchableOpacity, StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import CommonText from './commonText';
import { moderateScale } from 'react-native-size-matters';
import { Themes } from '../../utils/colors';
import { useTheme } from '../../hooks/useTheme';
import { Fonts } from '../../utils/fonts';
import { ChevronRight } from 'lucide-react-native';

type Props = {
  title: string;
  onPress: () => void;
  showLine?: boolean;
  showIcon?: boolean;
};

const SettingsCard = ({
  title,
  onPress,
  showLine = true,
  showIcon = true,
}: Props) => {
  const { theme, effectiveTheme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={onPress}
      >
        <CommonText style={styles.cardTitle}>{title}</CommonText>
        {showIcon && (
          <ChevronRight color={theme.black} size={moderateScale(20)} />
        )}
      </TouchableOpacity>
      {showLine && <View style={styles.line} />}
    </>
  );
};

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      height: moderateScale(50),
      paddingHorizontal: moderateScale(20),
    },
    cardTitle: {
      color: theme.grey,
      fontSize: Fonts.text,
    },
    line: {
      width: '100%',
      height: moderateScale(1),
      backgroundColor: theme.line,
    },
  });

export default SettingsCard;
