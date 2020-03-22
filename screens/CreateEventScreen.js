import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Picker } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
import { Image, Button, Text, Input, Icon, Divider, Header } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import AuthContext from '../contexts/AuthContext';
import firebase from 'firebase';
import firebaseObject from '../config/firebase';

import {formatDate, formatTime} from '../utils/date';

import googleSignInImage from '../assets/images/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png';



export default function CreateEventScreen({navigation}) {
  const [ step, setStep] = React.useState("Event Detail");
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

  function publish() {

  }

  function cancel() {

  }

  function EventDetail() {
    return (
      <View>
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

  function Location() {
    return (
      <View>
        <Text>LOCATION</Text>
      </View>
    )
  }

  function Penalty() {
    return (
      <View>
        <Text>Penalty</Text>
      </View>
    )
  }


  function LeftComponent() {
    let name = (step === 'Event Detail') ? 'close' : 'chevron-left';
    let onPress;
    if (step === 'Event Detail') {
      onPress = () => navigation.navigate("Event");
    } else if (step === 'Location') {
      onPress = () => setStep('Event Detail');
    } else {
      onPress = () => setStep('Location');
    }
    return (
      <Icon name={name} color='#fff' onPress={onPress}/>
    )
  }

  function RightComponent() {
    let name = (step !== 'Penalty') && 'chevron-right';
    let text = (step === 'Penalty') && 'PUBLISH';
    let onPress;
    if (step === 'Event Detail') {
      onPress = () => setStep('Location');
      return (
        <Icon name="chevron-right" color='#fff' onPress={onPress}/>
      )
    } else if (step === 'Location') {
      onPress = () => setStep('Penalty');
      return (
        <Icon name="chevron-right" color='#fff' onPress={onPress}/>
      )
    } else {
      onPress = () => publish();
      return (
        <Icon text="PUBLISH" color='#fff' onPress={onPress}/>
      )
    }
  }

  function nextStep() {
    let object = {color: '#fff'};
    if (step === "Event Detail"){
      object.icon = 'close';
    } else {
      object.icon = 'chevron-left'
    }

    return object
  }

  function prevStep() {

  }

  return (
    <View style={styles.container}>
      <Header
        leftComponent={LeftComponent}
        centerComponent={{ text: 'CREATE EVENT', style: { color: '#fff' } }}
        rightComponent={RightComponent}
        />
        <View style={styles.stepContainer}>
          <View style={styles.stepComplete}>
            <Text style={styles.stepText}>Event Detail</Text>
          </View>
          <View style={step === 'Event Detail' ? styles.step : styles.stepComplete}>
            <Text style={styles.stepText}>Location</Text>
          </View>
          <View style={step === 'Penalty' ? styles.stepComplete : styles.step}>
            <Text style={styles.stepText}>Penalty</Text>
          </View>
        </View>
        <View style={styles.formContainer}>
          {step === "Event Detail" && EventDetail()}
          {step === "Location" && Location()}
          {step === "Penalty" && Penalty()}
        </View>
    </View>

  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    stepContainer: {
      flex: 1,
      flexDirection: 'row'
    },
    stepComplete: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,1)',
    },
    step: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    stepText: {
      color: 'white',
      textAlign: 'center',
      textAlignVertical: 'center',
      height: '100%'
    },
    formContainer: {
      margin: 20,
      flex: 10,
      justifyContent: 'center',
      alignItems: 'center'
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
