import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Header, Button, Icon, ListItem } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { formatDate, formatTime } from "utils/date";
import EventDetailWithMiniMap from 'screens/event/EventDetailWithMiniMap'
import EventMap from 'screens/event/EventMap'
import SideMenu from 'react-native-side-menu'
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import * as Location from 'expo-location';
import firebase from 'firebase';
import { getEvent } from 'api/event'
import socket from 'config/socket';
import UhereHeader from '../../components/UhereHeader';
import Timer from 'components/Timer'
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import { SwipeablePanel } from 'rn-swipeable-panel';


const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const LATITUDE_DELTA_MAP = 0.0922;
const LONGITUDE_DELTA_MAP = LATITUDE_DELTA_MAP * ASPECT_RATIO;

export default function EventDetailScreenNew({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    
    const [event, setEvent] = React.useState(null);
    const [mapRegion, setMapRegion] = React.useState();

    const [eventMembers, setEventMembers] = React.useState(null);
    const [locations, setLocations] = React.useState({});
    const [screen, setScreen] = React.useState("EventDetail");

    const [panelProps, setPanelProps] = React.useState({
        fullWidth: true,
        openLarge: false,
        showCloseButton: true,
        allowTouchOutside: true,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
    });
    const [isPanelActive, setIsPanelActive] = React.useState(true);
    
    const openPanel = () => {
        setIsPanelActive(true);
    };

    const closePanel = () => {
        setIsPanelActive(false);
    };


    const mapRef = React.useRef();

    React.useEffect(() => {
        async function fetchData() {
            let event = await getEvent(route.params.EventId);
            setEvent(event);
            let location = await Location.getCurrentPositionAsync();
            let region = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: LATITUDE_DELTA_MAP, longitudeDelta: LONGITUDE_DELTA_MAP }
            setMapRegion(region);
            setIsLoading(false);
        }
        fetchData()
    }, []);

    async function _goToMyLocation() {
        let location = await Location.getCurrentPositionAsync();
        let region = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta:LATITUDE_DELTA_MAP, longitudeDelta: LONGITUDE_DELTA_MAP }
        mapRef.current.animateToRegion(region);
    }
    async function _goToEventLocation() {
        let region = { latitude: event.LocationGeolat, longitude: event.LocationGeolong, latitudeDelta:LATITUDE_DELTA_MAP*0.1, longitudeDelta: LONGITUDE_DELTA_MAP*0.1 }
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
        Object.keys(locations).map((key) => {
            if (key !== firebase.auth().currentUser.uid) {
                let coordinate = { latitude: locations[key].latitude, longitude: locations[key].longitude }
                coordinates.push(coordinate);
            }
        })
        mapRef.current.fitToCoordinates(coordinates, { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true });
    }

    return (
        <View style={styles.container}>
            <UhereHeader
                showBackButton={true}
                onPressBackButton={() => navigation.navigate('Event')}
            />
            {!isLoading && event && (
                <React.Fragment>
                    {/* Timer */}
                    <View style={styles.timer}>
                        <Timer eventDateTime={event.DateTime} />
                    </View>
                    {/* MapView */}
                    <MapView
                        ref={mapRef}
                        style={styles.mapStyle}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        showsCompass={false}
                        // region : which section of the map to render/zoom
                        initialRegion={mapRegion}
                    >
                        {/* Meeting Location Circle */}
                        <MapView.Circle
                            center={{
                                latitude: event.LocationGeolat,
                                longitude: event.LocationGeolong,
                            }}
                            radius={500} // in meters
                            strokeWidth={1}
                            strokeColor='#FAFAFA'
                            fillColor='rgba(0, 12, 214, 0.2)'
                        />
                        {/* Member Markers */}
                        {/* {
                            memberLocations.map(memberLocation => {
                                if (memberLocation.member.UserId !== firebase.auth().currentUser.uid) {
                                    return (
                                        <MapView.Marker.Animated
                                            key={memberLocation.member.UserId}
                                            pinColor={memberLocation.member.AvatarColor}
                                            title={memberLocation.member.Nickname}
                                            coordinate={memberLocation.location}
                                        />
                                    )
                                }
                            })
                        } */}
                    </MapView>
                    {/* My Location */}
                    <TouchableOpacity
                        style={styles.myLocationStyle}
                        onPress={_goToMyLocation}
                    >
                        <Image
                            source={require('../../assets/icons/event/icon_me.png')}
                        />
                    </TouchableOpacity>
                    {/* Meeting Location */}
                    <TouchableOpacity 
                        style={styles.meetingLocationStyle}
                        onPress={_goToEventLocation}
                        >
                        <Image
                            source={require('../../assets/icons/event/info_location.png')}
                        />
                    </TouchableOpacity>
                    {/* Information */}
                    <TouchableOpacity 
                        style={styles.informationStyle}
                        onPress={()=>setIsPanelActive(true)}
                        >
                        <Image
                            source={require('../../assets/icons/event/icon_info.png')}
                        />
                    </TouchableOpacity>
                    {/* Member Infos Box */}
                    <View style={styles.xxx}>
                        <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                            
                        </ScrollView>
                    </View>
                    {/* Info Panel */}
                    <SwipeablePanel {...panelProps} isActive={isPanelActive}>
                        <View style={styles.Modal}>
                            <Text style={{ color: '#15cdca', fontSize: 20, margin: 10 }}>Latest buys all! Don't be late</Text>
                            <Text style={{ color: '#15cdca', fontSize: 10 }}>Where?</Text>
                            <Text>{event.LocationName}</Text>
                            <Text style={{ color: '#15cdca', fontSize: 10 }}>When?</Text>
                            <Text>{event.DateTime}</Text>
                        </View>
                    </SwipeablePanel>
                </React.Fragment>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    xxx: {
        height:100,
        zIndex:3,
        backgroundColor:'blue',
        shadowOpacity: 1,
        opacity:0.7
    },
    yyy: {
        zIndex:4,
    },
    modalContainer:{
        position: 'absolute',
        right:10,
        bottom: 210,
        alignSelf: 'flex-end',
    },
    Modal: {
        width: 291,
        height: 214,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    timer: {
        position: 'absolute',
        alignSelf: 'center',
        top: 110,
        zIndex: 1,
    },
    mapStyle: {
        flex: 1,
    },
    myLocationStyle: {
        position: 'absolute',
        top: 100,
        right: 0,
    },
    meetingLocationStyle: {
        position: 'absolute',
        top: 150,
        right: 0,
    },
    informationStyle: {
        position: 'absolute',
        bottom: 163,
        right: 0,
    },
});