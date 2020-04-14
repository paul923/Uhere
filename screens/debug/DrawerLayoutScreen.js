import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Input, ListItem, Avatar, Header, Icon } from 'react-native-elements'


import SideMenu from 'react-native-side-menu'




export default function DrawerLayoutScreen() {
  const [ isOpen, setOpen] = React.useState(false);
  const [ diffView, setDiffView] = React.useState(true);

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
        
        {diffView ? viewA() : viewB()}
        
        <Button
          title="Switch View"
          type="solid"
          onPress={()=>setDiffView(!diffView)}
        />
      </View>
    </SideMenu>
  )
}

function viewA(){
  return (
    <View style={{flex:1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize:50}}>This is View A</Text>
    </View>
  );
}
function viewB(){
  return (
    <View style={{flex:1, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize:50}}>This is View B</Text>
    </View>
  );
}

function menuContent(){
  return(
    <View style={styles.sideMenu}>
      <View style={{flex: 10}}>
        <View style={styles.hostContainer}>
          <Text>Host</Text>
          <Avatar
            size='large'
            source={{uri: 'https://www.collinsdictionary.com/images/full/rose_277351964.jpg'}}
            avatarStyle={{borderWidth: 2, borderRadius: 5, borderColor: 'red'}}
          />
          <Text>Host Name</Text>
        </View>

        <View style={styles.friendsContainer}>
          <Text>Friends</Text>
          <View style={styles.friendsButton}>
            <Button
              title="Invite"
              icon={{
                name: "pluscircleo",
                type: "antdesign"
              }}
              type="outline"
              containerStyle={{flex: 1, marginHorizontal: 3,}}
            />
            <Button
              title="Edit"
              icon={{
                name: "minuscircleo",
                type: "antdesign"
              }}
              type="outline"
              containerStyle={{flex: 1, marginHorizontal: 3}}
            />
          </View>
          <Text>Flatlist of Friends</Text>
        </View>

      </View>

      <View style={styles.bottomBar}>
        <Icon
          name="md-exit"
          type="ionicon"
          iconStyle={styles.bottomIcon}
        />
        <Icon
          name="md-notifications"
          type="ionicon"
        />
      </View>
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
