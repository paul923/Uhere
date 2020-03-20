import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import { Image, Button, Text, Input, Icon, Divider } from 'react-native-elements';
import AuthContext from '../contexts/AuthContext';
import firebase from 'firebase';
import firebaseObject from '../config/firebase';


import googleSignInImage from '../assets/images/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png';



export default function LoginScreen() {
  const [ loginEmail, setLoginEmail] = React.useState("");
  const [ loginPassword, setLoginPassword] = React.useState("");
  const [ registerEmail, setRegisterEmail] = React.useState("");
  const [ registerPassword, setRegisterPassword] = React.useState("");
  const [ forgotPasswordEmail, setForgotPasswordEmail] = React.useState("");
  const { signIn, signOut } = React.useContext(AuthContext);


  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    // Listen for authentication state to change.
    firebaseObject.auth().onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        console.log("We are authenticated now!");
        signIn(user.uid);
      } else if (user && !user.emailVerified) {
        alert("Email is not verified. Please verify the email");
        user.sendEmailVerification().then(function() {
          alert("Please check your email to verify");
        }).catch(function(error) {
          // An error happened.
          var errorMessage = error.message;
          alert(errorMessage);
        });
      }
    });
  }, []);

  resetPassword = async () => {
    firebaseObject.auth()
                  .sendPasswordResetEmail(forgotPasswordEmail)
                  .then(function() {
                    alert("Please check your email to reset password");
                  }).catch(function(error) {
                    // An error happened.
                    var errorMessage = error.message;
                    alert(errorMessage);
                  });
  }
  registerWithEmail = async () => {
    firebaseObject.auth()
            .createUserWithEmailAndPassword(registerEmail, registerPassword)
            .catch(function(error) {
              // Handle Errors here.
              var errorMessage = error.message;
              alert(errorMessage);
            });
  }

  signInWithEmail = async () => {
    firebaseObject.auth()
            .signInWithEmailAndPassword(loginEmail, loginPassword)
            .catch(function(error) {
              // Handle Errors here.
              var errorMessage = error.message;
              alert(errorMessage);
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
          var errorMessage = error.message;
          alert(errorMessage);
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
          var errorMessage = error.message;
          alert(errorMessage);
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
        onChangeText={text => setLoginEmail(text)}
        value={loginEmail}
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
        onChangeText={text => setLoginPassword(text)}
        value={loginPassword}
        textContentType="password"
        secureTextEntry
      />
      <Button
        title="SIGN IN"
        onPress={signInWithEmail}
        />
      <TouchableOpacity onPress={signInWithGoogle}>
        <Image
          source={googleSignInImage}
          style={{ width: 200, height: 50 }}
          PlaceholderContent={<ActivityIndicator />}
        />
      </TouchableOpacity>
      <Button
        title="SIGN IN WITH FACEBOOK"
        onPress={signInWithFacebook}
        />
      <Text style={{marginTop: 10}} h5>Do Not Have Account Yet?</Text>
      <Input
        placeholder='Email'
        leftIcon={
          <Icon
            name='email'
            size={24}
            color='black'
          />
        }
        onChangeText={text => setRegisterEmail(text)}
        value={registerEmail}
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
        onChangeText={text => setRegisterPassword(text)}
        value={registerPassword}
        textContentType="password"
        secureTextEntry
      />
      <Button
        title="REGISTER"
        onPress={registerWithEmail}
        />
      <Text style={{marginTop: 10}} h5>Forgot Password?</Text>
      <Input
        placeholder='Email'
        leftIcon={
          <Icon
            name='email'
            size={24}
            color='black'
          />
        }
        onChangeText={text => setForgotPasswordEmail(text)}
        value={forgotPasswordEmail}
        textContentType="emailAddress"
      />
      <Button
        title="RESET PASSWORD"
        onPress={resetPassword}
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
