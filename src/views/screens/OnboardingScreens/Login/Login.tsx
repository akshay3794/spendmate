import { Alert, Keyboard, Platform } from 'react-native';
import React, { useState } from 'react';
import { getStyles } from './Login.styles';
import CommonText from '../../../components/commonText';
import CustomTextInput from '../../../components/customInput';
import CommonButton from '../../../components/commonButton';
import Container from '../../../components/container';
import { StackNavigationProp } from '@react-navigation/stack';
import { AllNavParamList } from '../../../../navigation/AllNavParamList';
import { Formik, FormikHelpers } from 'formik';
import { loginApi } from '../../../../api/auth/authAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../../../../store/slices/authSlice';
import Loader from '../../../components/loader';
import BiometricService from '../../../../services/BiometricService';
import { loginSchema } from '../../../../utils/validationSchemas';
import { getFCMToken } from '../../../../utils/notificationService';

type Props = {
  navigation: StackNavigationProp<AllNavParamList, 'Login'>;
};

type FormProps = {
  mobileNumber: string;
};

const Login = ({ navigation }: Props) => {
  const styles = getStyles();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleFormSubmit = async (
    values: FormProps,
    actions: FormikHelpers<FormProps>,
  ) => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const token = await getFCMToken();
      console.log('token - ', token);

      const request = {
        phone_number: values.mobileNumber,
        device_token: token,
        device_type: Platform.OS,
      };
      const response = await loginApi(request);
      if (response.success) {
        const authToken = response.access_token || response.refreshToken;

        await AsyncStorage.multiSet([
          ['userData', JSON.stringify(response.data)],
          ['token', authToken],
          ['loggedIn', 'true'],
        ]);
        dispatch(setUser(response?.data));
        dispatch(setToken(authToken));
        Toast.show({
          type: 'success',
          text1: 'Spendmate',
          text2: response.message,
        });
        await handleLoginSuccess(authToken);
        actions.resetForm();
        navigation.navigate('Dashboard');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (authToken: string) => {
    try {
      const { available, biometryType } =
        await BiometricService.isBiometricAvailable();

      if (!available || !authToken) {
        await BiometricService.resetBiometric();
        return;
      }

      const shouldEnableBiometrics = await promptForBiometricEnable(
        biometryType,
      );

      if (!shouldEnableBiometrics) {
        await BiometricService.resetBiometric();
        return;
      }

      const biometricResult =
        await BiometricService.authenticateWithBiometrics();

      if (biometricResult.success) {
        await BiometricService.enableBiometrics(authToken);
      } else {
        await BiometricService.resetBiometric();
      }
    } catch (error) {
      console.log('Biometric setup error:', error);
    }
  };

  const promptForBiometricEnable = async (
    biometryType: string | null | undefined,
  ) => {
    const biometricLabel =
      biometryType === 'FaceID'
        ? 'Face ID'
        : biometryType === 'TouchID'
          ? 'Touch ID'
          : 'biometric login';

    return new Promise<boolean>(resolve => {
      Alert.alert(
        'Spendmate',
        `Do you want to enable ${biometricLabel} for future logins?`,
        [
          {
            text: 'Not now',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'Enable',
            onPress: () => resolve(true),
          },
        ],
        {
          cancelable: false,
        },
      );
    });
  };

  return (
    <Container contentStyle={styles.container}>
      <CommonText style={styles.title}>Welcome Back</CommonText>
      <CommonText style={styles.subTitle}>Log into existing account</CommonText>
      <Formik
        initialValues={{
          mobileNumber: '',
        }}
        validationSchema={loginSchema}
        onSubmit={(values, actions) => handleFormSubmit(values, actions)}
      >
        {({ values, touched, handleSubmit, handleChange, errors }) => (
          <>
            <CustomTextInput
              value={values.mobileNumber}
              placeholder="Enter your mobile number"
              error={
                touched.mobileNumber && errors.mobileNumber
                  ? errors.mobileNumber
                  : undefined
              }
              label="Mobile Number"
              keyboardType="phone-pad"
              onChangeText={handleChange('mobileNumber')}
              onSubmitEditing={() => handleSubmit()}
              returnKeyType="done"
            />
            <CommonButton
              label="Login"
              onPress={() => handleSubmit()}
              fullWidth={true}
            />
          </>
        )}
      </Formik>
      {loading && <Loader show={loading} />}
    </Container>
  );
};

export default Login;
