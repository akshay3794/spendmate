import { createStackNavigator } from '@react-navigation/stack';
import { AllNavParamList } from './AllNavParamList';
import Login from '../views/screens/OnboardingScreens/Login/Login';
import Signup from '../views/screens/OnboardingScreens/Signup/Signup';
import OtpScreen from '../views/screens/OnboardingScreens/OtpScreen/OtpScreen';

const Stack = createStackNavigator<AllNavParamList>();

export default () => {
  return (
    <Stack.Navigator
      initialRouteName={'Login'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      {/* <Stack.Screen name="SignUp" component={Signup} /> */}
    </Stack.Navigator>
  );
};
