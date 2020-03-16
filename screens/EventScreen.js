import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { Image, Button, Text } from 'react-native-elements';
import AuthContext from '../contexts/AuthContext';
import firebaseObject from '../config/firebase';




export default function EventScreen() {
  const { signIn, signOut } = React.useContext(AuthContext);
  firebaseSignOut = async () => {
    firebaseObject.auth().signOut().then(() => {
      signOut();
    })
  }
  return (
    <View style={styles.container}>
      <Text>Event Screen</Text>
      <Button
        title="SIGN OUT"
        onPress={() => firebaseSignOut()}
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
