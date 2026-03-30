import React, { useMemo } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { Themes } from '../../utils/colors';
import { useTheme } from '../../hooks/useTheme';

type ContainerProps = {
  children: React.ReactNode;
  boxStyle?: ViewStyle;
  contentStyle?: ViewStyle;
};

const Container: React.FC<ContainerProps> = ({
  children,
  boxStyle,
  contentStyle,
}) => {
  const { theme, effectiveTheme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleContainerPress = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleContainerPress}>
      <View style={[styles.flex, styles.background]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView
            style={[styles.flex, boxStyle]}
            contentContainerStyle={[styles.contentContainer, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    background: {
      backgroundColor: theme.background,
    },
    contentContainer: {
      flexGrow: 1,
    },
  });

export default Container;
