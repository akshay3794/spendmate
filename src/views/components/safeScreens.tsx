import React, { ReactNode, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { Themes } from '../../utils/colors';

type Props = {
  children: ReactNode;
};

export default function SafeScreen({ children }: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
}

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });
