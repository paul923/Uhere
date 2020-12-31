import * as React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { millisToMinutesAndSeconds } from "../utils/date";
import { Appearance, useColorScheme } from 'react-native-appearance';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { updateArrivedTime } from '../api/event';
import firebase from 'firebase';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { rearg } from 'lodash';


export default function Timer({ eventDateTime, event }) {
    const [timer, setTimer] = React.useState(new Date(eventDateTime) - new Date() >= 1800000 ? 1800000 : new Date(eventDateTime) - new Date());
    let colorScheme = useColorScheme();
    React.useEffect(() => {
        let interval = null;
        interval = setInterval(() => {
            if (new Date(eventDateTime) - new Date() > 0) {
                setTimer(new Date(eventDateTime) - new Date() >= 1800000 ? 1800000 : new Date(eventDateTime) - new Date());
            } else {
                setTimer(0);
                Location.stopGeofencingAsync(GEO_FENCING_TASK_NAME);
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={colorScheme === 'dark' ? styles.dark : styles.normal}>{millisToMinutesAndSeconds(timer)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 60,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    normal: {
        fontSize: 30,
        color: '#15cdca',
    },
    dark: {
        fontSize: 30,
        color: '#15cdca',
    },
});