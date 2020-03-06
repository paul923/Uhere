import * as React from 'react';
import { Button, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';

import { Image } from 'react-native-elements';

import googleSignInImage from '../assets/images/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png';

export default class LoginScreen extends React.Component {
  state = { user: null };

  componentDidMount() {
    this.initAsync();
  }

  initAsync = async () => {
    await GoogleSignIn.initAsync({});
    this._syncUserWithStateAsync();
  };

  _syncUserWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    this.setState({ user });
  };

  signOutAsync = async () => {
    await GoogleSignIn.signOutAsync();
    this.setState({ user: null });
  };

  signInWithGoogle = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        this._syncUserWithStateAsync();
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.signInWithGoogle()}>
          <Image
            source={googleSignInImage}
            style={{ width: 200, height: 50 }}
            PlaceholderContent={<ActivityIndicator />}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    }
});
