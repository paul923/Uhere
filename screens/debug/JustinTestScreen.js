import * as React from 'react';
import { StyleSheet, View, AsyncStorage, TextInput, ScrollView } from 'react-native';
import { Image, Button, Text, ListItem, Icon } from 'react-native-elements';
import AuthContext from '../../contexts/AuthContext';
import LoadingContext from '../../contexts/LoadingContext';
import firebase from 'firebase';
import firebaseObject from '../../config/firebase';
import Collpase from '../../components/Collapse';
import { getEvent, getEvents, createEvent, acceptEvent, declineEvent, cancelEvent } from 'api/event';


export default function JustinTestScreen({navigation}) {
  const { signIn, signOut } = React.useContext(AuthContext);
  const { showLoadingScreen } = React.useContext(LoadingContext);
  const [eventId, setEventId] = React.useState();
  firebaseSignOut = async () => {
    firebase.auth().signOut().then(function() {
      signOut();
    }).catch(function(error) {
      // An error happened.
    });
  }

  async function clearTutorialCompletion(){
    await AsyncStorage.removeItem('isFirstLaunch');
  }

  async function clearSkipProfile(){
    await AsyncStorage.removeItem('skipProfile');
  }

  return (
    <ScrollView style={styles.container} containerStyle={{alignItems: 'center'}}>
      <Button
        style={{flex: 1}}
        title="SIGN OUT"
        onPress={() => firebaseSignOut()}
        />
      <Button
        style={{flex: 1}}
        title="CLEAR TUTORIAL COMPLETION"
        onPress={() => clearTutorialCompletion()}
        />
      <Button
        style={{flex: 1}}
        title="CLEAR SKIP PROFILE"
        onPress={() => clearSkipProfile()}
        />
      <Button
        style={{flex: 1}}
        title="SHOW LOADING SCREEN"
        onPress={() => showLoadingScreen()}
        />
      <View style={{flex: 1}}>
        <TextInput
          style={{ fontSize: 20, color: 'black',borderColor: 'gray', borderWidth: 1, width: 100 }}
          onChangeText={text => setEventId(text)}
          value={eventId}
        />
        <Button
          title='Get Event by Id'
          buttonStyle={styles.button}
          onPress={()=> getEvent(eventId)}
        />
        <Button
          title='Accept Event by Id'
          buttonStyle={styles.button}
          onPress={()=> acceptEvent(eventId)}
        />
        <Button
          title='Decline Event by Id'
          buttonStyle={styles.button}
          onPress={()=> declineEvent(eventId)}
        />
        <Button
          title='Cancel Event by Id'
          buttonStyle={styles.button}
          onPress={()=> cancelEvent(eventId)}
        />
      </View>
      <Button
        style={{flex: 1}}
        title="Get All Events"
        onPress={() => getEvents('ACCEPTED', true, 20, 0)}
        />
      <Button
        style={{flex: 1}}
        title="Get On Going Events"
        onPress={() => getEvents('ACCEPTED', false, 20, 0)}
        />
      <Button
        style={{flex: 1}}
        title="ROULETTE TEST"
        onPress={() => navigation.navigate('RouletteTestScreen')}
        />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
      flex: 1,
      backgroundColor: '#F5FCFF'
    },

});
