import * as React from 'react';
import { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, Image } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';

import AppIntroSlider from './screens/introSlider';
import AvatarColor from './screens/AvatarColor'



const Stack = createStackNavigator();


export default function App(props) {
  
  const [showRealApp, setshowRealApp] = React.useState(false);

  if(showRealApp){
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
            {/** Avatar Color Palette */}
            <Stack.Screen name="AvatarColor" component={AvatarColor} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  } else {
    return <AppIntroSlider 
            slides={slides} 
            onDone={() => {setshowRealApp(true);}} 
            showSkipButton
            activeDotStyle={{backgroundColor: 'rgba(0, 0, 0, .9)'}}
            />;
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});


// Slider contents
const slides = [
  {
    key: 'Dummy1',
    title: 'Dummy 1',
    text: 'Please sign in to\ncontinue.',
    image: require('./assets/images/robot-dev.png'),
    backgroundColor: '#ffffff',
    titleStyle: {
      color: '#000000'
    },
    textStyle : {
      color: '#0f0f0f',
    }
  },
  {
    key: 'Dummy2',
    title: 'Dummy 2',
    text: 'Please sign in to\ncontinue.',
    image: require('./assets/images/robot-dev.png'),
    backgroundColor: '#ffffff',
    titleStyle: {
      color: '#000000'
    },
    textStyle : {
      color: '#0f0f0f',
    }
  },
  {
    key: 'Dummy3',
    title: 'Dummy 3',
    text: 'Please sign in to\ncontinue.',
    image: require('./assets/images/robot-dev.png'),
    backgroundColor: '#ffffff',
    titleStyle: {
      color: '#000000'
    },
    textStyle : {
      color: '#0f0f0f'
    }
  }
 ];
