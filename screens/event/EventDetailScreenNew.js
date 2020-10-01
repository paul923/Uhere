import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, Image, Dimensions, Alert, FlatList } from 'react-native';
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

    return (
        <View style={styles.container}>
            <UhereHeader
                showBackButton={true}
                onPressBackButton={() => navigation.navigate('Event')}
            />
            {!isLoading && event && (
                <View style={styles.timer}>
                    <Timer eventDateTime={event.DateTime} />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    timer: {
        position: 'absolute',
        alignSelf: 'center',
        top: 100,
        zIndex: 9999,
    }
});