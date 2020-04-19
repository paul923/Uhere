import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import { Avatar, Header, Button, Icon } from 'react-native-elements';
import { formatDate, formatTime } from "../../utils/date";
import moment from 'moment'

const testMembers = [
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

export default function EventDetail({ route }) {
    console.log(route.params.route.params.item.DateTime);
    React.useEffect(() => {
    }, []);

    return (
        <View style={styles.container}>
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
                        <Text h5>{formatDate(new Date(route.params.route.params.item.DateTime)) + ", " + formatTime(new Date(route.params.route.params.item.DateTime))}</Text>
                        <Text h5>{moment(new Date(route.params.route.params.item.DateTime)).fromNow()}</Text>
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
                        <Text>Losers buy {route.params.route.params.item.Penalty}</Text>
                    </View>

                </View>
                <View style={styles.row}>
                    <Icon name="person" />
                    {
                        testMembers.map((u, i) => {
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
                    <Text>{testMembers.length + "/" + route.params.route.params.item.MaxMember}</Text>
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
})