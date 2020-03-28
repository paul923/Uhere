import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Picker } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import { Image, Button, Text, Input, Icon, Divider, Header, SearchBar } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import AuthContext from '../contexts/AuthContext';
import firebase from 'firebase';
import firebaseObject from '../config/firebase';
import {formatDate, formatTime} from '../utils/date';
import Collpase from '../components/Collapse';

import googleSignInImage from '../assets/images/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png';
import penaltyImage from '../assets/images/robot-dev.png';


export default function FilterEventScreen({navigation}) {

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  }, []);

  function applyFilter() {

  }


  return (
    <View style={styles.container}>
      <Header
        leftComponent={{ icon: 'chevron-left', color: '#fff', onPress: () => navigation.navigate('Event') }}
        centerComponent={{ text: 'FILTER EVENT', style: { color: '#fff' } }}
        rightComponent={{ icon: 'check', color: '#fff', onPress: () => applyFilter() }}
        />
      <Collpase
        title="Date"
        content={
          <View>
            <Text>
              Bacon ipsum dolor amet chuck turducken landjaeger tongue spare
              ribs
            </Text>
          </View>
        }
      />
      <Collpase
        title="Friends"
        content={
          <View>
            <Text>
              Bacon ipsum dolor amet chuck turducken landjaeger tongue spare
              ribs
            </Text>
          </View>
        }
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
      alignItems: 'stretch'
    },
});
