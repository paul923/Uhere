import * as React from 'react';
import { StyleSheet, StatusBar, FlatList, View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import { Avatar, Header, Button, Icon } from 'react-native-elements';
import EventDetail from './EventDetail'
import { getEventByID, getEventMembers } from '../../API/EventAPI'
import { formatDate, formatTime } from "../../utils/date";
import EventUser from '../../components/EventUser'

export default function EventHistoryDetail({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [event, setEvent] = React.useState(null);
    const [eventMembers, setEventMembers] = React.useState(null);

    React.useEffect(() => {
        async function fetchData() {
            let event = await getEventByID(route.params.EventId);
            setEvent(event);
            let eventMembers = await getEventMembers(route.params.EventId)
            eventMembers.sort(compare);
            setEventMembers(eventMembers);
            setIsLoading(false);
        }
        fetchData()
    }, []);

    function compare(a, b) {
        const bandA = a.ArrivedTime;
        const bandB = b.ArrivedTime;
        let comparison = 0;
        if (bandA > bandB) {
            comparison = 1;
        } else if (bandA < bandB) {
            comparison = -1;
        }
        return comparison;
    }

    return (
        <View style={styles.container}>
            {isLoading !== true && (
                <View style={{ flex: 1 }}>
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
                        centerComponent={event !== null && { text: event.Name, style: { color: '#fff' } }}
                        centerContainerStyle={{ flex: 1 }}
                        rightComponent={{ icon: 'menu', color: '#fff', }}
                    />
                    {/* Status */}
                    <View style={styles.statusContainer}>
                        <FlatList
                            data={eventMembers}
                            renderItem={({ item, index }) => <EventUser item={item} index={index} event={event} />}
                            keyExtractor={item => item.UserId}
                        />
                    </View>
                    {/* Buttons */}
                    <View style={{ flexDirection: "row" }}>
                        <View style={styles.buttonStyle}>
                            <Button title='Shout' />
                        </View>
                        <View style={styles.buttonStyle}>
                            <Button title='Play' />
                        </View>
                    </View>
                    {/* Event Detail */}
                    <View style={styles.detailContainer} >
                        <EventDetail event={event} eventMembers={eventMembers} />
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    statusContainer: {
        flex: 2,
    },
    buttonStyle: {
        flex: 1,
    },
    detailContainer: {
        flex: 2,
    },
})