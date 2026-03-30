import { View, Text, Button, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getStyles } from './OtpScreen.styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { AllNavParamList } from '../../../../navigation/AllNavParamList';
import CommonText from '../../../components/commonText';
import OTPInput from '../../../components/otpInut';
import CommonButton from '../../../components/commonButton';
import Toast from 'react-native-toast-message';
import { RouteProp } from '@react-navigation/native';

type Props = {
  navigation: StackNavigationProp<AllNavParamList, 'OtpScreen'>;
  route: RouteProp<AllNavParamList, 'OtpScreen'>;
};

const OtpScreen = ({ navigation, route }: Props) => {
  const styles = getStyles();
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [showResend, setShowResend] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const { email } = route.params;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (secondsLeft > 0) {
      timer = setTimeout(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else {
      setShowResend(true);
    }

    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleResend = async () => {
    Keyboard.dismiss();
    setShowResend(false);
    setSecondsLeft(30);
    setIsLoading(true);
    try {
      // const response = await resendOtpApi(email);
      // if (response.success) {
      //   Toast.show({
      //     type: 'success',
      //     text1: 'DINKS',
      //     text2: response.message,
      //   });
      // }
    } catch (error: any) {
      const errorMessage = error?.message || 'Something went wrong.';
      Toast.show({
        type: 'error',
        text1: 'DINKS',
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    navigation.navigate('Dashboard');
    // if (!otp) {
    //   setOtpError('Please enter valid OTP');
    // } else {
    //   setIsLoading(true);
    //   try {
    //     //   const response = await verifyOtpApi(email, otp);
    //     //   if (response.data) {
    //     //     Toast.show({
    //     //       type: 'success',
    //     //       text1: 'DINKS',
    //     //       text2: response.message,
    //     //     });
    //     //     navigation.replace('ResetPassword', { email });
    //     //   }
    //   } catch (error: any) {
    //     const errorMessage = error?.message || 'Something went wrong.';
    //     Toast.show({
    //       type: 'error',
    //       text1: 'DINKS',
    //       text2: errorMessage,
    //     });
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
  };

  return (
    <View style={styles.container}>
      <CommonText style={styles.title}>Otp</CommonText>
      <CommonText style={styles.subTitle}>
        Enter Otp sent on your mobile number
      </CommonText>
      <OTPInput onChange={text => setOtp(text)} />
      <View style={styles.errorBox}>
        <CommonText style={styles.error}>{otpError}</CommonText>
      </View>
      {showResend ? (
        <View style={styles.resendBox}>
          <CommonText style={styles.resendText}>
            Didn’t receive the code?{' '}
          </CommonText>
          <CommonText
            onTextPress={() => handleResend()}
            style={styles.linkText}
          >
            Resend Code
          </CommonText>
        </View>
      ) : (
        <View style={styles.resendBox}>
          <CommonText style={styles.resendText}>
            Resend code in {secondsLeft} Sec...
          </CommonText>
        </View>
      )}
      <CommonButton
        label="Submit"
        onPress={() => handleSubmit()}
        fullWidth={true}
      />
    </View>
  );
};

export default OtpScreen;
