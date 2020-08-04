import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, ScrollView, Dimensions, Alert, FlatList } from 'react-native';
import { Avatar, Header, Button, Icon, ListItem } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { formatDate, formatTime } from "../utils/date";
import EventDetailWithMiniMap from './event/EventDetailWithMiniMap'
import EventMap from './event/EventMap'
import SideMenu from 'react-native-side-menu'
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import * as Location from 'expo-location';
import firebase from 'firebase';
import { getEvent } from 'api/event'
import socket from 'config/socket';

export default function EventDetailScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [event, setEvent] = React.useState(null);
    const [showSwitch, setShowSwitch] = React.useState(false);
    const [eventMembers, setEventMembers] = React.useState(null);
    const [locations, setLocations] = React.useState({});
    const [screen, setScreen] = React.useState("EventDetail");

    const drawer = React.useRef(null);

    React.useEffect(() => {
        async function fetchData() {
            let event = await getEvent(route.params.EventId);
            setEvent(event);
            let withinReminder = 0 < (new Date(event.DateTime) - new Date()) && (new Date(event.DateTime) - new Date()) < (5000 * 60000)
            //withinReminder = true;
            if (withinReminder) {
                // setInitialRoute('EventMap');
                setScreen("EventMap")
                setShowSwitch(true);
            } else {
                // setInitialRoute('EventDetail');
                setScreen("EventDetail")
                setShowSwitch(false);
            }
            setEventMembers(event.eventUsers);
            setIsLoading(false);
        }
        fetchData()
        loadInitial();
    }, []);

    async function loadInitial() {
      socket.on('requestPosition', async () => {
        let location = await Location.getCurrentPositionAsync();
        let user = firebase.auth().currentUser.uid;
        let position = { latitude: location.coords.latitude, longitude: location.coords.longitude }
        setLocations({...locations, [user]: position});
        socket.emit('position', {
            user,
            position
        })
      })
      socket.on('updatePosition', ({user, position}) => {
        setLocations((prevLocations) => {
          return {
            ...prevLocations,
            [user]: position
          }
        })
      })
      socket.emit('requestPosition', {event: route.params.EventId});
    }

    function toggleSideMenu() {
        drawer.current.openDrawer();
    }

    function renderFriendsCard({ item }) {
        return (
            <ListItem
                leftAvatar={{ source: { uri: item.AvatarURI } }}
                rightIcon={<Icon name="add-user" type="entypo" size={20} />}
                title={item.Nickname}
                titleStyle={{ fontSize: 15 }}
                containerStyle={{ padding: 3 }}
            />
        );
    }
    function _handleNavigation() {
      if (screen == "EventDetail"){
        setScreen("EventMap")
      } else {
        setScreen("EventDetail")
      }
    }

    function menuContent() {
        return (
            <View style={styles.sideMenu}>
                {isLoading !== true && (
                    <View style={{ flex: 10 }}>
                        <View style={styles.hostContainer}>
                            <Text>Host</Text>
                            <Avatar
                                size='large'
                                source={{ uri: 'https://www.collinsdictionary.com/images/full/rose_277351964.jpg' }}
                                avatarStyle={{ borderWidth: 2, borderRadius: 5, borderColor: 'red' }}
                            />
                            <Text>Host Name</Text>
                        </View>

                        <View style={styles.friendsContainer}>
                            <Text>Friends</Text>
                            <View style={styles.friendsButton}>
                                <Button
                                    title="Invite"
                                    icon={{
                                        name: "pluscircleo",
                                        type: "antdesign"
                                    }}
                                    type="outline"
                                    containerStyle={{ flex: 1, marginHorizontal: 3, }}
                                />
                                <Button
                                    title="Edit"
                                    icon={{
                                        name: "minuscircleo",
                                        type: "antdesign"
                                    }}
                                    type="outline"
                                    containerStyle={{ flex: 1, marginHorizontal: 3 }}
                                    onPress={() => navigation.navigate('Event Edit', { item: route.params.item })}
                                />
                            </View>
                            <FlatList
                                data={eventMembers}
                                renderItem={renderFriendsCard}
                                keyExtractor={(item) => item.Username}
                                contentContainerStyle={{
                                    backgroundColor: "white",
                                    margin: 10
                                }}
                                bounces={false}
                            />
                        </View>
                    </View>
                )}

                {isLoading !== true && (
                    <View style={styles.bottomBar}>
                        <Icon
                            name="md-exit"
                            type="ionicon"
                            iconStyle={styles.bottomIcon}
                        />
                        <Icon
                            name="md-notifications"
                            type="ionicon"
                        />
                    </View>
                )}

            </View>
        )
    }

    return (
      <React.Fragment>
      {isLoading !== true && (
      <DrawerLayout
          ref={drawer}
          renderNavigationView={menuContent}
          drawerWidth={250}
          drawerPosition={DrawerLayout.positions.Right}
          drawerType='front'
      >
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
                  centerComponent={ event !== null && { text: event.Name, style: { color: '#fff' } }}
                  centerContainerStyle={{ flex: 1 }}
                  rightComponent={{ icon: 'menu', color: '#fff', onPress: toggleSideMenu }}
              />
              {
                screen === "EventDetail" && (
                  <EventDetailWithMiniMap
                    event={event}
                    eventMembers={eventMembers}
                    onPress={toggleSideMenu}
                    />
                )
              }
              {
                screen === "EventMap" && (
                  <EventMap
                  event={event}
                  eventMembers={eventMembers}
                  locations={locations}
                    />
                )
              }
              {/* Switch */}
              {
                route.params.EventType === "ON-GOING" && showSwitch && (
                  <View style={styles.switchStyle}>
                      <Icon style={styles.switchStyle}
                          reverse
                          name='exchange'
                          type='font-awesome'
                          onPress={_handleNavigation}
                      />
                  </View>
                )
              }
          </View>
      </DrawerLayout>
      )}
      </React.Fragment>
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
    sideMenu: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 1,
    },
    hostContainer: {
        flex: 2,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    friendsContainer: {
        flex: 4,
        borderWidth: 1,
        padding: 5
    },
    bottomBar: {
        borderWidth: 1,
        flexDirection: 'row',
        padding: 5,
    },
    friendsButton: {
        flexDirection: 'row'
    },
    bottomIcon: {
        marginHorizontal: 10
    }
})
