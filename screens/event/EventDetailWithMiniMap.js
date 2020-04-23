import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import { Avatar, Header, Button, Icon } from 'react-native-elements';
import MapView from 'react-native-maps';
import EventDetail from './EventDetail'
import { getEventByID } from '../../API/EventAPI'

const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function EventDetailWithMiniMap({ route }) {
    const [event, setEvent] = React.useState(null);
    React.useEffect(() => {
        async function fetchData() {
            let event = await getEventByID(route.params.EventId);
            setEvent(event);
        }
        fetchData()
    }, []);
    return (
        <View style={styles.container}>
            {/* Map */}
            {event !== null && 
            (<MapView
                style={styles.mapStyle}
                region={
                    {
                        latitude: event.LocationGeolat,
                        longitude: event.LocationGeolong,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    }
                }
            >
                <MapView.Marker
                    coordinate={
                        {
                            latitude: event.LocationGeolat,
                            longitude: event.LocationGeolong,
                        }
                    }
                    title={event.LocationName}
                />
            </MapView>)}
            {/* Event Detail */}
            <View style={styles.detailContainer} >
                <EventDetail EventId={route.params.EventId} />
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