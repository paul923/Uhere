import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Picker } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import { Image, Button, Text, Input, Icon, Divider } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import AuthContext from '../contexts/AuthContext';
import firebase from 'firebase';
import firebaseObject from '../config/firebase';

import {formatDate, formatTime} from '../utils/date';

import googleSignInImage from '../assets/images/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png';



export default function CreateEventScreen() {
  const [ eventName, setEventName] = React.useState("");
  const [ eventDate, setEventDate] = React.useState(new Date());
  const [ eventTime, setEventTime] = React.useState(new Date());
  const [ showDatePicker, setShowDatePicker] = React.useState(false);
  const [ showTimePicker, setShowTimePicker] = React.useState(false);
  const [ maximumNumberOfMembers, setMaximumNumberOfMembers] = React.useState(0);
  const [ reminder, setReminder] = React.useState(15);
  const [ location, setLocation] = React.useState("");
  const [ penalty, setPenalty] = React.useState("");


  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <View style={styles.row}>
          <Text h4>Event Name</Text>
          </View>
          <View style={styles.row}>
            <Input
                onChangeText={text => setEventName(text)}
                value={eventName}
                inputContainerStyle={{
                  borderWidth: 1,
                }}
              />
          </View>
        </View>
      </View>
      <View style={styles.row}>
        <View>
          <View style={styles.row}>
            <Text h4>Event Date</Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.onePicker} onPress={() => {setShowDatePicker(true); setShowTimePicker(false)}}>
              <Text style={styles.textCenter}>{formatDate(eventDate)}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.onePicker} onPress={() => {setShowDatePicker(false); setShowTimePicker(true)}}>
              <Text style={styles.textCenter}>{formatTime(eventTime)}</Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && <DateTimePicker
            value={eventDate}
            mode="date"
            display="default"
            onChange={(event, date) => {setShowDatePicker(false); setEventDate(date)}}
          />}
          {showTimePicker && <DateTimePicker
            value={eventTime}
            mode="time"
            display="default"
            onChange={(event, date) => {setShowTimePicker(false); setEventTime(date)}}
          />}
        </View>
      </View>
      <View style={styles.row}>
        <View>
          <View style={styles.row}>
            <Text h4>How many friends are coming</Text>
            </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.columnButton} onPress={() => setMaximumNumberOfMembers(maximumNumberOfMembers+1)}>
              <Icon name="plus" type="antdesign" color="black"/>
            </TouchableOpacity>
            <View style={styles.column}>
              <Text h4 style={styles.textCenter}>{maximumNumberOfMembers}</Text>
            </View>
            <TouchableOpacity style={styles.columnButton} onPress={() => maximumNumberOfMembers > 0 && setMaximumNumberOfMembers(maximumNumberOfMembers-1)}>
              <Icon name="minus" type="antdesign" color="black"/>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View>
          <View style={styles.row}>
          <Text h4>Reminder</Text>
          </View>
          <View style={styles.row}>
            <Picker
              style={styles.onePicker}
              selectedValue={reminder}
              onValueChange={(itemValue) => setReminder(itemValue)}
            >
              <Picker.Item label="Before 15 min" value="15" />
              <Picker.Item label="Before 30 min" value="30" />
              <Picker.Item label="Before 45 min" value="45" />
              <Picker.Item label="Before 60 min" value="60" />
            </Picker>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      margin: 30,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    column: {
      flex: 1
    },
    columnButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: 'black',
      marginLeft: 5,
      marginRight: 5
    },
    onePicker: {
      width: 200,
      backgroundColor: '#FFF0E0',
    },
    textCenter: {
      textAlign: 'center'
    }
});
