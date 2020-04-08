import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import JayTestScreen from '../screens/debug/JayTestScreen'
import EventDetailMapView from '../screens/debug/EventDetailMapView'
import EventDetail from '../components/EventDetail'


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
                component={EventDetailMapView}
            />
            <Stack.Screen
                name="EventDetail"
                component={EventDetail}
            />
        </Stack.Navigator>
    )
}