import * as React from 'react';
import * as Font from 'expo-font';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HistoryScreen from 'screens/history/HistoryScreen';
import HistoryDetail from 'screens/history/HistoryDetail'
import ResultGameScreen from 'screens/history/ResultGameScreen'
import ResultLateScreen from 'screens/history/ResultLateScreen'

const Stack = createStackNavigator();

export default function HistoryNavigator({ navigation, route }) {
	

	return (
		<Stack.Navigator initialRouteName="HistoryScreen" headerMode="none">
			<Stack.Screen
				name="HistoryScreen"
				component={HistoryScreen}
			/>
			<Stack.Screen
				name="HistoryDetail"
				component={HistoryDetail}
			/>
			<Stack.Screen
				name="Result Late Screen"
				component={ResultLateScreen}
			/>
			<Stack.Screen
				name="Result Game Screen"
				component={ResultGameScreen}
				options={{
          gestureEnabled: false,
        }}
			/>
		</Stack.Navigator>
	)
}