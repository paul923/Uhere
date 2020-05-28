import * as React from 'react';
import { StyleSheet, StatusBar, FlatList, View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import { Avatar, Header, Button, Icon } from 'react-native-elements';
import EventDetail from './EventDetail'
import { getEventByID, getEventMembers } from '../../API/EventAPI'
import { formatDate, formatTime } from "../../utils/date";

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

    function Item({ item, index }) {
        return (
            <View style={styles.item}>
                <View style={styles.row}>
                    <Text style={styles.title}>{index + 1}.</Text>
                    <View style={styles.column}>
                        <Text style={styles.title}>{item.Nickname}</Text>
                    </View>
                    <Text style={styles.status}>{new Date(item.ArrivedTime) <= new Date(event.DateTime) ? 'On Time' : 'Late'}</Text>
                </View>
            </View>
        );
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
                            renderItem={({ item, index }) => <Item item={item} index={index} />}
                            keyExtractor={item => item.UserId}
                        />
                    </View>
                    {/* Buttons */}
                    <View style={{ flexDirection: "row" }}>
                        <View style={styles.buttonStyle}>
                            <Button title='Shout'/>
                        </View>
                        <View style={styles.buttonStyle}>
                            <Button title='Play'/>
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
        flex: 1,
    },
    buttonStyle:{
        flex: 1,
    },
    detailContainer: {
        flex: 1,
    },
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
    },
    status: {
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    column: {
        marginLeft: 15,
    },
})