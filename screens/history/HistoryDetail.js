import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import UhereHeader from '../../components/UhereHeader';
import Timeline from 'react-native-timeline-flatlist';
import firebase from 'firebase';
import { formatTime, convertDateToLocalTimezone } from "../../utils/date";
import { stringifyNumber } from "../../utils/event"; 
import { getEvents, getEvent } from 'api/event';

export default function HistoryDetail({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [event, setEvent] = React.useState();
    const [user, setUser] = React.useState();
    const [results, setResults] = React.useState();
    const [myRank, setMyRank] = React.useState();

    React.useEffect(() => {
        async function fetchData() {
            let event = await getEvent(route.params.Event.EventId);
            setEvent(event)
            let results = [];
            event.eventUsers.forEach(eventUser => {
                if (eventUser.UserId === firebase.auth().currentUser.uid) {
                    setUser(eventUser);
                }
                let result = { id:eventUser.UserId, time: formatTime(convertDateToLocalTimezone(new Date(eventUser.ArrivedTime))), title: eventUser.Nickname, lineColor: '#15cdca', icon: require('../../assets/images/robot-dev.png') }
                results.push(result);
            });
            results.sort((a, b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));
            setResults(results);
            let index = results.findIndex(x => x.id === firebase.auth().currentUser.uid);
            setMyRank(stringifyNumber(index + 1));
            setIsLoading(false);
        }
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <UhereHeader
                showBackButton={true}
                onPressBackButton={() => navigation.navigate('HistoryScreen')}
            />
            {isLoading !== true && (
                <View style={styles.container}>
                    <Avatar
                        containerStyle={styles.avatarStyle}
                        size="large"
                        rounded
                        source={{
                            uri: user.AvatarURI,
                        }}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.titleText}>
                            You arrived {myRank}!
                        </Text>
                        <Text style={styles.descriptionText}>
                            Congratulate {results[results.length - 1].title} for having the honors to buy everyone!
                        </Text>
                    </View>
                    <View style={styles.timeline}>
                        <Timeline
                            data={results}
                            columnFormat='two-column'
                            circleSize={35}
                            circleColor='rgba(0,0,0,0)'
                            lineColor='#15cdca'
                            timeContainerStyle={{ minWidth: 52 }}
                            timeStyle={{ textAlign: 'center', backgroundColor: '#15cdca', color: 'white', padding: 5, borderRadius: 13 }}
                            options={{
                                style: { paddingTop: 10 }
                            }}
                            innerCircle={'icon'}
                            separator={false}
                            detailContainerStyle={{ marginBottom: 50, alignItems: "center", backgroundColor: "#15cdca", borderRadius: 15 }}
                        />
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    avatarStyle: {
        margin: 15
    },
    textContainer: {
        alignItems: "center",
    },
    titleText: {
        fontSize: 25,
        color: "#15cdca"
    },
    descriptionText: {
        margin:15,
        fontSize: 12,
        color: "#4A4A4A"
    },
    timeline: {
        marginTop: 15,
        width: 362,
        height: 380,
        backgroundColor: 'white'
    }
});