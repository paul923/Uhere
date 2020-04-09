import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, TextInput, KeyboardAvoidingView  } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import { Image, Button, Text, Input, Icon, Divider } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'






export default function LoginTestScreen({navigation}) {
  const [ loginEmail, setLoginEmail] = React.useState("");
  const [ loginPassword, setLoginPassword] = React.useState("");
  const [ registerEmail, setRegisterEmail] = React.useState("");
  const [ registerPassword, setRegisterPassword] = React.useState("");
  const [ forgotPasswordEmail, setForgotPasswordEmail] = React.useState("");




  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          flexGrow: 1
        }}
        bounces={false}
      >
      <ScrollView 
        centerContent
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
        }}
      >
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
        >
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', width: '80%', justifyContent: 'space-between', alignItems: 'center', }}>
          <View style={styles.horizontalLine}></View>
          <Text style={{color: 'white'}}>Or</Text>
          <View style={styles.horizontalLine}></View>
        </View>

        <View style={styles.loginIconContainer}>
          <TouchableOpacity>
            <Icon
              name="google--with-circle"
              type="entypo"
              color="white"
              size={40}
              iconStyle={{marginHorizontal: 10}}
            />
          </TouchableOpacity>

          <TouchableOpacity>
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
      </ScrollView>
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
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
