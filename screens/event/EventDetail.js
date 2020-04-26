import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import { Avatar, Header, Button, Icon } from 'react-native-elements';
import { formatDate, formatTime } from "../../utils/date";
import moment from 'moment'
import { getEventByID, getEventMembers } from '../../API/EventAPI'

export default function EventDetail({ EventId }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [event, setEvent] = React.useState();
    const [members, setMembers] = React.useState([]);
    React.useEffect(() => {
        async function fetchData() {
            let event = await getEventByID(EventId);
            setEvent(event);
            let members = await getEventMembers(EventId);
            setMembers(members)
            setIsLoading(false);
        }
        fetchData()
    }, []);

    return (
        <View style={styles.container}>
        {
          !isLoading && (
            <View style={styles.detailContainer}>
                <View style={styles.row}>
                    <Icon name="location-on" />
                    {
                      event.IsOnline ? (
                        <View style={styles.column}>
                            <Text h5>Online Meeting</Text>
                        </View>
                      ) : (
                        <View style={styles.column}>
                            <Text h5>{event.LocationName}</Text>
                            <Text h5>{event.LocationAddress}</Text>
                        </View>
                      )
                    }
                </View>
                <View style={styles.row}>
                    <Icon name="event" />
                    <View style={styles.column}>
                        <Text h5>{formatDate(new Date(event.DateTime)) + ", " + formatTime(new Date(event.DateTime))}</Text>
                        <Text h5>{moment(new Date(event.DateTime)).fromNow()}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <Icon name="keyboard-voice" />
                    <View style={styles.column}>
                        <Text h5>{event.Description}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <Icon name="remove-circle" />
                    <View style={styles.column}>
                        <Text>Losers buy {event.Penalty}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <Icon name="person" />
                    {members !== null && (
                        members.map((u, i) => {
                            return (
                                <View style={styles.avatar} key={i}>
                                    <Avatar
                                        rounded
                                        size='medium'
                                        source={{uri:u.AvatarURI}}
                                    />
                                </View>
                            )
                        })
                    )}
                    <Text>{members.length + "/" + event.MaxMember }</Text>
                </View>
            </View>
          )
        }
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
