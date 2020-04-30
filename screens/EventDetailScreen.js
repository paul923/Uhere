import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, ScrollView, Dimensions, Alert, FlatList } from 'react-native';
import { Avatar, Header, Button, Icon, ListItem } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { formatDate, formatTime } from "../utils/date";
import EventDetailWithMiniMap from './event/EventDetailWithMiniMap'
import EventMap from './event/EventMap'
import SideMenu from 'react-native-side-menu'
import * as Location from 'expo-location';
import firebase from 'firebase';
import { getEventByID, getEventMembers } from '../API/EventAPI'
import socket from 'config/socket';

const Stack = createStackNavigator();

export default function EventDetailScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [event, setEvent] = React.useState(null);
    const [initialRoute, setInitialRoute] = React.useState();
    const [showSwitch, setShowSwitch] = React.useState(false);
    const [isOpen, setOpen] = React.useState(false);
    const [eventMembers, setEventMembers] = React.useState(null);
    const [locations, setLocations] = React.useState({});
    const [screen, setScreen] = React.useState("EventDetail");
    React.useEffect(() => {
        async function fetchData() {
            let event = await getEventByID(route.params.EventId);
            setEvent(event);
            let withinReminder = 0 < (new Date(event.DateTime) - new Date()) && (new Date(event.DateTime) - new Date()) < (5000 * 60000)
            withinReminder = true;
            if (withinReminder) {
                // setInitialRoute('EventMap');
                setScreen("EventMap")
                setShowSwitch(true);
            } else {
                // setInitialRoute('EventDetail');
                setScreen("EventDetail")
                setShowSwitch(false);
            }
            let eventMembers = await getEventMembers(route.params.EventId)
            setEventMembers(eventMembers);
            setIsLoading(false);
        }
        fetchData()
        loadInitial();
    }, []);

    React.useEffect(() => {
      console.log("Locations");
      console.log(locations);
    }, [locations])

    async function loadInitial() {
      socket.on('updatePosition', ({user, position}) => {
        console.log("updatePosition");
        setLocations((prevLocations) => {
          return {
            ...prevLocations,
            [user]: position
          }
        })
      })
    }

    function toggleSideMenu() {
        setOpen(!isOpen)
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
      <SideMenu
          menu={menuContent()}
          menuPosition='right'
          isOpen={isOpen}
          onChange={toggleSideMenu}
          bounceBackOnOverdraw={false}
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
      </SideMenu>
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

const friendsData = [
    {
        displayName: "Justin Choi",
        userId: "Crescent1234",
        pictureUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
        userInitial: "",
    },
    {
        displayName: "Paul Kim",
        userId: "pk1234",
        pictureUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
        userInitial: "",
    },
    {
        displayName: "Jay Suhr",
        userId: "js1234",
        pictureUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
        userInitial: "",
    },
    {
        displayName: "Matthew Kim",
        userId: "mk1234",
        pictureUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
        userInitial: "",
    },
    {
        displayName: "JYP",
        userId: "andWondergirls",
        pictureUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
        userInitial: "",
    },
    {
        displayName: "You Hee Yeol",
        userId: "uhere",
        pictureUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
        userInitial: "",
    },
]
