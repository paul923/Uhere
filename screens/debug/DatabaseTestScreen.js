import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, ListItem, Avatar } from 'react-native-elements'

import AvatarScreen from '../AvatarScreen'
import { ScrollView, FlatList } from 'react-native-gesture-handler';



export default function KeyboardTestScreen({navigation}) {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <View>
            <Text>{input.id}</Text>
            <Text>{input.char_column}</Text>
            <Text>{input.number_column}</Text>
            <Text>{input.date_column}</Text>
          </View>
        )}
      />

        <Button
          title="Add New Record"
          buttonStyle={{margin: 10}}
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
