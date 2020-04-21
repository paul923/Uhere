import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Input, ListItem, Avatar } from 'react-native-elements'

import AvatarScreen from '../AvatarScreen'
import { ScrollView, FlatList } from 'react-native-gesture-handler';



export default function TestScreen2({navigation}) {
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
      borderWidth: 5,
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
