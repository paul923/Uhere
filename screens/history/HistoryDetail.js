import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import UhereHeader from '../../components/UhereHeader';
import Timeline from 'react-native-timeline-flatlist';
import firebase from 'firebase';
import { formatTime, convertDateToLocalTimezone } from "../../utils/date";
import { stringifyNumber } from "../../utils/event"; 
import { getEvent } from 'api/event';

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
                let result = { 
                    id: eventUser.UserId, 
                    time: formatTime(convertDateToLocalTimezone(new Date(eventUser.ArrivedTime))), 
                    title: eventUser.Nickname,
                    timeColor: eventUser.ArrivedTime < event.DateTime ? "#57e889" : "#ff3653",
                    late: eventUser.ArrivedTime < event.DateTime ? false : true,
                    icon: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                    me: eventUser.UserId === firebase.auth().currentUser.uid ? true : false,
                }
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

    function renderDetail(rowData, SectionID, rowID){


        return (
            <View style={styles.timelinedetailContainerStyle}>
                <View style={styles.cardRow}>
                    <View style={styles.nametime}>
                        <Text>{rowData.title}</Text>
                        <Text style={{color: rowData.timeColor}}>{rowData.time}</Text>
                    </View>
                    <Avatar
                        size="small"
                        rounded
                        source={{
                            uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                        }}
                    />
                    {rowData.me == true && (
                        <View>
                            <Text>ME</Text>
                        </View>
                    ) || (
                        <View>
                            <Text>NOT ME</Text>
                        </View>
                    )}
                </View>
            </View>
        )
    }

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
                        <Text style={styles.descriptionText}>
                            Congratulate {results[results.length - 1].title} for having the honors to buy everyone!
                        </Text>
                        <Text style={styles.titleText}>
                            You arrived {myRank}!
                        </Text>
                    </View>
                    <View style={styles.timeline}>
                        <Timeline
                            data={results}
                            showTime={false}
                            circleSize={25}
                            circleColor='#15cdca'
                            lineColor='#15cdca'
                            options={{
                                style: { paddingTop: 25 }
                            }}
                            innerCircle={'dot'}
                            separator={false}
                            //detailContainerStyle={{ marginBottom: 50, alignItems: "center", backgroundColor: "white", borderRadius: 15 }}
                            renderDetail={renderDetail}
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
    },
    timelinedetailContainerStyle: {
        backgroundColor: "white",
        height: 60,
        width: 310,
        justifyContent: "center",
        marginBottom: 30
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    nametime: {
        alignSelf: "auto"
    }
});