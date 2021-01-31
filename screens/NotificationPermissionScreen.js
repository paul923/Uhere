import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Linking } from 'react-native';
import { Button } from 'react-native-elements';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Application from 'expo-application';
import Constants from 'expo-constants';

export default class NotificationPermissionScreen extends Component {
    
    render () {
      return(
        <View style={styles.container}>
          <View style={styles.upperContainer}>
            <Text style={styles.headerText}>Tell us where you are!</Text>
            <View style={styles.instructionBox}>
              <View style={styles.instruction}>
                <Image
                  style={[styles.bulletPoint, {width: 34, height: 33}]}
                  source={require("../assets/images/logos/logo_icon_white/png/Group3Copy.imageset/Group3Copy.png")}
                  resizeMode="contain"
                />
                <Text style={[
                  styles.instructionText,
                  {color: 'white'}
                ]}>Press the setting button</Text>
              </View>
            </View>
            <View style={styles.buttonWrapper}>
              <Button 
                title="Setting"
                buttonStyle={styles.settingButton}
                titleStyle={styles.settingButtonTitle}
                onPress={
                  Platform.OS === 'ios' ? 
                  () => Linking.openURL('app-settings:') :
                  () => IntentLauncher.startActivityAsync(
                    IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                    {data: `package:${Application.applicationId}`}
                  )
                }
              />
            </View>
          </View>
          <View style={styles.lowerContainer}>
            <View style={styles.instructionBox}>
              <View style={styles.instruction}>
                <Image
                  style={styles.bulletPoint}
                  source={require("../assets/images/logos/logo_icon_colored/png/Group3Copy.imageset/UhereLogo.png")}
                  resizeMode="contain"
                />
                <Text style={styles.instructionText}>At setting, click the notifications button</Text>
              </View>
              <Image
                style={{width: "100%", marginBottom: 20}}
                source={require("../assets/images/location_setting/setting_image_1/png/IMG_07441.imageset/IMG_07441.png")}
                resizeMode="contain"
              />
            </View>
            <View style={styles.instructionBox}>
              <View style={styles.instruction}>
                <Image
                  style={styles.bulletPoint}
                  source={require("../assets/images/logos/logo_icon_colored/png/Group3Copy.imageset/UhereLogo.png")}
                  resizeMode="contain"
                />
                <Text style={styles.instructionText}>Allow Notifications and come back!</Text>
              </View>
              <Image
                style={{width: "100%"}}
                source={require("../assets/images/location_setting/setting_image_2/IMG_07461.png")}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: "bold",
    margin: 16
  },
  upperContainer: {
    flex: 3,
    backgroundColor: "#15cdca",
    padding: 25
  },
  lowerContainer: {
    flex: 7,
    padding: 25
  },
  instructionBox: {
  },
  instruction: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16
  },
  bulletPoint:{
    width: 21,
    height: 25,
  },
  instructionText: {
    fontSize: 15,
    fontWeight: "bold",  
    color: "#15cdca",
    margin: 15
  },
  settingButton: {
    width: 226,
    height: 51,
    borderRadius: 100,
    backgroundColor: "#ffffff",
    alignSelf: 'center',
  },
  settingButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#15cdca"
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'flex-end'
  }
});

