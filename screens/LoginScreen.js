import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, TextInput  } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import { Image, Button, Text, Input, Icon, Divider } from 'react-native-elements';
import AuthContext from '../contexts/AuthContext';
import firebase from 'firebase';
import firebaseObject from '../config/firebase';


import googleSignInImage from '../assets/images/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png';



export default function LoginScreen({navigation}) {
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
      <Text style={styles.logoContainer}>
        <Text style={styles.logoU}>u</Text>
        <Text style={styles.logoHere}>Here</Text>
      </Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={text => setLoginEmail(text)}
          value={loginEmail}
          textContentType="emailAddress"
        />
      </View> 

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          onChangeText={text => setLoginPassword(text)}
          value={loginPassword}
          textContentType="password"
        />
      </View>


      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgot}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.loginBtn}
        onPress={signInWithEmail}
      >
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>

      <View style={{flexDirection: 'row', width: '80%', justifyContent: 'space-between', alignItems: 'center', }}>
        <View style={styles.horizontalLine}></View>
        <Text style={{color: 'white'}}>Or</Text>
        <View style={styles.horizontalLine}></View>
      </View>

      <View style={styles.loginIconContainer}>
        <TouchableOpacity onPress={signInWithGoogle}>
          <Icon 
            name="google--with-circle" 
            type="entypo" 
            color="white"
            size={40}
            iconStyle={{marginHorizontal: 10}}
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={signInWithFacebook}>
          <Icon 
            name="facebook-with-circle" 
            type="entypo" 
            color="white"
            size={40}
            style={styles.loginIcon}
            iconStyle={{marginHorizontal: 10}}
          />
        </TouchableOpacity>
        
      </View>

      <View style={{flexDirection: 'row'}}>
        <Text style={{color: 'white'}}>Don't have account?</Text>
        <TouchableOpacity onPress={()=> navigation.navigate('Signup')}>
          <Text style={{color: '#7f9fad'}}> Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputView: {
    width: "80%",
    backgroundColor: "#465881",
    borderRadius: 20,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },

  inputText: {
    height: 50,
    color: 'white'
  },

  forgot: {
    color: "white",
    fontSize: 11
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 20
  },
  loginText: {
    color: "white",
    fontWeight: "bold"
  },
  logoU: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white"
  }, 
  logoHere: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#fb5b5a"
  },
  logoContainer: {
    margin: 30,
  },
  loginIconContainer: {
    margin: 10,
    flexDirection: 'row',
  },
  horizontalLine: {
    backgroundColor: 'white',
    width: '45%',
    height: 1,
  }
});
