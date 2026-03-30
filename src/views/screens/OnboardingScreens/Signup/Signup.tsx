import { View, Keyboard, TextInput } from 'react-native';
import React, { useRef } from 'react';
import Container from '../../../components/container';
import CommonText from '../../../components/commonText';
import { getStyles } from './Signup.styles';
import CustomTextInput from '../../../components/customInput';
import CommonButton from '../../../components/commonButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { AllNavParamList } from '../../../../navigation/AllNavParamList';
import * as Yup from 'yup';
import {
  emailRegex,
  nameRegex,
  passwordRegex,
  phoneRegex,
} from '../../../../utils/regex';
import { Formik } from 'formik';
import { useTheme } from '../../../../hooks/useTheme';

type NavigationProp = StackNavigationProp<AllNavParamList, 'SignUp'>;
type Props = {
  navigation: NavigationProp;
};

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(nameRegex, 'Enter valid Name')
    .required('Required'),
  email: Yup.string()
    .matches(emailRegex, 'Enter valid email')
    .required('Required'),
  phone: Yup.string()
    .max(10)
    .matches(phoneRegex, 'Enter valid phone number')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Minimum 8 characters')
    .matches(
      passwordRegex,
      'Must include uppercase, lowercase, number, special character',
    )
    .required('Required'),
});

const Signup = ({ navigation }: Props) => {
  const styles = getStyles();

  const { theme } = useTheme();

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);

  const handleFormSubmit = async (values: any, actions: any) => {
    Keyboard.dismiss();
  };

  return (
    <Container contentStyle={styles.container}>
      <CommonText style={styles.title}>Let's Get Started!</CommonText>
      <CommonText style={styles.subContainer}>
        Create an account to get all the features
      </CommonText>
      <Formik
        initialValues={{
          name: '',
          email: '',
          phone: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => handleFormSubmit(values, actions)}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <>
            <CustomTextInput
              value={values.name}
              label="Name"
              placeholder="Enter your full name"
              onChangeText={handleChange('name')}
              returnKeyType="next"
              error={touched.name && errors.name ? errors.name : undefined}
              onSubmit={() => emailRef.current?.focus()}
            />
            <CustomTextInput
              ref={emailRef}
              value={values.email}
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              onChangeText={handleChange('email')}
              returnKeyType="next"
              error={touched.email && errors.email ? errors.email : undefined}
              onSubmit={() => phoneRef.current?.focus()}
            />
            <CustomTextInput
              ref={phoneRef}
              value={values.phone}
              label="Phone"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              onChangeText={handleChange('phone')}
              maxLength={10}
              returnKeyType="next"
              error={touched.phone && errors.phone ? errors.phone : undefined}
              onSubmit={() => passRef.current?.focus()}
            />
            <CustomTextInput
              ref={passRef}
              value={values.password}
              label="Password"
              secureTextEntry={true}
              placeholder="Enter your password"
              onChangeText={handleChange('password')}
              returnKeyType="next"
              error={
                touched.password && errors.password
                  ? errors.password
                  : undefined
              }
              onSubmit={() => handleSubmit()}
            />
            <CommonButton
              label="Sign Up"
              onPress={() => handleSubmit()}
              fullWidth={true}
            />
          </>
        )}
      </Formik>
      <View style={styles.footer}>
        <CommonText style={styles.footerText}>
          Already have an account?{' '}
        </CommonText>
        <CommonText
          onTextPress={() => navigation.goBack()}
          style={styles.signup}
        >
          Login
        </CommonText>
      </View>
    </Container>
  );
};

export default Signup;
