import * as React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { millisToMinutesAndSeconds } from "../utils/date";
import { Appearance, useColorScheme } from 'react-native-appearance';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const GEO_FENCING_TASK_NAME = 'geofencing';


// Task Manager 
TaskManager.defineTask(GEO_FENCING_TASK_NAME, ({ data: { eventType, region }, error }) => {
    if (error) {
      console.log(error);
      return;
    }
    if (eventType === Location.GeofencingEventType.Enter) {
      console.log("You've entered region:", region);
      Alert.alert("You've entered region");
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.log("You've left region:", region);
      Alert.alert("You've left region");
    }
  });
  


export default function Timer({ eventDateTime, event }) {
    const [timer, setTimer] = React.useState(new Date(eventDateTime) - new Date() >= 1800000 ? 1800000 : new Date(eventDateTime) - new Date());
    let colorScheme = useColorScheme();
    React.useEffect(() => {
        if (new Date(eventDateTime) - new Date() <= 1800000){
            startGeoFencing(event.LocationGeolat, event.LocationGeolong);
        }
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

    async function startGeoFencing(latitude, longitude) {
        console.log('starting geo fencing with radius 500m from', latitude, longitude);
        // let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        // let regions = [
        //     {
        //         latitude: location.coords.latitude,
        //         longitude: location.coords.longitude,
        //         radius: 50,
        //         notifyOnEnter: true,
        //         notifyOnExit: true,
        //     }
        // ]
        let regions = [
            {
                latitude: latitude,
                longitude: longitude,
                radius: 500,// in meters
                notifyOnEnter: true,
                notifyOnExit: true,
            }
        ]
        Location.startGeofencingAsync(GEO_FENCING_TASK_NAME, regions)
    }

    return (
        <View style={styles.container}>
            <Text style={colorScheme === 'dark' ? styles.dark : styles.normal}>{millisToMinutesAndSeconds(timer)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width:200,
        height:60,
        backgroundColor: 'white',
        justifyContent:'center',
        alignItems:'center',
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