import * as React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Image, Button, Text, ListItem, Icon } from 'react-native-elements';
import AuthContext from '../../contexts/AuthContext';
import LoadingContext from '../../contexts/LoadingContext';
import firebase from 'firebase';
import firebaseObject from '../../config/firebase';
import Collpase from '../../components/Collapse';

export default function JustinTestScreen({navigation}) {
  const { signIn, signOut } = React.useContext(AuthContext);
  const { showLoadingScreen } = React.useContext(LoadingContext);

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
    <View style={styles.container}>
      <Button
        title="SIGN OUT"
        onPress={() => firebaseSignOut()}
        />
      <Button
        title="CLEAR TUTORIAL COMPLETION"
        onPress={() => clearTutorialCompletion()}
        />
      <Button
        title="CLEAR SKIP PROFILE"
        onPress={() => clearSkipProfile()}
        />
      <Button
        title="SHOW LOADING SCREEN"
        onPress={() => showLoadingScreen()}
        />
      <Button
        title="DATABASE TEST"
        onPress={() => navigation.navigate('DatabaseTestScreen')}
        />
      <Collpase
        title="Location"
        content={
          <View>
            <Text>
              Bacon ipsum dolor amet chuck turducken landjaeger tongue spare
              ribs
            </Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
      backgroundColor: '#F5FCFF'
    },

});
