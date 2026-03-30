import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  KeyboardTypeOptions,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import CommonText from './commonText';
import { Fonts } from '../../utils/fonts';
import { Themes } from '../../utils/colors';
import { useTheme } from '../../hooks/useTheme';
import { Eye, EyeOff } from 'lucide-react-native';

type CustomTextInputProps = {
  label: string;
  value: string;
  onChangeText?: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
  editable?: boolean;
  blurOnSubmit?: boolean;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCorrect?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?:
    | 'off'
    | 'name'
    | 'email'
    | 'username'
    | 'password'
    | 'tel'
    | 'street-address'
    | 'postal-code'
    | 'cc-number';
  error?: string;
  success?: boolean;
  onSubmit?: () => void;
  onPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
} & Omit<TextInputProps, 'onChangeText'>;

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(
  (
    {
      label,
      value,
      onChangeText,
      keyboardType = 'default',
      editable = true,
      blurOnSubmit = false,
      placeholder = '',
      secureTextEntry = false,
      autoCorrect = true,
      autoCapitalize = 'none',
      autoComplete = 'off',
      error = '',
      onSubmit,
      onPress,
      multiline = false,
      numberOfLines = 1,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isSecure, setIsSecure] = useState(secureTextEntry);

    const { theme } = useTheme();

    const styles = useMemo(() => createStyles(theme), [theme]);

    const toggleSecureEntry = useCallback(() => {
      setIsSecure(prev => !prev);
    }, []);

    return (
      <View style={styles.inputGroup}>
        <CommonText style={styles.label}>{label}</CommonText>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => onPress && onPress()}
            activeOpacity={0.8}
            style={{
              flex: 1,
            }}
          >
            <TextInput
              ref={ref}
              value={value}
              onChangeText={onChangeText}
              keyboardType={keyboardType}
              editable={editable}
              placeholder={placeholder}
              placeholderTextColor={theme.placeholderText}
              secureTextEntry={isSecure}
              autoCorrect={autoCorrect}
              autoCapitalize={autoCapitalize}
              autoComplete={autoComplete}
              multiline={multiline}
              blurOnSubmit={blurOnSubmit}
              numberOfLines={numberOfLines}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              pointerEvents={editable ? 'auto' : 'none'}
              onSubmitEditing={onSubmit}
              style={[
                styles.input,
                multiline && styles.multilineInput,
                isFocused && { borderColor: theme.primary },
              ]}
              textAlignVertical={multiline ? 'top' : 'center'}
              {...props}
            />
          </TouchableOpacity>

          {secureTextEntry && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={toggleSecureEntry}
              style={styles.eyeIcon}
            >
              {isSecure ? <EyeOff /> : <Eye />}
            </TouchableOpacity>
          )}
        </View>

        {!!error && <CommonText style={styles.error}>{error}</CommonText>}
      </View>
    );
  },
);

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    inputGroup: {
      marginBottom: moderateScale(10),
      width: '100%',
    },
    label: {
      fontSize: Fonts.text,
      marginBottom: moderateScale(8),
      color: theme.black,
      fontWeight: '400',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.white,
      borderRadius: moderateScale(5),
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: moderateScale(12),
    },
    inputIcon: {
      marginRight: moderateScale(10),
    },
    input: {
      fontSize: Fonts.text,
      color: theme.black,
      height: moderateScale(50),
      paddingRight: moderateScale(35),
    },
    multilineInput: {
      height: moderateScale(150),
      textAlignVertical: 'top',
    },
    eyeIcon: {
      padding: moderateScale(8),
    },
    error: {
      alignSelf: 'flex-end',
      color: theme.error,
      fontSize: Fonts.miniText,
      marginTop: moderateScale(4),
    },
  });

export default CustomTextInput;
