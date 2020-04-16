import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';




export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
          <Text style={styles.logoU}>u</Text>
          <Text style={styles.logoHere}>Here</Text>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#003f5c',
      justifyContent: 'center',
      alignItems: "center",
    },
    logoU: {
      fontSize: 60,
      fontWeight: "bold",
      color: "white"
    },
    logoHere: {
      fontSize: 60,
      fontWeight: "bold",
      color: "#fb5b5a"
    },
    logoContainer: {
      margin: 30,
      flexDirection: 'row'
    },
});