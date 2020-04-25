import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, ScrollView, Dimensions, Alert, FlatList } from 'react-native';
import { Avatar, Header, Button, Icon, ListItem } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { formatDate, formatTime } from "../utils/date";
import EventDetailWithMiniMap from './event/EventDetailWithMiniMap'
import EventMap from './event/EventMap'
import SideMenu from 'react-native-side-menu'
import { getEventByID } from '../API/EventAPI'

const Stack = createStackNavigator();

export default function EventDetailScreen({ navigation, route }) {
    const [event, setEvent] = React.useState(null);
    const [defaultRoute, setDefaultRoute] = React.useState('EventDetail');
    const [isOpen, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    React.useEffect(() => {
        async function fetchData() {
            let event = await getEventByID(route.params.EventId);
            setEvent(event);
            setIsLoading(false);
        }
        fetchData()
    }, []);

    function toggleSideMenu() {
        setOpen(!isOpen)
    }

    function renderFriendsCard({ item }) {
        return (
            <ListItem
                leftAvatar={{ source: { uri: item.pictureUrl } }}
                rightIcon={<Icon name="add-user" type="entypo" size={20} />}
                title={item.displayName}
                titleStyle={{ fontSize: 15 }}
                containerStyle={{ padding: 3 }}
            />
        );
    }
    function _handleNavigation() {
        if (defaultRoute == 'EventDetail') {
            setDefaultRoute('EventMap');
            navigation.navigate('EventMap');
        } else {
            setDefaultRoute('EventDetail');
            navigation.navigate('EventDetail');
        }
    }

    function menuContent() {
        return (
            <View style={styles.sideMenu}>
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
                            data={friendsData}
                            renderItem={renderFriendsCard}
                            keyExtractor={(item) => item.userId}
                            contentContainerStyle={{
                                backgroundColor: "white",
                                margin: 10
                            }}
                            bounces={false}
                        />
                    </View>

                </View>

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
            </View>
        )
    }

    return (
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
              <Stack.Navigator initialRouteName={defaultRoute} headerMode="none" >
                  <Stack.Screen
                      name="EventDetail"
                      component={EventDetailWithMiniMap}
                      initialParams={{ EventId: route.params.EventId }}
                      options={{ gestureEnabled: false }}
                  />
                  <Stack.Screen name="EventMap" component={EventMap} initialParams={{ EventId: route.params.EventId }} options={{ gestureEnabled: false }} />
              </Stack.Navigator>
              {/* Switch */}
              {
                route.params.EventType === "ON-GOING" && (
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
