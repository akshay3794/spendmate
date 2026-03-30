import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { moderateScale } from 'react-native-size-matters';
import Home from '../views/screens/DashboardScreens/Home/Home';
import { AllNavParamList } from './AllNavParamList';
import { Fonts } from '../utils/fonts';
import { useTheme } from '../hooks/useTheme';
import Transactions from '../views/screens/DashboardScreens/Transactions/Transactions';
import Setting from '../views/screens/DashboardScreens/Settings/Settings';
import Reports from '../views/screens/DashboardScreens/Reports/Reports';
import { CircleDollarSign, House, Settings, Wallet } from 'lucide-react-native';
import Budgets from '../views/screens/DashboardScreens/Budgets/Budgets';
import { createStackNavigator } from '@react-navigation/stack';
import Currency from '../views/screens/DashboardScreens/Currency/Currency';
import NotificationScreen from '../views/screens/DashboardScreens/NotificationScreen/NotificationScreen';
import ProfileScreen from '../views/screens/DashboardScreens/ProfileScreen/ProfileScreen';

const Tab = createBottomTabNavigator<AllNavParamList>();
const Stack = createStackNavigator<AllNavParamList>();

function TransactionStack() {
  return (
    <Stack.Navigator
      initialRouteName={'Transactions'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="Reports" component={Reports} />
    </Stack.Navigator>
  );
}

function SettingStack() {
  return (
    <Stack.Navigator
      initialRouteName={'Setting'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="Currency" component={Currency} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  );
}

function DashboardNavigation() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: theme.white,
          height: moderateScale(40),
          justifyContent: 'center',
        },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabelStyle: {
            marginTop: moderateScale(2),
            fontSize: Fonts.extraSmallText,
          },
          tabBarIcon: ({ focused }) => (
            <House
              size={moderateScale(20)}
              color={focused ? theme.primary : theme.grey}
            />
          ),
        }}
      />
      <Tab.Screen
        name="TransactionStack"
        component={TransactionStack}
        options={{
          tabBarLabelStyle: {
            marginTop: moderateScale(2),
            fontSize: Fonts.extraSmallText,
          },
          tabBarIcon: ({ focused }) => (
            <Wallet
              size={moderateScale(20)}
              color={focused ? theme.primary : theme.grey}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Budgets"
        component={Budgets}
        options={{
          tabBarLabelStyle: {
            marginTop: moderateScale(2),
            fontSize: Fonts.extraSmallText,
          },
          tabBarIcon: ({ focused }) => (
            <CircleDollarSign
              size={moderateScale(20)}
              color={focused ? theme.primary : theme.grey}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingStack"
        component={SettingStack}
        options={{
          tabBarLabelStyle: {
            marginTop: moderateScale(2),
            fontSize: Fonts.extraSmallText,
          },
          tabBarIcon: ({ focused }) => (
            <Settings
              size={moderateScale(20)}
              color={focused ? theme.primary : theme.grey}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default DashboardNavigation;
