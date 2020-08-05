import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import {Icon, Header, Input} from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';


import firebaseObject from '../config/firebase';



export default class SignUp extends Component {

  handlerFocus = (input) => {
    this.setState({
      [input]:true
    });
  };

  handlerBlur = (input) => {
    this.setState({
      [input]:false
    });
  };

  registerWithEmail = async () => {
    if(this.state.registerPassword !== this.state.confirmPassword){
      alert('Please confirm your password');
    } else {
      firebaseObject.auth()
            .createUserWithEmailAndPassword(this.state.registerEmail, this.state.registerPassword)
            .then((newUser) => {
              newUser.user.sendEmailVerification().then(() => {
                alert("Please check your email to verify");
                firebaseObject.auth().signOut();
                this.props.navigation.goBack();
              }).catch((error) => {
                // An error happened.
                var errorMessage = error.message;
                alert(errorMessage);
              });
            }, (error) => {
              // Handle Errors here.
              var errorMessage = error.message;
              alert(errorMessage);
            })
    }

  }

  state = {
    registerEmail: "",
    registerPassword: "",
    confirmPassword: "",
  }
  render(){
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon
              name="arrowleft"
              type="antdesign"
              color="#4A4A4A"
              size={30}
              underlayColor= "transparent"
              onPress={()=> this.props.navigation.goBack()}
            />
          }
          containerStyle={{
            backgroundColor: 'transparent',
            borderBottomWidth: 0
          }}
        />
        <ScrollView
          centerContent
          contentContainerStyle={{
            alignItems: 'center',
            padding: 20,
            flexGrow: 1,
          }}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Let's Get Started!</Text>
            <Text style={styles.subHeaderText}>Create an account with Uhere to get all features</Text>
          </View>

          <View style={styles.bodyContainer}>
            <Input
              leftIcon={
                <Icon
                  type="entypo"
                  name="mail"
                  color="#4A4A4A"
                  size={15}
                  iconStyle={this.state.emailInputFocus ? styles.inputFocusIcon : styles.inputIcon}
                />
              }
              inputStyle={this.state.emailInputFocus ? styles.inputFocusText : styles.inputText}
              inputContainerStyle={this.state.emailInputFocus ? styles.inputFocusContainer : styles.inputContainer}
              placeholder="Email"
              placeholderTextColor="#c2c2c2"
              onChangeText={text => this.setState({registerEmail: text})}
              value={this.state.registerEmail}
              textContentType="emailAddress"
              keyboardType="email-address"
              onFocus = {() => this.handlerFocus('emailInputFocus')}
              onBlur = {() => this.handlerBlur('emailInputFocus')}
            />
            <Input
              leftIcon={
                <Icon
                  type="entypo"
                  name="lock"
                  color="#4A4A4A"
                  size={15}
                  iconStyle={this.state.passwordInputFocus ? styles.inputFocusIcon : styles.inputIcon}
                />
              }
              containerStyle={styles.inputOuterContainer}
              inputStyle={this.state.passwordInputFocus ? styles.inputFocusText : styles.inputText}
              inputContainerStyle={this.state.passwordInputFocus ? styles.inputFocusContainer : styles.inputContainer}
              placeholder="Password (6 or more character)"
              placeholderTextColor="#c2c2c2"
              onChangeText={text => this.setState({registerPassword: text})}
              value={this.state.registerPassword}
              textContentType="password"
              secureTextEntry
              onFocus = {() => this.handlerFocus('passwordInputFocus')}
              onBlur = {() => this.handlerBlur('passwordInputFocus')}
            />

            <Input
              leftIcon={
                <Icon
                  type="entypo"
                  name="lock"
                  color="#4A4A4A"
                  size={15}
                  iconStyle={this.state.confirmPasswordInputFocus ? styles.inputFocusIcon : styles.inputIcon}
                />
              }
              inputStyle={this.state.confirmPasswordInputFocus ? styles.inputFocusText : styles.inputText}
              inputContainerStyle={this.state.confirmPasswordInputFocus ? styles.inputFocusContainer : styles.inputContainer}
              placeholder="Confirm Password"
              placeholderTextColor="#c2c2c2"
              onChangeText={text => this.setState({confirmPassword:text})}
              secureTextEntry
              onFocus = {() => this.handlerFocus('confirmPasswordInputFocus')}
              onBlur = {() => this.handlerBlur('confirmPasswordInputFocus')}
            />

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={this.registerWithEmail}
            >
              <Text style={styles.signupText}>SIGN UP</Text>
            </TouchableOpacity>

            <View style={{flexDirection: 'row', margin: 20}}>
              <Text style={{color: '#5D5D5D'}}>Already have an account?</Text>
              <TouchableOpacity onPress={()=> navigation.goBack()}>
                <Text style={{color: '#15CDCA'}}> Login Here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }


}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  headerContainer: {
    alignItems: 'center',
    marginVertical: 30
  },

  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    padding: 5
  },

  subHeaderText: {
    fontSize: 12,
    color: "grey",
    padding: 5
  },

  bodyContainer:{
    width: '100%',
    alignItems: 'center',
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
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderBottomWidth: 0,
  },

  inputFocusContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#15CDCA"
  },

  inputOuterContainer: {
    marginVertical: 15,
  },

  inputIcon: {
    paddingRight: 10
  },

  inputFocusIcon: {
    color: "#15CDCA",
    paddingRight: 10
  },

  confirmButton: {
    width: "95%",
    backgroundColor: "#15CDCA",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10
  },

  signupText:{
    color: "white",
    fontWeight: "bold"
  }
});
