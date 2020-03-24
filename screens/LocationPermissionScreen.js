import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Linking , AppState} from 'react-native';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export default class LocationPermissionScreen extends Component {
    
    render () {
        return (
        // need separate logic for android
        <View style={styles.container}>
            <Text style={styles.paragraph}>
                Please Allow uhere to access your Location "Always"
            </Text>
            <Button title="Go to Settings" onPress={() => Linking.openURL('app-settings:')} />
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

