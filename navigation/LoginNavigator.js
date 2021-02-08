import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/login/LoginScreen'
import SignupScreen from '../screens/login/SignupScreen'
import ForgotPasswordScreen from '../screens/login/ForgotPasswordScreen'
import TermsScreen from '../screens/TermsScreen'

const Stack = createStackNavigator();

export default function LoginNavigator({ navigation, route }) {
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  }, []);
  return (
    <Stack.Navigator initialRouteName="Login" headerMode="none">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsScreen}
      />
    </Stack.Navigator>
  )
}
