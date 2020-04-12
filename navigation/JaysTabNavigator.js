import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import JayTestScreen from '../screens/debug/JayTestScreen'
import EventDetailMapScreen from '../screens/EventDetailMapScreen'
import EventDetailScreen from '../screens/EventDetailScreen'


const Stack = createStackNavigator();

export default function JaysTabNavigator({navivation}) {
    React.useEffect(() => {
    }, []);

    return (
        <Stack.Navigator initialRouteName="JayTestScreen" headerMode="none">
            <Stack.Screen
                name="JayTestScreen"
                component={JayTestScreen}
            />
            <Stack.Screen
                name="EventDetailMapView"
                component={EventDetailMapScreen}
            />
            <Stack.Screen
                name="EventDetail"
                component={EventDetailScreen}
            />
        </Stack.Navigator>
    )
}