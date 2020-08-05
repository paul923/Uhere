import * as React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import { Button, Input } from 'react-native-elements'

import AvatarScreen from '../AvatarScreen'
import { getGroupById, postGroup, deleteGroupById } from '../../api/group';
import { ScrollView } from 'react-native-gesture-handler';



export default function PaulTestScreen({navigation}) {
  const [groupId, setGroupId] = React.useState();
  const [result, setResult] = React.useState();


  async function getGroup(){
    let result = await getGroupById(groupId)
    setResult(JSON.stringify(result, null, 2))
  }

  async function createGroup(){
      const group = {
        "UserId" : "O1BDrdaufPcrbKaKt4v1w8Bz0Zl1",
        "GroupName" : "Testing Start1"
      }
      const members = [
        {
          "UserId": "eIsb3yMPlScSy5QAtpnqfqzON8r1"
        },
        {
          "UserId": "xltCuDt5quTdCTCKtJbkGOuB3Co2"
        },
        {
          "UserId": "abcdefg12345"
        }
      ]
    let result = await postGroup(group, members);
    setResult(JSON.stringify(result, null, 2))
  }

  async function deleteGroup(){
    let result = await deleteGroupById(groupId);
    setResult(JSON.stringify(result, null, 2))
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      <View style={{flex: 1}}>
        <TextInput
          style={{ fontSize: 20, color: 'black',borderColor: 'gray', borderWidth: 1, width: 100 }}
          onChangeText={text => setGroupId(text)}
          value={groupId}
        />
        <Button
          title='Get Group by Id'
          buttonStyle={styles.button}
          onPress={()=> getGroup()}
        />
      </View>

      <Button
        title='Post Group'
        buttonStyle={styles.button}
        onPress={()=> createGroup()}
      />
      <Button
        title='Delete Group'
        buttonStyle={styles.button}
        onPress={()=> deleteGroup()}
      />
      <View>
        <Text>{result}</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
      padding: 20,
    },
    button: {
      margin: 5,
      height: 50
    }
});
