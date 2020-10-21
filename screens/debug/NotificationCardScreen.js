import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import { Overlay, Icon, Avatar, Header, Button } from 'react-native-elements';
import ColorPalette from 'components/react-native-color-palette/src';
import { ScrollView } from 'react-native-gesture-handler';
import AuthContext from 'contexts/AuthContext';
import firebase from 'firebase';
import Constants from "expo-constants";
import ResultNotificationCard from '../../components/ResultNotificationCard'
import InviteCard from '../../components/InviteCard'
import EventNotificationCard from '../../components/EventNotificationCard'
import UhereHeader from '../../components/UhereHeader';




export default function NotificationCardScreen(){
  const [ username, setUsername] = React.useState("");

  React.useEffect(() => {
  }, []);

  return (
    <View style={styles.container}>
      <UhereHeader/>
      <ResultNotificationCard
        status="ON-GOING"
      />
      <InviteCard
        status="ON-GOING"
      />
      <EventNotificationCard
        status="ON-GOING"
      />
    </View>
  );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#ffffff",
  },
});
