import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { millisToMinutesAndSeconds } from "../utils/date";
import { Appearance, useColorScheme } from 'react-native-appearance';


export default function Timer({ eventDateTime }) {
    const [timer, setTimer] = React.useState(new Date(eventDateTime) - new Date());
    let colorScheme = useColorScheme();
    React.useEffect(() => {
        let interval = null;
        interval = setInterval(() => {
            if (new Date(eventDateTime) - new Date() > 0) {
                setTimer(new Date(eventDateTime) - new Date());
            } else {
                setTimer(0);
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