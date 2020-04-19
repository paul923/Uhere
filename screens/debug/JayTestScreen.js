import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements'
import Timer from '../../components/Timer'

export default function JayTestScreen({ navigation }) {
    let eventDateTime = new Date(2020,3,18,13,30);
    console.log('render');
    return (
        <View style={styles.container}>
            <Button
                title='EventDetailMapView'
                buttonStyle={styles.button}
                onPress={() => navigation.navigate('EventDetailMapView')}
            />
            <Timer eventDateTime={eventDateTime}></Timer>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF00',
        justifyContent: 'center'
    },
    button: {
        margin: 5,
        height: 50
    }
});