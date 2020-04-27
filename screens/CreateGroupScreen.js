import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, FlatList, TouchableWithoutFeedback } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'



export default function CreateGroupScreen({ navigation, route }) {
  const [groupName, setGroupName] = React.useState("");
  const [friendsGroup, setFriendsGroup] = React.useState(null);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  }, []);


  return (
    <View style={styles.container}>
      <Header
        leftComponent={
          <Icon
            name="arrow-left"
            type="entypo"
            color= "white"
            size={30}
            underlayColor= "transparent"
            onPress={()=> navigation.goBack()}
          />
        }
        rightComponent={
          <TouchableOpacity>
            <Text style={{color: 'white'}}>Done</Text>
          </TouchableOpacity>
        }
        centerComponent={{ text: 'Create Group', style: { color: '#fff', fontSize: 20 } }}
        containerStyle={{zIndex:200}}
        statusBarProps={{translucent: true}}
      />
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        <View style={styles.contentContainer}>
          <View style={styles.groupContainer}>
            <Text style={styles.fieldText}>Group Name</Text>
            <TextInput
              style={{borderWidth: 1, height: 50, color: 'black', borderRadius: 10}}
              value={groupName}
              onChangeText={(text)=> setGroupName(text)}
            />
          </View>
          <View style={styles.addFriendsContainer}>
            <Text style={styles.fieldText}>Add Friends</Text>
            {/**Friends FlatList */}
            <TouchableOpacity onPress={()=> navigation.navigate('Add Friend List')}>
              <View style={styles.addButton}>
                <Icon
                  name="plus"
                  type="entypo"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20
  },
  groupContainer: {
    marginVertical: 30,
  },
  addFriendsContainer: {
    height: 100,
  },
  fieldText:{
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20
  },
  addButton: {
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
    borderStyle: 'dashed'
  }
})
