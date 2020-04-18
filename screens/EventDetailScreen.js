import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import { Avatar, Header, Button, Icon } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import EventDetailWithMiniMap from './event/EventDetailWithMiniMap'
import EventMap from './event/EventMap'

const Stack = createStackNavigator();

export default function EventDetailScreen({ navigation, route }) {
    const [defaultRoute, setDefaultRoute] = React.useState('EventMap');
    function _handleNavigation(){
        if (defaultRoute == 'EventDetail') {
            setDefaultRoute('EventMap');
            navigation.navigate('EventMap');
        } else {
            setDefaultRoute('EventDetail');
            navigation.navigate('EventDetail');
        }
    }
    return (
        <View style={styles.container}>
            {/* Header */}
            <Header
                leftComponent={
                    {
                        icon: 'chevron-left',
                        color: '#fff',
                        onPress: () => {
                            navigation.navigate("Event")
                        }
                    }
                }
                centerComponent={{ text: route.params.item.Name, style: { color: '#fff' } }}
                centerContainerStyle={{ flex: 1 }}
                rightComponent={{ icon: 'menu', color: '#fff' }}
            />
            <Stack.Navigator initialRouteName={defaultRoute} headerMode="none">
                <Stack.Screen name="EventDetail" component={EventDetailWithMiniMap} initialParams={{route:route}} />
                <Stack.Screen name="EventMap" component={EventMap} initialParams={{route:route}}/>
            </Stack.Navigator>
            {/* Switch */}
            <View style={styles.switchStyle}>
                <Icon style={styles.switchStyle}
                    reverse
                    name='exchange'
                    type='font-awesome'
                    onPress={_handleNavigation}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    mapStyle: {
        flex: 1,
    },
    detailContainer: {
        flex: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 30,
        marginTop: 20
    },
    column: {
        marginLeft: 15,
    },
    switchStyle: {
        left: 0,
        position: 'absolute',
        top: 100,
    },
})