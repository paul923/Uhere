import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { Image, Button, Text } from 'react-native-elements';
import AuthContext from '../AuthContext';




export default function EventScreen() {
  const { signIn, signOut } = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text>Event Screen</Text>
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
