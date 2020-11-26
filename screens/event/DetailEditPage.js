import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Icon, Header, Input, Text, Button } from 'react-native-elements'

import { ScrollView } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import UhereHeader from '../../components/UhereHeader';

import { Appearance, useColorScheme } from 'react-native-appearance';


export default function DetailEditPage({ navigation, route }) {
  const [eventTitle, setEventTitle] = React.useState('');
  const [eventDescription, setEventDescription] = React.useState('');
  const [eventStartTime, setEventStartTime] = React.useState('');
  const [eventLocation, setEventLocation] = React.useState('');
  const [eventPenalty, setEventPenalty] = React.useState('');
  const [eventReminder, setEventReminder] = React.useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  let colorScheme = useColorScheme();

  React.useEffect(() => {
    console.log(colorScheme)
  }, []);



  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setEventStartTime(date.toString());
    console.log("A date has been picked: ", date);
    hideDatePicker();
  };

  return (

    <View style={styles.container}>
      <UhereHeader
        showBackButton={true}
        onPressBackButton={() => {
          route.params.close()
          navigation.navigate('Event Detail New', {
            EventId: route.params.EventId,
            EventType: "ON-GOING"
          })
        }}
      />
      <ScrollView
        centerContent
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <Input
          containerStyle={styles.titleInput}
          placeholder='Title'
          value={eventTitle}
          onChangeText={(text) => setEventTitle(text)}
        />

        <View style={styles.menuBox}>
          <View style={styles.leftBox}><Text style={styles.leftText}>Starts</Text></View>
          <View style={styles.rightBox}>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              minimumDate={new Date(Date.now())}
              isDarkModeEnabled={colorScheme === 'dark'}
            />
            <TouchableOpacity onPress={showDatePicker} style={{ minHeight: 30 }}>
              <Text style={styles.rightText}>{eventStartTime}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuBox}>
          <View style={styles.leftBox}><Text style={styles.leftText}>Location</Text></View>

          <View style={styles.rightBox}>

            <TouchableOpacity onPress={() => navigation.navigate('Location Search')} style={{ minHeight: 30 }}>
              <Text style={styles.rightText}>{eventLocation}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuBox}>
          <View style={styles.leftBox}><Text style={styles.leftText}>Penalty</Text></View>
          <View style={styles.rightBox}>
            <RNPickerSelect
              onValueChange={(value) => setEventPenalty(value)}
              items={[
                {
                  label: 'Penalty1',
                  value: 'penalty1',
                },
                {
                  label: 'Penalty2',
                  value: 'penalty2',
                },
                {
                  label: 'Americano',
                  value: 'americano',
                },
              ]}
              style={pickerSelectStyles}
              value={eventPenalty}
              useNativeAndroidPickerStyle={false}
            />
          </View>
        </View>

        <View style={styles.menuBox}>
          <View style={styles.leftBox}><Text style={styles.leftText}>Reminder</Text></View>
          <View style={styles.rightBox}>
            <RNPickerSelect
              onValueChange={(value) => setEventReminder(value)}
              items={[
                {
                  label: '15 min',
                  value: '15',
                },
                {
                  label: '30 min',
                  value: '30',
                },
                {
                  label: '45 min',
                  value: '45',
                },
              ]}
              style={pickerSelectStyles}
              value={eventReminder}
              useNativeAndroidPickerStyle={false}
            />
          </View>
        </View>
        <Input
          containerStyle={{
            marginTop: 15,
            flex: 1
          }}
          inputStyle={{
          }}
          placeholder='Add Description'
          value={eventDescription}
          onChangeText={(text) => setEventDescription(text)}
        />
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleInput: {
    marginBottom: 30
  },
  menuBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#979797',
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  leftBox: {
    justifyContent: 'center',
  },
  rightBox: {
    justifyContent: 'center',
    flex: 1,
  },
  leftText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10
  },
  rightText: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'right'
  },

});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 11,
    color: 'black',
    padding: 10,
    textAlign: 'right'
  },
  inputAndroid: {
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlign: 'right',
  },
});