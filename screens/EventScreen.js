import * as React from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { Image, Button, Text, ListItem, Divider, Icon } from 'react-native-elements';
import AuthContext from '../contexts/AuthContext';
import firebaseObject from '../config/firebase';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeArea } from 'react-native-safe-area-context';

import { formatDate, formatTime } from "../utils/date";
const Tab = createMaterialTopTabNavigator();




function PendingEvent(){
  renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Text h4>{item.name}</Text>
        <View style={styles.row}>
          <Icon name="event"/>
          <View style={styles.cardColumn}>
            <Text h5 style={styles.cardColumnText}>{formatDate(item.date)}</Text>
            <Text h5 style={styles.cardColumnText}>{formatTime(item.date)}</Text>
          </View>
          <Icon name="remove-circle"/>
          <View style={styles.cardColumn}>
            <Text h5 style={styles.cardColumnText}>{item.prize}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Icon name="location-on"/>
          <View style={styles.cardColumn}>
            <Text h5 style={styles.cardColumnText}>{item.location}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Icon name="person"/>
          <View style={styles.cardColumn}>
            <Text h5 style={styles.cardColumnText}>{item.members.length + "/" + item.maximumNumberOfMembers}</Text>
          </View>
        </View>
      </View>
      <Divider style={{ height: 0.3, margin: 5, backgroundColor: 'black' }} />
    </View>
  )
  return (
    <View style={styles.container}>
      <FlatList
        data={[
          { key: 1, name: 'GAZUA', date: new Date(), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' },
          { key: 2, name: 'GAZUA', date: new Date(), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' },
          { key: 3, name: 'GAZUA', date: new Date(), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' },
          { key: 4, name: 'GAZUA', date: new Date(), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' },
          { key: 5, name: 'GAZUA', date: new Date(), location: 'Juilet Cafe', maximumNumberOfMembers: 5, members: [], prize: 'americano' }
        ]}
        renderItem={renderItem}
        style={styles.list}
      />
    </View>
  )
}

function OnGoingEvent(){
  return (
    <View style={styles.container}>
      <Text>On Going Event</Text>
    </View>
  )
}
function EventHistory(){
  return (
    <View style={styles.container}>
      <Text>Pending Event</Text>
    </View>
  )
}

export default function EventScreen() {
  const insets = useSafeArea();
  const { signIn, signOut } = React.useContext(AuthContext);
  firebaseSignOut = async () => {
    firebaseObject.auth().signOut().then(() => {
      signOut();
    })
  }
  return (
    <Tab.Navigator
    tabBarOptions={{
      style: { paddingTop: insets.top },
    }}>
      <Tab.Screen name="Pending Event" component={PendingEvent} />
      <Tab.Screen name="On-Going Event" component={OnGoingEvent} />
      <Tab.Screen name="Event History" component={EventHistory} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F5FCFF'
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexGrow: 0,
      alignItems: 'center'
    },
    cardColumn: {
      flexBasis: '40%',
      paddingTop: 2,
      paddingBottom: 2,
    },
    cardColumnText: {
      paddingLeft: 2
    },
    card: {
      marginTop: 5,
      marginBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
      backgroundColor: '#C4C4C4'
    }
});
