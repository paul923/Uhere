import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import { Avatar, Header, Button, Icon } from 'react-native-elements';
import MapView from 'react-native-maps';
import EventDetail from './EventDetail'

const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const meetingLocation = { latitude: 49.2451673, longitude: -122.8933748 }
export default function EventDetailWithMiniMap({ route }) {
    return (
        <View style={styles.container}>
            {/* Map */}
            <MapView
                style={styles.mapStyle}
                region={{ latitude: meetingLocation.latitude, longitude: meetingLocation.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }}
            >
                <MapView.Marker
                    coordinate={
                        {
                            latitude: meetingLocation.latitude,
                            longitude: meetingLocation.longitude,
                        }
                    }
                    title='Juilet Cafe'
                />
            </MapView>
            {/* Event Detail */}
            <View style={styles.detailContainer} >
                <EventDetail route={route} />
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
    }
})