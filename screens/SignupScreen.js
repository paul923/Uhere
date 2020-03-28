import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import {Icon, Header} from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';


import firebaseObject from '../config/firebase';





export default class Login extends Component {


  registerWithEmail = async () => {
    if(this.state.registerPassword !== this.state.cPassword){
      alert('Please confirm your password');
    } else {
      firebaseObject.auth()
            .createUserWithEmailAndPassword(this.state.registerEmail, this.state.registerPassword)
            .catch(function(error) {
              // Handle Errors here.
              var errorMessage = error.message;
              alert(errorMessage);
      });
    }

  }

  state = {
    firstName: "",
    lastName: "",
    registerEmail: "",
    registerPassword: "",
    cPassword: "",
  }
  render(){
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon
              name="arrow-left"
              type="entypo"
              color="white"
              size={30}
              underlayColor= "transparent"
              onPress={()=> this.props.navigation.goBack()}
            />
          }
          centerComponent={{text: 'Create Account', style: {color: 'white', fontSize: 25, fontWeight: 'bold'}}}
          containerStyle={{
            marginTop: 10,
            backgroundColor: 'transparent',
            borderBottomWidth: 0
          }}
        />
        <ScrollView 
          centerContent
          contentContainerStyle={{
            alignItems: 'center',
            padding: 20,
          }}
        >

          <View style={styles.bodyContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputDetail}>First Name</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholderTextColor="#003f5c"
                  onChangeText={text => this.setState({firstName: text})}/>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputDetail}>Last Name</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholderTextColor="#003f5c"
                  onChangeText={text => this.setState({lastName: text})}/>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputDetail}>Email</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholderTextColor="#003f5c"
                  onChangeText={text => this.setState({registerEmail: text})}
                  value={this.state.registerEmail}
                  textContentType="emailAddress"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputDetail}>Password (6 or more character)</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholderTextColor="#003f5c"
                  onChangeText={text => this.setState({registerPassword: text})}
                  value={this.state.registerPassword}
                  textContentType="password"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputDetail}>Confirm Password</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholderTextColor="#003f5c"
                  onChangeText={text => this.setState({cPassword:text})}/>
              </View>
            </View>


            <TouchableOpacity
              style={styles.confirmButton}
              onPress={this.registerWithEmail}
            >
              <Text style={styles.loginText}>SIGN UP</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>
    );
  }

  
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
  },

  bodyContainer:{
    width: '100%',
    alignItems: 'center',
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