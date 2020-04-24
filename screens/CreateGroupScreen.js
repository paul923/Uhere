import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, FlatList, TouchableWithoutFeedback } from 'react-native';
import {Icon, Header, Avatar, Input, Button, ListItem, SearchBar} from 'react-native-elements'



export default function CreateGroupScreen({ navigation, route }) {

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  }, []);

  return (
    <View>
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
      <Text>Create group screen</Text>
    </View>
  )
}
