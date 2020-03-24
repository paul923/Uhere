import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default class Login extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cpassword: "",
  }
  render(){
    return (
      <View style={styles.container}>


        <View style={styles.inputContainer}>
          <Text style={styles.inputDetail}>This is forgot Password</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholderTextColor="#003f5c"
              onChangeText={text => this.setState({email: text})}/>
          </View>
        </View>



        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.loginText}>SIGN UP</Text>
        </TouchableOpacity>

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
    width: "80%",
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
    width: "80%"
  },
  inputDetail: {
    fontSize: 15,
    color: 'white',
    fontWeight: "bold",
    margin: 5
  }
});
