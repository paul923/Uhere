import * as React from 'react';
import * as Font from 'expo-font';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HistoryScreen from 'screens/history/HistoryScreen';
import HistoryDetail from 'screens/history/HistoryDetail'

const Stack = createStackNavigator();

export default function HistoryNavigator({ navigation, route }) {

	// Load any resources or data that we need prior to rendering the app
	React.useEffect(() => {
	}, []);

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
		</Stack.Navigator>
	)
}