import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import { Image, Button, Text, Input, Icon } from 'react-native-elements';
import AuthContext from '../contexts/AuthContext';
import firebase from 'firebase';
import firebaseObject from '../config/firebase';


import googleSignInImage from '../assets/images/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png';



export default function LoginScreen() {
  const [ email, setEmail] = React.useState("");
  const [ password, setPassword] = React.useState("");
  const { signIn, signOut } = React.useContext(AuthContext);


  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    // Listen for authentication state to change.
    firebaseObject.auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log("We are authenticated now!");
        signIn(user.uid);
      }
    });
  }, []);

  signInWithEmail = async () => {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  }

  signInWithGoogle = async () => {
    try {
      await GoogleSignIn.initAsync({});
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        const credential = firebase.auth.GoogleAuthProvider.credential(user.auth.idToken, user.auth.accessToken);
        firebaseObject.auth().signInWithCredential(credential).catch((error) => {
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
        firebaseObject.auth().signInWithCredential(credential).catch((error) => {
          // Handle Errors here.
        });
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }


  return (
    <View style={styles.container}>
      <Input
        placeholder='Email'
        leftIcon={
          <Icon
            name='email'
            size={24}
            color='black'
          />
        }
        onChangeText={text => {setEmail(text); console.log(text)}}
        value={email}
        textContentType="emailAddress"
      />
      <Input
        placeholder='Password'
        leftIcon={
          <Icon
            name='lock'
            size={24}
            color='black'
          />
        }
        onChangeText={text => setPassword(text)}
        value={password}
        textContentType="password"
        secureTextEntry
      />
      <Button
        title="SIGN IN"
        onPress={() => signInWithEmail()}
        />
      <TouchableOpacity onPress={() => signInWithGoogle()}>
        <Image
          source={googleSignInImage}
          style={{ width: 200, height: 50 }}
          PlaceholderContent={<ActivityIndicator />}
        />
      </TouchableOpacity>
      <Button
        title="SIGN IN WITH FACEBOOK"
        onPress={() => signInWithFacebook()}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    }
});
