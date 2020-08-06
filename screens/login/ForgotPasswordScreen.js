import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import {Icon, Header} from 'react-native-elements'

import firebaseObject from 'config/firebase';


export default class ForgotPasswordScreen extends Component {
  resetPassword = async () => {
    firebaseObject.auth()
                  .sendPasswordResetEmail(this.state.forgotPasswordEmail)
                  .then(function() {
                    alert("Please check your email to reset password");
                  }).catch(function(error) {
                    // An error happened.
                    var errorMessage = error.message;
                    alert(errorMessage);
                  });
  }

  state = {
    forgotPasswordEmail: "",
  }

  render(){
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon
              name="arrow-left"
              type="entypo"
              color= "white"
              size={30}
              underlayColor= "transparent"
              onPress={()=> this.props.navigation.goBack()}
            />
          }
          centerComponent={{text: 'Forgot Password', style: {color: 'white', fontSize: 25, fontWeight: 'bold'}}}
          containerStyle={{
            backgroundColor: 'transparent',
            borderBottomWidth: 0
          }}
        />

        <View style={styles.bodyContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                placeholderTextColor="#003f5c"
                value={this.state.forgotPasswordEmail}
                textContentType="emailAddress"
                onChangeText={text => this.setState({email: text})}
                placeholder='Type Your Email'
              />
            </View>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={this.resetPassword}>
            <Text style={styles.loginText}>SIGN UP</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
  },

  bodyContainer:{
    padding: 20,
    width: '100%',
    alignItems: 'center'
  },

  inputView: {
    backgroundColor: "#465881",
    borderRadius: 15,
    height: 50,
    marginBottom: 10,
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
  confirmButton: {
    width: "100%",
    backgroundColor: "#00cc66",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
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
  inputContainer: {
    width: "100%"
  },
  inputDetail: {
    fontSize: 15,
    color: 'white',
    fontWeight: "bold",
    margin: 5
  }
});
