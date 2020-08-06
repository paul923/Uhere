import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Input, ListItem, Avatar, Header, Icon } from 'react-native-elements'


import SideMenu from 'react-native-side-menu'




export default function DrawerLayoutScreen() {
  const [ isOpen, setOpen] = React.useState(false);
  const [ diffView, setDiffView] = React.useState(true);

  React.useEffect(() => {

  }, []);


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 20
    },
    button: {
      margin: 5,
      height: 50
    },
    sideMenu: {
      flex: 1,
      backgroundColor: 'white',
      borderWidth: 1,
    },
    hostContainer: {
      flex: 2,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    friendsContainer: {
      flex:4,
      borderWidth: 1,
      padding: 5
    },
    bottomBar: {
      borderWidth: 1,
      flexDirection: 'row',
      padding: 5,
    },
    friendsButton: {
      flexDirection: 'row'
    },
    bottomIcon:{
      marginHorizontal: 10
    }
});
