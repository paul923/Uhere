import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Picker } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import { Image, Button, Text, Input, Icon, Divider } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import AuthContext from '../contexts/AuthContext';
import firebase from 'firebase';
import firebaseObject from '../config/firebase';


import googleSignInImage from '../assets/images/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png';



export default function CreateEventScreen() {
  const [ eventName, setEventName] = React.useState("");
  const [ eventDate, setEventDate] = React.useState(new Date());
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
          <DatePicker
            style={{width: 200}}
            date={eventDate}
            mode="datetime"
            format="MMM Do, YYYY | hh:mm a"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            onDateChange={(date) => setEventDate(date)}
          />
          </View>
        </View>
      </View>
      <View style={styles.row}>
        <View>
          <View style={styles.row}>
            <Text h4>How many friends are coming</Text>
            </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.columnButton}>
              <Icon name="plus" type="antdesign" color="black"/>
            </TouchableOpacity>
            <View style={styles.column}>
              <Text h4 style={styles.textCenter}>{maximumNumberOfMembers}</Text>
            </View>
            <TouchableOpacity style={styles.columnButton}>
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
            <Text style={styles.textCenter}>Before</Text>
          </View>
          <View style={styles.row}>
            <Picker
              style={styles.onePicker} itemStyle={styles.onePickerItem}
              selectedValue={reminder}
              onValueChange={(itemValue) => setReminder(itemValue)}
            >
              <Picker.Item label="15 min" value="15" />
              <Picker.Item label="30 min" value="30" />
              <Picker.Item label="45 min" value="45" />
              <Picker.Item label="60 min" value="60" />
            </Picker>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
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
      height: 44,
      backgroundColor: '#FFF0E0',
      borderColor: 'black',
      borderWidth: 1,
    },
    onePickerItem: {
      height: 44,
      color: 'red'
    },
    textCenter: {
      textAlign: 'center'
    }
});
