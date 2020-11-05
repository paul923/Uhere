import * as React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Avatar, Button, Image } from 'react-native-elements';
import UhereHeader from '../../components/UhereHeader';
import Timeline from 'react-native-timeline-flatlist';
import firebase from 'firebase';
import { formatTime, convertDateToLocalTimezone } from "../../utils/date";
import { stringifyNumber } from "../../utils/event";
import { getEvent } from 'api/event';
import { getAvatarImage, avatarData } from "../../utils/asset.js";

export default function HistoryDetail({ navigation, route }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [event, setEvent] = React.useState();
    const [user, setUser] = React.useState();
    const [results, setResults] = React.useState();
    const [myRank, setMyRank] = React.useState();
    const [lateCount, setLateCount] = React.useState(null);

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
                    UserId: eventUser.UserId,
                    LateFlag: eventUser.ArrivedTime === null ? "LATE" : formatTime(convertDateToLocalTimezone(new Date(eventUser.ArrivedTime))),
                    EventId: eventUser.EventId,
                    Nickname: eventUser.Nickname,
                    AvatarColor: eventUser.AvatarColor,
                    LineColor: eventUser.ArrivedTime < event.DateTime ? "#57e889" : "#ff3653",
                    CircleColor: eventUser.ArrivedTime < event.DateTime ? "#57e889" : "#ff3653",
                    TimeColor: eventUser.ArrivedTime < event.DateTime ? "#57e889" : "#ff3653",
                    AvatarURI: eventUser.AvatarURI,
                    CurrentUser: eventUser.UserId === firebase.auth().currentUser.uid ? true : false,
                    PenaltyUser: eventUser.PenaltyUser,
                    Penalty: eventUser.UserId === event.PenaltyUser ? true : false,
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
                <View style={styles.resultCard}>
                    <View style={styles.nametime}>
                        <Text style={{color: '#15cdca'}}>{rowData.Nickname}</Text>
                        <Text style={{color: rowData.TimeColor}}>{rowData.LateFlag}</Text>
                    </View>
                    <View style={styles.avatar}>
                    <Avatar
                        size="small"
                        rounded
                        imageProps= {{
                            style: {
                                tintColor: rowData.AvatarColor
                            }
                        }}
                        source={getAvatarImage(rowData.AvatarURI)}
                        placeholderStyle={{backgroundColor: "transparent"}}
                    />
                    </View>
                    <View style={styles.avatar}>
                    {rowData.CurrentUser == true && (
                        <Avatar
                            size={25}
                            rounded
                            title="ME"
                            overlayContainerStyle={{backgroundColor: '#15cdca'}}
                        />
                    ) || (
                        <Avatar
                            size={25}
                            rounded
                            title=""
                            overlayContainerStyle={{backgroundColor: 'white'}}
                        />
                    )}
                    </View>
                    <View style={styles.avatar}>
                    {rowData.Penalty == true && (
                        <Image
                            style={styles.penalty}
                            source={require('../../assets/images/miscs/penalty.png')}
                            placeholderStyle={{backgroundColor:'transparent'}}
                        />
                    ) || (
                        <Avatar
                            size="small"
                            rounded
                            title=""
                            overlayContainerStyle={{backgroundColor: 'white'}}
                        />
                    )}
                    </View>
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
                        source={getAvatarImage(user.AvatarURI)}
                        placeholderStyle={{backgroundColor: "transparent"}}
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
                            options={{
                                style: { paddingTop: 25 }
                            }}
                            innerCircle={'dot'}
                            separator={false}
                            renderDetail={renderDetail}
                        />
                    </View>
                    <Button
                        title="Play Game"
                        disabled={event.PenaltyUser || results.filter(user => user.LateFlag === 'LATE').length === 0 ? true : false}
                        containerStyle= {{
                            marginVertical: 10
                        }}
                        onPress={() => {
                            navigation.navigate('Result Late Screen', results.filter(user => user.LateFlag === 'LATE'))
                        }}
                    />
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
        flex: 1,
        backgroundColor: 'white'
    },
    timelinedetailContainerStyle: {
        backgroundColor: "white",
        height: 60,
        width: 310,
        marginBottom: 30
    },
    resultCard: {
        flexDirection: "row",
    },
    nametime: {
        flex: 3,
        alignSelf: "auto",
        overflow: 'hidden',
    },
    avatar: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    penalty: {
        width: 30,
        height: 30,
      },
});
