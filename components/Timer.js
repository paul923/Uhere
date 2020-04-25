import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { millisToMinutesAndSeconds } from "../utils/date";
import { Appearance, useColorScheme } from 'react-native-appearance';


export default function Timer({ eventDateTime }) {
    const [timer, setTimer] = React.useState(new Date(eventDateTime) - new Date());
    let colorScheme = useColorScheme();
    React.useEffect(() => {
        console.log(colorScheme)
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
        <Text style={colorScheme === 'dark' ? styles.dark : styles.normal}>{millisToMinutesAndSeconds(timer)}</Text>
    )
}

const styles = StyleSheet.create({
    normal: {
        fontSize: 30,
        color: 'black',
    },
    dark: {
        fontSize: 30,
        color: 'white',
    },
});