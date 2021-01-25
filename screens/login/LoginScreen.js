import * as React from 'react';
import { Image, StyleSheet, View, ActivityIndicator, TouchableOpacity, TextInput, KeyboardAvoidingView  } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import { Button, Text, Input, Icon, Divider } from 'react-native-elements';
import AuthContext from 'contexts/AuthContext';
import firebase from 'firebase';
import firebaseObject from 'config/firebase';


import googleSignInImage from 'assets/images/buttons/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png';



export default function LoginScreen({route, navigation}) {
  const [ loginEmail, setLoginEmail] = React.useState("");
  const [ loginPassword, setLoginPassword] = React.useState("");
  const [ registerEmail, setRegisterEmail] = React.useState("");
  const [ registerPassword, setRegisterPassword] = React.useState("");
  const [ forgotPasswordEmail, setForgotPasswordEmail] = React.useState("");
  const [ inputFocus, focusToggle] = React.useState({});
  const { signIn, signOut } = React.useContext(AuthContext);

  let firebaseUnsubscribe;
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    

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
      await Facebook.initializeAsync({appId: '2728370123955490'});
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

  function handlerFocus(input) {
    focusToggle({[input]: true})
  }

  function handlerBlur(input) {
    focusToggle({[input]: false})
  }

  return (
    <View style={styles.container}>
      <ScrollView
        centerContent
        contentContainerStyle={{
          flexGrow:1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('assets/images/logos/logo_letter_colored/png/UhereCopy2.imageset/UhereCopy2.png')}
            style={styles.uhereLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Input
            leftIcon={
              <Icon
                type="entypo"
                name="mail"
                color="#4A4A4A"
                size={15}
                iconStyle={inputFocus.emailInputFocus ? styles.inputFocusIcon : styles.inputIcon}
              />
            }
            inputStyle={inputFocus.emailInputFocus ? styles.inputFocusText : styles.inputText}
            inputContainerStyle={inputFocus.emailInputFocus ? styles.inputFocusContainer : styles.inputContainer}
            placeholder="Email"
            placeholderTextColor="#c2c2c2"
            onChangeText={text => setLoginEmail(text)}
            value={loginEmail}
            textContentType="emailAddress"
            keyboardType="email-address"
            onFocus = {() => handlerFocus('emailInputFocus')}
            onBlur = {() => handlerBlur('emailInputFocus')}
          />
          <Input
            leftIcon={
              <Icon
                type="entypo"
                name="lock"
                color="#4A4A4A"
                size={15}
                iconStyle={inputFocus.passwordInputFocus ? styles.inputFocusIcon : styles.inputIcon}
              />
            }
            containerStyle={styles.inputOuterContainer}
            inputStyle={inputFocus.passwordInputFocus ? styles.inputFocusText : styles.inputText}
            inputContainerStyle={inputFocus.passwordInputFocus ? styles.inputFocusContainer : styles.inputContainer}
            placeholder="Password"
            placeholderTextColor="#c2c2c2"
            onChangeText={text => setLoginPassword(text)}
            value={loginPassword}
            textContentType="password"
            secureTextEntry
            onFocus = {() => handlerFocus('passwordInputFocus')}
            onBlur = {() => handlerBlur('passwordInputFocus')}
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
          <Text style={{color: '#5D5D5D'}}>Or</Text>
          <View style={styles.horizontalLine}></View>
        </View>

        <View style={styles.loginIconContainer}>
          <TouchableOpacity onPress={signInWithGoogle}>
            <Icon
              name="google--with-circle"
              type="entypo"
              color="#15CDCA"
              size={40}
              iconStyle={{marginHorizontal: 10}}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={signInWithFacebook}>
            <Icon
              name="facebook-with-circle"
              type="entypo"
              color="#15CDCA"
              size={40}
              style={styles.loginIcon}
              iconStyle={{marginHorizontal: 10}}
            />
          </TouchableOpacity>

        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#5D5D5D'}}>Don't have account?</Text>
          <TouchableOpacity onPress={()=> navigation.navigate('Signup')}>
            <Text style={{color: '#15CDCA'}}> Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },

  inputWrapper: {
    width: "90%"
  },

  inputText: {
    color: '#5D5D5D',
    fontSize: 15
  },

  inputFocusText: {
    color: '#15CDCA',
    fontSize: 15
  },

  inputContainer: {
    marginVertical: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderBottomWidth: 0,
  },

  inputFocusContainer: {
    marginVertical: 10,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#15CDCA"
  },

  inputIcon: {
    paddingRight: 10
  },

  inputFocusIcon: {
    color: "#15CDCA",
    paddingRight: 10
  },

  forgot: {
    color: "#5D5D5D",
    fontSize: 11
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#15CDCA",
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
  uhereLogo:{
    width: 150,
    height: 50
  },
  logoContainer: {
    margin: 50,
  },
  loginIconContainer: {
    margin: 10,
    flexDirection: 'row',
  },
  horizontalLine: {
    backgroundColor: '#5D5D5D',
    width: '45%',
    height: 1,
  }
});
