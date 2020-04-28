import * as React from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import Timer from '../../components/Timer'

const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const LATITUDE_DELTA_MAP = 0.0922;
const LONGITUDE_DELTA_MAP = LATITUDE_DELTA_MAP * ASPECT_RATIO;

const testEventMembers = [
    {
        name: 'Matthew Kim',
        initial: 'MK',
        color: '#fc0f03',
        location: { latitude: 49.3049901, longitude: -122.8332702 },
    },
    {
        name: 'Paul Kim',
        initial: 'PK',
        color: '#0362fc',
        location: { latitude: 49.2620402, longitude: -122.8763948 },
    },
    {
        name: 'Justin Choi',
        initial: 'JC',
        color: '#fcba03',
        location: { latitude: 49.2509886, longitude: -122.8920569 },
    },
]

export default function EventMap({ route }) {
    const [mapRegion, setMapRegion] = React.useState();
    const mapRef = React.useRef();

    React.useEffect(() => {
        async function fetchData() {
            let location = await Location.getCurrentPositionAsync();
            let region = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: LATITUDE_DELTA_MAP, longitudeDelta: LONGITUDE_DELTA_MAP }
            setMapRegion(region);
        }
        fetchData()
    }, []);

    async function _goToMyLocation() {
        let location = await Location.getCurrentPositionAsync();
        let region = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: LATITUDE_DELTA_MAP, longitudeDelta: LONGITUDE_DELTA_MAP }
        mapRef.current.animateToRegion(region);
    }

    async function _fitAll() {
        let location = await Location.getCurrentPositionAsync();
        let coordinates = []
        // user's location
        coordinates.push({ latitude: location.coords.latitude, longitude: location.coords.longitude });
        // meeting location
        coordinates.push({ latitude: event.LocationGeolat, longitude: event.LocationGeolong });
        // eventMembers' locations
        testEventMembers.map((u) => coordinates.push(u.location))
        mapRef.current.fitToCoordinates(coordinates, { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true });
    }

    return (
      <View>
      {route.params && route.params.event && (
        <View style={styles.container}>
            {/* Timer */}
            <View style={styles.timer}>
                <Timer eventDateTime={route.params.event.DateTime} />
            </View>
            {/* MapView */}
                <MapView
                    ref={mapRef}
                    style={styles.mapStyle}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    // region : which section of the map to render/zoom
                    region={mapRegion}
                >
                    {/* Meeting Location Circle */}
                    <MapView.Circle
                        center={{
                            latitude: route.params.event.LocationGeolat,
                            longitude: route.params.event.LocationGeolong,
                        }}
                        radius={500} // in meters
                        strokeWidth={2}
                        strokeColor='rgba(89, 89, 89, 0.42)'
                        fillColor='rgba(89, 89, 89, 0.42)'
                    />
                    {/* Member Markers */}
                    {
                        testEventMembers.map((u, i) => {
                            return (
                                <MapView.Marker
                                    key={i}
                                    pinColor={u.color}
                                    coordinate={
                                        {
                                            latitude: u.location.latitude,
                                            longitude: u.location.longitude,
                                        }
                                    }
                                />
                            )
                        })
                    }
                </MapView>
            )}
            {/* My Location Button */}
            <View style={styles.myLocationStyle}>
                <Icon
                    reverse
                    name='location-arrow'
                    type='font-awesome'
                    size={20}
                    onPress={_goToMyLocation}
                />
            </View>
            {/* fitAll */}
            <View style={styles.fitAllStyle}>
                <Icon
                    reverse
                    name='users'
                    type='font-awesome'
                    size={20}
                    onPress={_fitAll}
                />
            </View>
            {/* Avatars */}
            <View style={styles.avatarContianer}>
                <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    {/* Meeting Location */}
                    <View style={styles.avatar}>
                        <Avatar
                            rounded
                            size='medium'
                            icon={{ name: 'map-marker', type: 'font-awesome' }}
                            onPress={() => mapRef.current.animateToRegion({ latitude: event.LocationGeolat, longitude: event.LocationGeolong, latitudeDelta: LATITUDE_DELTA_MAP, longitudeDelta: LONGITUDE_DELTA_MAP })}
                        />
                    </View>
                    {/* eventMembers */}
                    {
                        testEventMembers.map((u, i) => {
                            let memberRegion = { latitude: u.location.latitude, longitude: u.location.longitude, latitudeDelta: LATITUDE_DELTA_MAP, longitudeDelta: LONGITUDE_DELTA_MAP }
                            return (
                                <View style={styles.avatar} key={i}>
                                    <Avatar
                                        rounded
                                        size='medium'
                                        title={u.initial}
                                        onPress={() => mapRef.current.animateToRegion(memberRegion)}
                                    />
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
        </View>
      )}
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    timer: {
        position:'absolute',
        alignSelf:'center',
        top:0,
        zIndex:9999,
    },
    mapStyle: {
        flex: 1,
    },
    avatarContianer: {
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    avatar: {
        margin: 10,
    },
    fitAllStyle: {
        position: 'absolute',
        top: 150,
        right: 0,
    },
    myLocationStyle: {
        position: 'absolute',
        top: 100,
        right: 0,
    },
});
