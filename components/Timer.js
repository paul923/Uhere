import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { millisToMinutesAndSeconds } from "../utils/date";


export default function Timer({ eventDateTime }) {
    const [timer, setTimer] = React.useState(eventDateTime - new Date())
    React.useEffect(() => {
        let interval = null;
        interval = setInterval(() => {
            if (eventDateTime - new Date() > 0) {
                setTimer(eventDateTime - new Date());
            } else {
                setTimer(0);
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Text style={styles.timer}>{millisToMinutesAndSeconds(timer)}</Text>
    )
}

const styles = StyleSheet.create({
    timer: {
        fontSize: 30,
    }
});