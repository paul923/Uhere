import * as React from 'react';
import { SectionList, FlatList, StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image, Button, Text, ListItem, Divider, Icon, SearchBar, Header } from 'react-native-elements';
import AuthContext from '../contexts/AuthContext';
import firebaseObject from '../config/firebase';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSafeArea } from 'react-native-safe-area-context';
import EventCard from '../components/EventCard';
import EventFilter from '../components/EventFilter';
import EventHistory from './event/EventHistory';
import OnGoingEvent from './event/OnGoingEvent';
import PendingEvent from './event/PendingEvent';

const Tab = createMaterialTopTabNavigator();

export default function EventScreen({ navigation, route }) {
  const insets = useSafeArea();
  const { signIn, signOut } = React.useContext(AuthContext);
  firebaseSignOut = async () => {
    firebaseObject.auth().signOut().then(() => {
      signOut();
    })
  }
  return (
    <View style={styles.container}>
      <Header
        leftComponent={{ icon: 'notifications', color: '#fff' }}
        centerComponent={{ text: 'EVENT', style: { color: '#fff' } }}
        rightComponent={{icon: "add", color: "#fff", onPress: () => navigation.navigate("Create Event")}}
        statusBarProps={{translucent: true}}
        />
      <Tab.Navigator>
        <Tab.Screen name="Pending Event" component={PendingEvent} />
        <Tab.Screen name="On-Going Event" component={OnGoingEvent} />
        <Tab.Screen name="Event History" component={EventHistory} />
      </Tab.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  listContainer: {
    marginLeft: 15,
    marginRight: 15
  },
  sectionHeader: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'gray',
    paddingLeft: 5,
    zIndex: 99
  }
});
