import * as React from 'react';
import { StyleSheet, View,Image, TouchableOpacity } from 'react-native';
import { Text, Avatar, Icon, Button } from 'react-native-elements';
import { formatDate, formatTime, convertDateToLocalTimezone } from "../utils/date";
export default function ResultTimeLine(props) {
    return (
        <View style={styles.container}>
            <View style={styles.right}>
                <Text style={styles.nicknameText}>{props.Nickname}</Text>
                <Text style={styles.timeText}>{formatTime(convertDateToLocalTimezone(new Date(props.ArrivedTime)))}</Text>
            </View>
            <View style={styles.timeBar}>
                <Avatar
                    rounded
                    size="small"
                />
                <Text>|</Text>
            </View>
            <View style={styles.left}>
                <Text style={styles.nicknameText}>{props.Nickname}</Text>
                <Text style={styles.timeText}>{formatTime(convertDateToLocalTimezone(new Date(props.ArrivedTime)))}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 332,
        height: 50,
        backgroundColor: "white",
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    timeBar:{
        alignItems: "center"
    },
    right: {
        marginRight:30,
        alignItems: "flex-end",
    },
    left: {
        marginLeft:30,
        alignItems: "flex-start",
    },
    nicknameText: {

    },
    timeText: {

    }
});