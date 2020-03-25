import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import AvatarScreen from '../AvatarScreen'



export default function PaulTestScreen() {
  return (
    <View style={styles.container}>
      <AvatarScreen/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF'
    }
});
