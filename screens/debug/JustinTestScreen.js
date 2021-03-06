import * as React from 'react';
import { StyleSheet, View, AsyncStorage, TextInput, ScrollView } from 'react-native';
import { Image, Button, Text, ListItem, Icon } from 'react-native-elements';
import AuthContext from 'contexts/AuthContext';
import GlobalContext from 'contexts/GlobalContext';
import firebase from 'firebase';
import firebaseObject from 'config/firebase';
import Collpase from 'components/Collapse';
import { getEvent, getEvents, createEvent, acceptEvent, declineEvent, cancelEvent } from 'api/event';


export default function JustinTestScreen({navigation}) {
  const { signIn, signOut, getUserInfo } = React.useContext(AuthContext);
  const { showLoadingScreen, showErrorScreen } = React.useContext(GlobalContext);
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
        title="GET USER INFO"
        onPress={() => {
          getUserInfo(firebase.auth().currentUser.uid).then(user => console.log(user));
        }}
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
      <Button
        style={{flex: 1}}
        title="SHOW GLOBAL DIALOG"
        onPress={() => showErrorScreen("This is Error Message")}
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
      <Button
        style={{flex: 1}}
        title="LOG OUT"
        onPress={() => firebaseSignOut()}
        />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
      flex: 1,
    },

});
