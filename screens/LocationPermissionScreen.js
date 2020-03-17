import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Linking , AppState} from 'react-native';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export default class LocationPermissionScreen extends Component {
   
    state = {
        appState : AppState.currentState,
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        this.getLocationAsync();
    }

    componentWillUnmount(){
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
          console.log('App has come to the foreground!');
          this.checkWhenforeground();
        }
        this.setState({appState: nextAppState});
      };

    async checkWhenforeground() {
        // this is messy right now, need to clean up the logic after learning more about returned promises for ios
        const { status: existingStatus } = await Permissions.getAsync(Permissions.LOCATION);
        let finalStatus = existingStatus;
        console.log('Current Status:' + finalStatus);
        if (finalStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.LOCATION);
            console.log('After asking:' + status);
            finalStatus = status;
        }
        if (existingStatus === 'granted' || finalStatus === 'granted'){
            this.props.updateLocationGranted(true);
        }
    }
    
    async getLocationAsync() {
        // this is messy right now, need to clean up the logic after learning more about returned promises for ios
        const { status: existingStatus } = await Permissions.getAsync(Permissions.LOCATION);
        let finalStatus = existingStatus;
        console.log('Current Status:' + finalStatus);
        if (finalStatus !== 'granted') {
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
        // denied(Never) means not allow need to lead user to go to settings cant even ask if tis denied
    }

    render () {
        return (
        <View style={styles.container}>
            <Text style={styles.paragraph}>
                Please Allow uhere to access your Location
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

