import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import { Avatar, Header, Button, Icon } from 'react-native-elements';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import EventDetailWithMiniMap from './event/EventDetailWithMiniMap'
import EventMap from './event/EventMap'

export default function EventDetailScreen({ navigation, route }) {
    const [showMap, setShowMap] = React.useState(true);
    console.log('EventDetailScreen')
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
            {showMap ? EventMap({ route }) : EventDetailWithMiniMap({ route })}
            {/* Switch */}
            <View style={styles.switchStyle}>
                <Icon style={styles.switchStyle}
                    reverse
                    name='exchange'
                    type='font-awesome'
                    onPress={() => setShowMap(!showMap)}
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