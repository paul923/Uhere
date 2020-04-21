import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements'

import AvatarScreen from '../AvatarScreen'



export default function PaulTestScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Button
        title='Drawer Layout'
        buttonStyle={styles.button}
        onPress={()=> navigation.navigate('Test Screen 1')}
      />
      <Button
        title='Splash Screen'
        buttonStyle={styles.button}
        onPress={()=> navigation.navigate('Test Screen 2')}
      />
      <Button
        title='Log-in : Keyboard Layout (Test)'
        buttonStyle={styles.button}
        onPress={()=> navigation.navigate('Test Screen 3')}
      />
      <Button
        title='Edit Page(Event Detail)'
        buttonStyle={styles.button}
        onPress={()=> navigation.navigate('Test Screen 4')}
      />
      <Button
        title='Friends : Friends Card, Filter'
        buttonStyle={styles.button}
        onPress={()=> navigation.navigate('Test Screen 5')}
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
