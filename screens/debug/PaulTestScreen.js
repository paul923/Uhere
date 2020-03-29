import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements'

import AvatarScreen from '../AvatarScreen'



export default function PaulTestScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Button
        title='Avatar Test'
        buttonStyle={styles.button}
        onPress={()=> navigation.navigate('AvatarNavigator')}
      />
      <Button
        title='Keyboard Layout Test'
        buttonStyle={styles.button}
        onPress={()=> navigation.navigate('KeyboardTestScreen')}
      />
      <Button
        title='Log-in : Keyboard Layout'
        buttonStyle={styles.button}
        onPress={()=> navigation.navigate('LoginTestScreen')}
      />
      <Button
        title='Register : Keyboard Layout'
        buttonStyle={styles.button}
        onPress={()=> navigation.navigate('RegisterTestScreen')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
      justifyContent: 'center'
    },
    button: {
      margin: 5,
      height: 50
    }
});
