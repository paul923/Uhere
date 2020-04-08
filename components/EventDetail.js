import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import { Avatar, Header, Button, Icon } from 'react-native-elements';
import { formatDate, formatTime } from "../utils/date";
import MapView from 'react-native-maps';

const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const members = [
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

const sampleEvent = {
    date: new Date(2020, 3, 20),
    key: 1,
    location: "Juilet Cafe",
    maximumNumberOfMembers: 5,
    members: members,
    name: "Startcraft",
    prize: "americano",
}

export default function EventDetail() {

    React.useEffect(() => {
    }, []);

    return (
        <View style={styles.container}>
            <Header
                leftComponent={{ icon: 'chevron-left', color: '#fff' }}
                centerComponent={{ text: sampleEvent.name, style: { color: '#fff' } }}
                centerContainerStyle={{ flex: 1 }}
                rightComponent={{ icon: 'menu', color: '#fff' }}
            />
            {/* Map */}
            <MapView
                style={styles.mapStyle}
                region={{ latitude: 49.2451673, longitude: -122.8933748, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }}
            >
                <MapView.Marker
                    coordinate={
                        {
                            latitude: 49.2451673,
                            longitude: -122.8933748,
                        }
                    }
                    title = 'Juilet Cafe'
                />
            </MapView>

            <View style={styles.detailContainer}>
                <View style={styles.row}>
                    <Icon name="location-on" />
                    <Text h5>{sampleEvent.location}</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="event" />
                    <Text>{formatDate(sampleEvent.date)}</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="keyboard-voice" />
                    <Text>빨리안오면 아메리카노 사는거다 빨랑와라</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="remove-circle" />
                    <Text>Losers buy {sampleEvent.prize}</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="person" />
                    {
                        sampleEvent.members.map((u, i) => {
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
                    <Text>{sampleEvent.members.length + "/" + sampleEvent.maximumNumberOfMembers}</Text>
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

        marginLeft: 15,
        marginRight: 15,
        marginTop: 15
      },
      avatar: {
        margin: 5,
      },
})