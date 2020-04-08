import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button, Input, ListItem, Avatar } from 'react-native-elements'

import AvatarScreen from '../AvatarScreen'
import { ScrollView, FlatList } from 'react-native-gesture-handler';



export default function KeyboardTestScreen({navigation}) {
  const [data, setData] = React.useState([]);
  async function retrieve() {
    try {
      let url = 'http://192.168.1.73:3000/retrieve';
      let response = await fetch(url);
      let responseJson = await response.json();
      setData(responseJson);
      console.log(responseJson);
    } catch (error) {
      console.error(error);
    }
  }

  async function insert(char_column, number_column, date_column) {
    let response = await fetch('http://192.168.1.73:3000/insert', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        char_column: char_column,
        number_column: number_column,
        date_column: date_column
      }),
    });
    let responseJson = await response.json();
    alert("Added record");
  }
  React.useEffect(() => {


  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <View>
            <Text>{"ID: " + item.id}</Text>
            <Text>{"CHAR: " + item.char_column}</Text>
            <Text>{"NUMBER: " + item.number_column}</Text>
            <Text>{"DATE: " + item.date_column}</Text>
          </View>
        )}
      />
      <Button
        title="Fetch Record"
        buttonStyle={{margin: 10}}
        onPress={retrieve}
      />
      <Button
        title="Add New Record"
        buttonStyle={{margin: 10}}
        onPress={() => insert('Test', '1234', new Date())}
      />
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
