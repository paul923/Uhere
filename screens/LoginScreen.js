import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import * as firebase from 'firebase';
import { Image, Button, Text } from 'react-native-elements';

import googleSignInImage from '../assets/images/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAHzlzyQGQDqDxeDwwYs7o9rkgD4z7Tp6Y",
  authDomain: "fluid-uhere.firebaseapp.com",
  databaseURL: "https://fluid-uhere.firebaseio.com",
  projectId: "fluid-uhere",
  storageBucket: "fluid-uhere.appspot.com",
  messagingSenderId: "605844819615",
  appId: "1:605844819615:web:e539873a514255ba875caa",
  measurementId: "G-XYCTQHJC1Q"
};

firebase.initializeApp(firebaseConfig);




export default class LoginScreen extends React.Component {
  state = { user: null };

  componentDidMount() {
    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log("We are authenticated now!");
        this.setState({
          user: user.displayName
        })
      }
    });
    this.initAsync();

  }

  initAsync = async () => {
    await GoogleSignIn.initAsync({});
  };

  signInWithGoogle = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        const credential = firebase.auth.GoogleAuthProvider.credential(user.auth.idToken, user.auth.accessToken);
        firebase.auth().signInWithCredential(credential).catch((error) => {
          // Handle Errors here.
        });
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };

  signInWithFacebook = async () => {
    try {
      await Facebook.initializeAsync('2728370123955490');
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebase.auth().signInWithCredential(credential).catch((error) => {
          // Handle Errors here.
        });
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  signOut = async () => {
    firebase.auth().signOut().then(() => {
      this.setState({
        user: null
      })
    })
  }

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
        <Button
          title="SIGN IN WITH FACEBOOK"
          onPress={() => this.signInWithFacebook()}
          />
        <Button
          title="SIGN OUT"
          onPress={() => this.signOut()}
          />
        <Text h4>Logged in as: {this.state.user}</Text>
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
