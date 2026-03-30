import { View, Text } from 'react-native';
import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { AllNavParamList } from '../../../../navigation/AllNavParamList';

type Props = {
  navigation: StackNavigationProp<AllNavParamList, 'ProfileScreen'>;
};

const ProfileScreen = () => {
  return (
    <View>
      <Text>ProfileScreen</Text>
    </View>
  );
};

export default ProfileScreen;
