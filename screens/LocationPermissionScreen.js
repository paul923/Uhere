import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Linking } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Application from 'expo-application';
import Constants from 'expo-constants';

export default class LocationPermissionScreen extends Component {
    
    render () {
        return (
        <View style={styles.container}>
            <Text style={styles.paragraph}>
                Please Allow uhere to access your Location "Always"
            </Text>
            {Platform.OS === 'ios' ? (
              <Button title="Go to Settings" onPress={() => Linking.openURL('app-settings:')} />
            ) : (
              <Button title="Go to Settings" onPress={() => IntentLauncher.startActivityAsync(
                IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                {
                  data: `package:${Application.applicationId}`,
                }
              )} />
            )}
        </View>);
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

