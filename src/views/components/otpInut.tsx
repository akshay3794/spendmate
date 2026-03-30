import React, { useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  TextInput,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { Fonts } from '../../utils/fonts';
import { useTheme } from '../../hooks/useTheme';
import { Themes } from '../../utils/colors';
import { Metrics } from '../../utils/metrics';

type OTPInputProps = {
  onChange: (otp: string) => void;
};

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const OTPInput = ({ onChange }: OTPInputProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const inputs = Array.from({ length: 5 }, () => useRef<TextInput>(null));

  const handlePress = (keyValue: string, index: number): void => {
    const newOtp = [...otp];

    if (keyValue === 'Backspace') {
      if (newOtp[index] === '') {
        if (index > 0) inputs[index - 1].current?.focus();
      } else {
        newOtp[index] = '';
      }
    } else if (digits.includes(keyValue)) {
      newOtp[index] = keyValue;
      if (index < 4) {
        inputs[index + 1].current?.focus();
      } else {
        Keyboard.dismiss();
      }
    }

    setOtp(newOtp);
    otpMaker(newOtp);
  };

  const otpMaker = (otpArray: string[]) => {
    const isComplete = otpArray.every(digit => digit !== '');
    const otpStr = isComplete ? otpArray.join('') : '';
    onChange(otpStr);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={inputs[index]}
            style={styles.otpInput}
            maxLength={1}
            placeholder="X"
            placeholderTextColor={theme.placeholderText}
            keyboardType="number-pad"
            value={value}
            onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) =>
              handlePress(e.nativeEvent.key, index)
            }
            onSubmitEditing={() => Keyboard.dismiss()}
            submitBehavior="submit"
          />
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme: typeof Themes.light) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    otpInput: {
      width: Metrics._50,
      height: Metrics._50,
      textAlign: 'center',
      fontSize: Fonts.text,
      borderRadius: Metrics._8,
      borderWidth: 1,
      borderColor: theme.border,
      marginHorizontal: Metrics._5,
      backgroundColor: theme.white,
      color: theme.black,
    },
    errorIcon: {
      alignItems: 'center',
      marginTop: Metrics._8,
    },
  });

export default OTPInput;
