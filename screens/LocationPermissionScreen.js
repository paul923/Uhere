import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export default class LocationPermissionScreen extends Component {
   
    componentDidMount() {
        this.getLocationAsync();
    }

    async getLocationAsync() {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.LOCATION);
        let finalStatus = existingStatus;
        console.log('Current Status:' + finalStatus);
        if (finalStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.LOCATION);
            console.log('After asking:' + status);
            finalStatus = status;
        }
        if (existingStatus === 'granted' || finalStatus === 'granted'){
            this.props.updateLocationGranted(true);
        }
        // check agin
        if (finalStatus !== 'granted') {
            return;
        }
    }

    render () {
        return (
        <View style={styles.container}>
            <Text style={styles.paragraph}>
                Please Allow uhere to access your Location
            </Text>
            <Button title="Ask Permission" onPress={() => this.getLocationAsync()} />
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

