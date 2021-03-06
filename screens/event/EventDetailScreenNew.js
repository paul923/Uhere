import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, Image, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Header, Button, Icon, ListItem } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { formatDate, formatDateFormat } from "utils/date";
import SideMenu from 'react-native-side-menu'
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import firebase from 'firebase';
import { getEvent, updateArrivedTime } from 'api/event'
import socket from 'config/socket';
import UhereHeader from '../../components/UhereHeader';
import UhereSideMenu from '../../components/UhereSideMenu';
import EventMenuContent from '../../components/EventMenuContent'
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import Modal from 'react-native-modal';
import { getAvatarImage } from 'utils/asset'
import { StackActions } from '@react-navigation/native';
import { locationService } from '../../utils/locationService';
import { millisToMinutesAndSeconds } from "../../utils/date";

const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const LATITUDE_DELTA_MAP = 0.0922;
const LONGITUDE_DELTA_MAP = LATITUDE_DELTA_MAP * ASPECT_RATIO;

const GEO_FENCING_TASK_NAME = 'geofencing';


// Task Manager 
TaskManager.defineTask(GEO_FENCING_TASK_NAME, ({ data: { eventType, region }, error }) => {
    if (error) {
      console.log(error);
      return;
    }
    if (eventType === Location.GeofencingEventType.Enter) {
      console.log("You've entered region:", region);
      locationService.setGoalin(true);
      //Alert.alert("You've entered region");
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.log("You've left region:", region);
      locationService.setGoalin(false);
      //Alert.alert("You've left region");
    }
  });

export default function EventDetailScreenNew({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [event, setEvent] = React.useState(null);
    const [mapRegion, setMapRegion] = React.useState();
    const [host, setHost] = React.useState();
    const [eventMembers, setEventMembers] = React.useState(null);
    const [locations, setLocations] = React.useState({});
    const [memberLocations, setMemberLocations] = React.useState([]);
    const [isModalVisible, setModalVisible] = React.useState(false);
    const [goalButton, setGoalButton] = React.useState(false);
    const [me, _setMe] = React.useState();
    const meRef = React.useRef(me);
    const setMe = (value) => {
        meRef.current = value;
        _setMe(value);
      }
    const [goalIn, _setGoalIn] = React.useState();
    const goalInRef = React.useRef(goalIn);
    const setGoalIn = (value) => {
        goalInRef.current = value;
        _setGoalIn(value);
      }
    const [timer, _setTimer] = React.useState();
    const timerRef = React.useRef(timer);
    const setTimer = (value) => {
        timerRef.current = value;
        _setTimer(value);
      }
    const [geofencingStarted, _setgeofencingStarted] = React.useState(false);
    const geofencingStartedRef = React.useRef(geofencingStarted);
    const setgeofencingStarted = (value) => {
      geofencingStartedRef.current = value;
      _setgeofencingStarted(value);
    }
    const mapRef = React.useRef();
    const drawerRef = React.useRef(null);
    const onLocationUpdate = (value) => {
        setGoalButton(value);
    }

    React.useEffect(() => {
        socket.connect();
        socket.emit('requestPosition', { event: route.params.EventId });
        socket.on('updatePosition', ({ user, position }) => {
            setLocations((prevLocations) => {
                return {
                    ...prevLocations,
                    [user]: position
                }
            })
        })
        fetchData();
        let interval = startinterval();
        return async () => {
            clearInterval(interval);
            let started = await Location.hasStartedGeofencingAsync(GEO_FENCING_TASK_NAME);
            if(started){
                Location.stopGeofencingAsync(GEO_FENCING_TASK_NAME);
                console.log("stop geo");
            }
            locationService.unsubscribe(onLocationUpdate);
        };
    }, []);
    React.useEffect(() => {
        if(!isLoading){
            Object.keys(locations).map((key) => {
                const memberLocation = memberLocations.find(m => m.member.UserId === key);
                if (memberLocation === undefined) {
                    // create and add it to array with new animated marker
                    const member = eventMembers.find(m => m.UserId === key);
                    const latitude = locations[key].latitude;
                    const longitude = locations[key].longitude;
                    const memberLocation = {
                        member: member,
                        location: new AnimatedRegion({
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: LATITUDE_DELTA_MAP,
                            longitudeDelta: LONGITUDE_DELTA_MAP,
                        })
                    }
                    memberLocations.push(memberLocation);
                    setMemberLocations(memberLocations);
                } else {
                    memberLocation.location.timing({
                        latitude: locations[key].latitude,
                        longitude: locations[key].longitude,
                    }).start();
                }
            })
        }
    }, [locations])

    async function fetchData() {
        let event = await getEvent(route.params.EventId);
        setEvent(event);
        let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Balanced});
        let region = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: LATITUDE_DELTA_MAP*0.16, longitudeDelta: LONGITUDE_DELTA_MAP*0.16 }
        setMapRegion(region);
        setEventMembers(event.eventUsers);
        let host = event.eventUsers.find(m => m.IsHost === 1);
        setHost(host);
        let me = event.eventUsers.find(m => m.UserId === firebase.auth().currentUser.uid);
        setMe(me);
        setIsLoading(false); 
    }

    async function loadInitial() {
        socket.on('requestPosition', async () => {
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            let user = firebase.auth().currentUser.uid;
            let position = { latitude: location.coords.latitude, longitude: location.coords.longitude }
            setLocations({ ...locations, [user]: position });
        })
        socket.on('updatePosition', ({ user, position }) => {
            setLocations((prevLocations) => {
                return {
                    ...prevLocations,
                    [user]: position
                }
            })
        })
        socket.emit('requestPosition', { event: route.params.EventId });
    }

    async function startinterval() {
        locationService.subscribe(onLocationUpdate);
        let event = await getEvent(route.params.EventId);
        let interval = null;
        interval = setInterval(async () => {
            // TIMER
            if (new Date(event.DateTime) - new Date() > 0 && !goalInRef.current) {
                setTimer(millisToMinutesAndSeconds(new Date(event.DateTime) - new Date() >= 1800000 ? 1800000 : new Date(event.DateTime) - new Date()));
            }
            // geofencing 
            if (new Date(event.DateTime) - new Date() <= 1800000 && !geofencingStartedRef.current) {
                let started = await Location.hasStartedGeofencingAsync(GEO_FENCING_TASK_NAME);
                if(!started){
                    startGeoFencing(event.LocationGeolat, event.LocationGeolong);
                    setgeofencingStarted(true);
                }
                //startGeoFencing(event.LocationGeolat, event.LocationGeolong);
                //setgeofencingStarted(true);
            } else if (goalInRef.current || meRef.current.ArrivedTime !== null) {
                setTimer('You Are In!');
                let started = await Location.hasStartedGeofencingAsync(GEO_FENCING_TASK_NAME);
                if(started){
                    Location.stopGeofencingAsync(GEO_FENCING_TASK_NAME);
                    console.log("stop ", GEO_FENCING_TASK_NAME);
                }
                if (new Date(event.DateTime) - new Date() <= 0) {
                    clearInterval(interval);
                    navigation.dispatch(StackActions.popToTop());
                    navigation.navigate('History', {
                        screen: 'HistoryScreen'});
                    navigation.navigate('History', {
                        screen: 'HistoryDetail', params: {
                            EventId: event.EventId
                        }
                    });
                }
            } else if (new Date(event.DateTime) - new Date() <= 0) {
                let started = await Location.hasStartedGeofencingAsync(GEO_FENCING_TASK_NAME);
                if(started){
                    Location.stopGeofencingAsync(GEO_FENCING_TASK_NAME);
                    console.log("stop ", GEO_FENCING_TASK_NAME);
                }
                clearInterval(interval);
                navigation.dispatch(StackActions.popToTop());
                navigation.navigate('History', {
                    screen: 'HistoryScreen'});
                navigation.navigate('History', {
                    screen: 'HistoryDetail', params: {
                        EventId: event.EventId
                    }
                });
            }
        }, 1000);
        return interval;
    }

    async function _goToMyLocation() {
        let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Balanced});
        let region = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta:LATITUDE_DELTA_MAP, longitudeDelta: LONGITUDE_DELTA_MAP }
        mapRef.current.animateToRegion(region);
    }
    async function _goToEventLocation() {
        let region = { latitude: event.LocationGeolat, longitude: event.LocationGeolong, latitudeDelta:LATITUDE_DELTA_MAP*0.1, longitudeDelta: LONGITUDE_DELTA_MAP*0.1 }
        mapRef.current.animateToRegion(region);
    }

    async function startGeoFencing(latitude, longitude) {
        console.log('starting geo fencing with radius 100m from', latitude, longitude);
        let regions = [
            {
                latitude: latitude,
                longitude: longitude,
                radius: 100,// in meters
                notifyOnEnter: true,
                notifyOnExit: true,
            }
        ]
        Location.startGeofencingAsync(GEO_FENCING_TASK_NAME, regions)
    }

    async function _fitAll() {
        let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Balanced});
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
            <UhereSideMenu
                drawerRef={drawerRef}
                data={!isLoading && event &&(<EventMenuContent
                    eventTitle={event.Name}
                    membersData={eventMembers}
                    hostData={host}
                    navigation={() => navigation.navigate('Event Edit', {EventId: event.EventId, close:() => drawerRef.current.closeDrawer()} )}
                    close = {() => drawerRef.current.closeDrawer()}
                />)}
            >
            <UhereHeader
                showBackButton={true}
                onPressBackButton={() => navigation.navigate('Event')}
                showSideMenu={true}
                onPressSideMenu={() => drawerRef.current.openDrawer()}
            />
            {!isLoading && event && timer && (
                <React.Fragment>
                    {/* TIMER */}
                    <View style={styles.timerContainer}>
                        <Text style={styles.timerFont}>
                            {timer}
                        </Text>
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
                            radius={100} // in meters
                            strokeWidth={1}
                            strokeColor='#FAFAFA'
                            fillColor='rgba(0, 12, 214, 0.2)'
                        />
                        {/* Member Markers */}
                        {
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
                        }
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
                    {/* Fit All */}
                    <TouchableOpacity 
                        style={styles.allLocationStyle}
                        onPress={_fitAll}
                        >
                        <Image
                            source={require('../../assets/icons/event/icon_all.png')}
                        />
                    </TouchableOpacity>
                    {/* Information */}
                    <TouchableOpacity 
                        style={styles.informationStyle}
                        onPress={()=>setModalVisible(true)}
                        >
                        <Image
                            source={require('../../assets/icons/event/icon_info.png')}
                        />
                    </TouchableOpacity>
                    {/* Info Modal */}
                    <Modal style={styles.modalContainer}
                        animationIn='zoomIn'
                        animationOut='zoomOut'
                        //backdropOpacity={0}
                        isVisible={isModalVisible}
                        onBackdropPress={() => setModalVisible(false)}>
                        <View style={styles.Modal}>
                            <Text style={{color: '#15cdca', fontSize: 20, margin:10}}>Latest buys all! Don't be late</Text>
                            <View style={styles.horizontalLine}></View>
                            
                            <Text style={{color: '#15cdca', fontSize: 15 ,marginLeft:10}}>Where?</Text>
                            <Text style={{fontSize: 15,marginLeft:10}}>{event.LocationName}</Text>
                            
                            <Text style={{color: '#15cdca', fontSize: 15, marginLeft:10}}>When?</Text>
                            <Text style={{fontSize: 15,marginLeft:10}}>
                                {formatDateFormat(new Date(event.DateTime),'MMMM dd')} | {formatDateFormat(new Date(event.DateTime),'iiii')} | {formatDateFormat(new Date(event.DateTime),'hh:mm a')}
                            </Text>
                            <Text style={{color: '#15cdca', fontSize: 15 ,marginLeft:10}}>What?</Text>
                            <Text style={{fontSize: 15,marginLeft:10}}>{event.Penalty}</Text>

                            <Text style={{color: '#15cdca', fontSize: 15 ,marginLeft:10}}>Who?</Text>
                            <Text style={{fontSize: 15,marginLeft:10}}>{event.MaxMember}</Text>


                        </View>
                    </Modal>
                    {/* Goal In */}
                    {goalButton && !goalInRef.current && meRef.current.ArrivedTime === null && (
                        <TouchableOpacity 
                            style={styles.goalinStyle}
                            onPress={()=>{
                                updateArrivedTime(event.EventId,firebase.auth().currentUser.uid,new Date())
                                setGoalIn(true);
                                setGoalButton(false)}
                            }
                        >
                            <Image source={require('../../assets/icons/event/goalinButton.png')}
                                resizeMode='contain'
                                style={{width: 60, height: 60}} />
                        </TouchableOpacity>
                    )}

                    {/* Member Infos Box */}
                    <View style={styles.avatarContianer}>
                        <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                            {/* eventMembers */}
                            {
                                memberLocations.map(memberLocation => {
                                    if (memberLocation.member.UserId !== firebase.auth().currentUser.uid) {
                                        try {
                                            let memberRegion = { latitude: locations[memberLocation.member.UserId].latitude, 
                                                longitude: locations[memberLocation.member.UserId].longitude, 
                                                latitudeDelta: LATITUDE_DELTA_MAP, 
                                                longitudeDelta: LONGITUDE_DELTA_MAP }
                                                return (
                                                    <TouchableOpacity
                                                        style={styles.avatarView}
                                                        key={memberLocation.member.UserId}
                                                        onPress={() => mapRef.current.animateToRegion(memberRegion)}
                                                    >
                                                        <Image
                                                            source={getAvatarImage(memberLocation.member.AvatarURI)}
                                                            style={[styles.memberAvatar,{tintColor: memberLocation.member.AvatarColor, borderColor: memberLocation.member.AvatarColor,}]}
                                                            resizeMode='contain'
                                                        />
                                                        <Text>{memberLocation.member.Nickname}</Text>
                                                    </TouchableOpacity>
                                                )    
                                        } catch (error) {
                                            
                                        }
                                    }
                                })
                            }
                        </ScrollView>
                    </View>
                </React.Fragment>
            )}
            </UhereSideMenu>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    timerContainer: {
        width: 200,
        height: 60,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        position: 'absolute',
        alignSelf: 'center',
        top: 110,
        zIndex: 1,
    },
    timerFont: {
        fontSize: 30,
        color: '#15cdca',
    },
    horizontalLine: {
        backgroundColor: '#15cdca',
        width: '90%',
        height: 1,
        alignSelf:'center'
    },
    avatarContianer: {
        height:90,
        flexDirection: 'row',
        backgroundColor: 'white',
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 10
        },
        elevation: 5,
        shadowRadius: 10,
        shadowOpacity: 1,
    },
    avatarView: {
        margin: 10,
        alignItems: 'center'
    },
    memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 10,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
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
    allLocationStyle: {
        position: 'absolute',
        top: 200,
        right: 0,
    },
    informationStyle: {
        position: 'absolute',
        bottom: 163,
        right: 0,
    },
    goalinStyle: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 150,
        zIndex: 1,
    },
});