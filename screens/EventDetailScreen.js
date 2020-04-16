import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, ScrollView, Dimensions, Alert,FlatList } from 'react-native';
import { Avatar, Header, Button, Icon, ListItem } from 'react-native-elements';
import { formatDate, formatTime } from "../utils/date";
import MapView from 'react-native-maps';


import SideMenu from 'react-native-side-menu'

const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const testLocation = {
    "id": "poi.274877968974",
    "type": "Feature",
    "place_type": [
        "poi"
    ],
    "relevance": 0.954545,
    "properties": {
        "landmark": true,
        "address": "4341 North Rd",
        "category": "cafe, coffee, tea, tea house",
        "maki": "cafe"
    },
    "text": "Juillet Cafe",
    "place_name": "Juillet Cafe, 4341 North Rd, Burnaby, British Columbia V3N 4N4, Canada",
    "center": [
        -122.892873,
        49.245313
    ],
    "geometry": {
        "coordinates": [
            -122.892873,
            49.245313
        ],
        "type": "Point"
    },
    "context": [
        {
            "id": "neighborhood.4648501112784200",
            "text": "Cameron"
        },
        {
            "id": "postcode.17850449015175840",
            "text": "V3N 4N4"
        },
        {
            "id": "place.11396815904751060",
            "wikidata": "Q244025",
            "text": "Burnaby"
        },
        {
            "id": "region.10008500984322020",
            "short_code": "CA-BC",
            "wikidata": "Q1974",
            "text": "British Columbia"
        },
        {
            "id": "country.10019870576587150",
            "short_code": "ca",
            "wikidata": "Q16",
            "text": "Canada"
        }
    ]
}

export default function EventDetailScreen({ navigation, route }) {
    const [ isOpen, setOpen] = React.useState(false);

    React.useEffect(() => {
    }, []);

    function toggleSideMenu(){
        setOpen(!isOpen)
    }

    function switchToEventDetail() {
        navigation.navigate('Event Detail Map', { item: route.params.item })
    }


    function renderFriendsCard ({ item }){ 
        return(
            <ListItem
                leftAvatar = {{ source: { uri: item.pictureUrl } }}
                rightIcon = {<Icon name="add-user" type="entypo" size={20}/>}
                title={item.displayName}
                titleStyle={{fontSize: 15}}
                containerStyle={{padding: 3}}
            />
        );
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
                <Header
                    leftComponent={{ icon: 'chevron-left', color: '#fff', onPress: () => navigation.navigate("Event") }}
                    centerComponent={{ text: route.params.item.name, style: { color: '#fff' } }}
                    centerContainerStyle={{ flex: 1 }}
                    rightComponent={{ icon: 'menu', color: '#fff', onPress: toggleSideMenu}}
                />
                {/* Map */}
                <MapView
                    style={styles.mapStyle}
                    region={{ latitude: testLocation.center[1], longitude: testLocation.center[0], latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }}
                >
                    <MapView.Marker
                        coordinate={
                            {
                                latitude: testLocation.center[1],
                                longitude: testLocation.center[0],
                            }
                        }
                        title='Juilet Cafe'
                    />
                </MapView>

                <View style={styles.detailContainer}>
                    <View style={styles.row}>
                        <Icon name="location-on" />
                        <View style={styles.column}>
                            <Text h5>{testLocation.text}</Text>
                            <Text h5>{testLocation.properties.address + ", " + testLocation.context[2].text}</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Icon name="event" />
                        <View style={styles.column}>
                            <Text h5>{formatDate(new Date(route.params.item.DateTime)) + ", " + formatTime(new Date(route.params.item.DateTime))}</Text>
                            <Text h5>in {new Date(route.params.item.DateTime) - new Date()} milliseconds</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Icon name="keyboard-voice" />
                        <View style={styles.column}>
                            <Text>빨리안오면 아메리카노 사는거다 빨랑와라</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Icon name="remove-circle" />
                        <View style={styles.column}>
                            <Text>Losers buy {route.params.item.Penalty}</Text>
                        </View>

                    </View>
                    {/**
                    <View style={styles.row}>
                        <Icon name="person" />
                        {
                            route.params.item.members.map((u, i) => {
                                return (
                                    <View style={styles.avatar} key={i}>
                                        <Avatar
                                            rounded
                                            size='medium'
                                            title={u.initial}
                                        />
                                    </View>
                                )
                            })
                        }
                        <Text>{route.params.item.members.length + "/" + route.params.item.MaxMember}</Text>
                    </View>
                     */}
                </View>
                {0 < (route.params.item.date - new Date()) && (route.params.item.date - new Date()) < (route.params.item.timer * 60000) && (
                    <View style={styles.switchStyle}>
                        <Icon
                            reverse
                            name='exchange'
                            type='font-awesome'
                            onPress={switchToEventDetail}
                        />
                    </View>
                )}
            </View>
        </SideMenu>
    )

    function menuContent(){
        return(
            <View style={styles.sideMenu}>
            <View style={{flex: 10}}>
                <View style={styles.hostContainer}>
                <Text>Host</Text>
                <Avatar
                    size='large'
                    source={{uri: 'https://www.collinsdictionary.com/images/full/rose_277351964.jpg'}}
                    avatarStyle={{borderWidth: 2, borderRadius: 5, borderColor: 'red'}}
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
                        containerStyle={{flex: 1, marginHorizontal: 3,}}
                        />
                        <Button
                        title="Edit"
                        icon={{
                            name: "minuscircleo",
                            type: "antdesign"
                        }}
                        type="outline"
                        containerStyle={{flex: 1, marginHorizontal: 3}}
                        onPress={()=> navigation.navigate('Event Edit', { item: route.params.item })}
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
    avatar: {
        margin: 5,
    },
    switchStyle: {
        right: 0,
        position: 'absolute',
        bottom: 200,
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
        flex:4,
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
      bottomIcon:{
        marginHorizontal: 10
      }
})

const friendsData = [
    {
      displayName: "Justin Choi",
      userId : "Crescent1234",
      pictureUrl : "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
      userInitial : "",
    },
    {
      displayName: "Paul Kim",
      userId : "pk1234",
      pictureUrl : "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
      userInitial : "",
    },
    {
      displayName: "Jay Suhr",
      userId : "js1234",
      pictureUrl : "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
      userInitial : "",
    },
    {
      displayName: "Matthew Kim",
      userId : "mk1234",
      pictureUrl : "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
      userInitial : "",
    },
    {
      displayName: "JYP",
      userId : "andWondergirls",
      pictureUrl : "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
      userInitial : "",
    },
    {
      displayName: "You Hee Yeol",
      userId : "uhere",
      pictureUrl : "https://upload.wikimedia.org/wikipedia/commons/b/b8/Red_rose_flower_detailed_imge.jpg",
      userInitial : "",
    },
  ]