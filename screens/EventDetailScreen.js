import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import { Avatar, Header, Button, Icon } from 'react-native-elements';
import { formatDate, formatTime } from "../utils/date";
import MapView from 'react-native-maps';

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

    React.useEffect(() => {
        console.log(route);
    }, []);

    return (
        <View style={styles.container}>
            <Header
                leftComponent={{ icon: 'chevron-left', color: '#fff', onPress: () => navigation.navigate("Event") }}
                centerComponent={{ text: route.params.item.name, style: { color: '#fff' } }}
                centerContainerStyle={{ flex: 1 }}
                rightComponent={{ icon: 'menu', color: '#fff' }}
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
                        <Text h5>{formatDate(route.params.item.date) + ", " + formatTime(route.params.item.date)}</Text>
                        <Text h5>{ new Date().getHours()+ ":" + new Date().getMinutes()}</Text>
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
                        <Text>Losers buy {route.params.item.prize}</Text>
                    </View>

                </View>
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
                    <Text>{route.params.item.members.length + "/" + route.params.item.maximumNumberOfMembers}</Text>
                </View>
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
})