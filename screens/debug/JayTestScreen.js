import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements'

export default function JayTestScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Button
                title='EventDetailMapView'
                buttonStyle={styles.button}
                onPress={() => navigation.navigate('EventDetailMapView')}
            />
            <Button
                title='EventDetail'
                buttonStyle={styles.button}
                onPress={() => navigation.navigate('EventDetail')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        justifyContent: 'center'
    },
    button: {
        margin: 5,
        height: 50
    }
});