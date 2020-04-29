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

export default function EventDetailWithMiniMap({ event, eventMembers }) {
    React.useEffect(() => {
        async function fetchData() {
        }
        fetchData()
    }, []);
    return (
        <View style={styles.container}>
            {/* Map */}
            {event &&
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
            </MapView>
            )}
            {/* Event Detail */}
            {event && (
              <View style={styles.detailContainer} >
                  <EventDetail event={event} eventMembers={eventMembers} />
              </View>
            )}
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
