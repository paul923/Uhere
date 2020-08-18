import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Input, ListItem, Avatar } from 'react-native-elements'

import AvatarScreen from '../AvatarScreen'
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import HistoryCard from '../../components/HistoryCard';
import UhereHeader from '../../components/UhereHeader';

import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import UhereSideMenu from '../../components/UhereSideMenu';


export default function TestScreen2({navigation}) {
  // drawerRef for side menu button
  const drawerRef = React.useRef(null);

  return (
    <UhereSideMenu
      drawerRef = {drawerRef}
      data = {"hello world"}
    >
      <View style={styles.container}>
        <UhereHeader
          showSideMenu
          onPressSideMenu={() => drawerRef.current.openDrawer()}
        />
        <HistoryCard onPress={() => alert("pressed!")}/>
      </View>
    </UhereSideMenu>
  )
}


const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: "center",
    },
});
