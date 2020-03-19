import * as React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Image, Button, Text } from 'react-native-elements';
import AuthContext from '../../contexts/AuthContext';
import firebase from 'firebase';
import firebaseObject from '../../config/firebase';

export default function JustinTestScreen() {
  const { signIn, signOut } = React.useContext(AuthContext);

  firebaseSignOut = async () => {
    firebase.auth().signOut().then(function() {
      signOut();
    }).catch(function(error) {
      // An error happened.
    });
  }

  clearTutorialCompletion = async () => {
    await AsyncStorage.removeItem('isFirstLaunch');
  }

  return (
    <View style={styles.container}>
      <Button
        title="SIGN OUT"
        onPress={() => firebaseSignOut()}
        />
      <Button
        title="CLEAR TUTORIAL COMPLETION"
        onPress={() => clearTutorialCompletion()}
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
