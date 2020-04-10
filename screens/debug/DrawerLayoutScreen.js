import * as React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Input, ListItem, Avatar, Header, Icon } from 'react-native-elements'

import AvatarScreen from '../AvatarScreen'
import { ScrollView, FlatList } from 'react-native-gesture-handler';

import SideMenu from 'react-native-side-menu'




export default function DrawerLayoutScreen() {
  const [ isOpen, setOpen] = React.useState(false);

  React.useEffect(() => {
    
  }, []);

  function toggleSideMenu(){
    setOpen(!isOpen)
  }

  return (
    <SideMenu 
      menu={menuContent()} 
      menuPosition='right'
      isOpen={isOpen}
      onChange={toggleSideMenu}
      bounceBackOnOverdraw={false}
    >
      <View style={styles.container}>
        <Header
          rightComponent={
            <Icon
              name="bars"
              type="font-awesome"
              onPress={toggleSideMenu}
            />
          }
        />

        
      </View>
    </SideMenu>
  )
}

function menuContent(){
  return(
    <View>
      <Text>Hello world</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
      paddingBottom: 20
    },
    button: {
      margin: 5,
      height: 50
    }
});
