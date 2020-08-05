import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList, TouchableWithoutFeedback } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'



export default function AddFriendSelectionScreen({ navigation, route }) {

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
        centerComponent={{ text: 'FRIENDS', style: { color: '#fff', fontSize: 20 } }}
        statusBarProps={{translucent: true}}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={()=> {navigation.navigate('Add Friend By Id');}}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Add by ID</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> {}}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Invite</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    paddingVertical: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  button: {
    borderWidth: 1,
    borderRadius: 5,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems:'center'
  },
  buttonText: {
    marginVertical: 5,
    fontSize: 20,
    fontWeight: 'bold'
  }
})
