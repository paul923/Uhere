import * as React from 'react';
import { formatDate, formatTime } from "../utils/date";
import { StyleSheet, View } from 'react-native';
import { Text, Divider, Icon, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

export default function EventFilter({item, status}) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Filter"
          buttonStyle={styles.button}
          onPress={() => navigation.navigate('Filter Event')}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    margin: 3
  }
});
