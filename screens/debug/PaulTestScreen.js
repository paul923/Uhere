import * as React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Button, Input } from 'react-native-elements'

import AvatarScreen from 'screens/profile/AvatarScreen'
import { getGroupById, postGroup, deleteGroupById } from 'api/group';
import { ScrollView } from 'react-native-gesture-handler';



export default function PaulTestScreen({navigation}) {
  const [groupId, setGroupId] = React.useState();


  async function getGroup(){
    let result = await getGroupById(groupId)
    if(result)
      alert(JSON.stringify(result, null, 4))
    else
      alert("cannot find")
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
    if(result){
      alert("posted" + JSON.stringify(group, null, 4) + "Members:" + JSON.stringify(members, null, 4))
    } else {
      alert("Error has occurred. Please try again later")
    }
  }

  async function deleteGroup(){
    let result = await deleteGroupById(groupId);
    if(result){
      alert("Deleted")
    } else {
      alert("Error has occurred. Please try again later")
    }
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
      <Button
        title='Login'
        buttonStyle={styles.button}
        onPress={()=> navigation.navigate("Test Screen 3")}
      />
      <Button
        title='signup'
        buttonStyle={styles.button}
        onPress={()=> navigation.navigate("Test Screen 6")}
      />
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
