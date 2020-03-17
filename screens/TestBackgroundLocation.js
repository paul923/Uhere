import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { Image, Button, Text } from 'react-native-elements';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';

export default class TestBackgroundLocation extends React.Component {
  
    componentDidMount() {
    }
    // for now put this button in freinds screen sorry...
    onPressStart = async () => {
      const { status } = await Location.requestPermissionsAsync();
      if (status === 'granted') {
        console.log('Started Background Location Tracking');
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
        });
      }
    };
  
    onPressStop = async () => {
      console.log('Stopped Background Location Tracking');
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  
    render() {
      return (
        <View style={styles.container}>
          <TouchableOpacity onPress={this.onPressStart}>
            <Text>Start Background Location</Text>
          </TouchableOpacity>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <TouchableOpacity onPress={this.onPressStop}>
            <Text>Stop Background Location</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
      container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F5FCFF'
      }
  });
  
   // this had to be added for Always option in ios
   // dont know how this works exactly at this point but seems like it just works before
   // does app.js run these lines????
   const LOCATION_TASK_NAME = 'background-location-task';
   TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      // Error occurred - check `error.message` for more details.
      return;
    }
    if (data) {
      const { locations } = data;
      // do something with the locations captured in the background
      console.log("locations", locations);
    }
  });