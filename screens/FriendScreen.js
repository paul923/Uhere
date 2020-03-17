import * as React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { Image, Button, Text } from 'react-native-elements';




export default class FriendScreen extends React.Component {

  componentDidMount() {
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Friend Screen</Text>
      </View>
    )
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
