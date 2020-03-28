import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input } from 'react-native-elements'

import AvatarScreen from '../AvatarScreen'
import { ScrollView } from 'react-native-gesture-handler';



export default function KeyboardTestScreen({navigation}) {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Input
          placeholder='input field'/>
        <Input
          placeholder='input field'/>
        <Input
          placeholder='input field'/>
        <Input
          placeholder='input field'/>
        <Input
          placeholder='input field'/>
        <Input
          placeholder='input field'/>
        <Input
          placeholder='input field'/>
        <Input
          placeholder='input field'/>
        <Input
          placeholder='input field'/>
        <Input
          placeholder='input field'/>
        <Input
          placeholder='input field'/>
        <Input
          placeholder='input field'/>
        <Input
          placeholder='input field'/>
        <Input
          placeholder='input field'/>
        <Button
          title="This is a button"
          buttonStyle={{margin: 10}}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
      borderWidth: 5,
      borderColor: 'blue',
      paddingBottom: 20
    },
    button: {
      margin: 5,
      height: 50
    }
});
