import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import {Icon, Header} from 'react-native-elements'


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
            backgroundColor: 'transparent',
            borderBottomWidth: 0
          }}
        />

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

      </View>
    );
  }

  headerBar() {
    return(
      <View
        style={{
          height: 50,
          width: '100%',
          marginTop: 20,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          flexDirection: 'row'
        }}>

          <View style={{width: "10%", justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
              <Icon
                name="arrow-left"
                type="entypo"
                color= "white"
                size= "30"
              />
            </TouchableOpacity>
          </View>

          <View style={{width: "80%", justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 30,
              }}>
              Create Account
            </Text>
          </View>
          <View style={{width: "10%"}}>

          </View>
        </View>
    )}
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
