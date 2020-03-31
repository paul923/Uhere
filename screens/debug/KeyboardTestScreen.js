import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, ListItem, Avatar } from 'react-native-elements'

import AvatarScreen from '../AvatarScreen'
import { ScrollView, FlatList } from 'react-native-gesture-handler';



export default function KeyboardTestScreen({navigation}) {
  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={({item}) => (
          <Input placeholder={item.placeholder}/>
        )}
      />
      
        <Button
          title="This is a button"
          buttonStyle={{margin: 10}}
        />
    </View>
  )
}


const DATA = [
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
  {
    placeholder: "input"
  },
]

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
