import * as React from 'react';
import { Text, Image, StyleSheet, View, TextInput } from 'react-native';
import { Button, Input, Header, Icon } from 'react-native-elements'
import { TouchableHighlight } from 'react-native-gesture-handler';

export default function UhereHeader(props, {navigation}) {
  const [groupId, setGroupId] = React.useState();

  return (
    <Header
      leftComponent={props.showBackButton && {icon: "left", type: "antdesign", size: 16, onPress: props.onPressBackButton}}
      centerComponent={
        props.title ?
        <Text style={styles.headerTitle}>{props.title}</Text> :
        <Image
          source={require('../assets/images/logos/logo_letter_colored/png/UhereCopy2.imageset/UhereCopy2.png')}
          style={styles.uhereLogo}
          resizeMode="contain"
        />
      }
      rightComponent={props.showSideMenu && { icon: 'menu', color: '#000', onPress: props.onPressSideMenu}}
      statusBarProps={{translucent: true}}
      backgroundColor='#ffffff'
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  headerTitle:{

  },
  button: {
    margin: 5,
    height: 50
  },
  uhereLogo:{
    width: 80,
  },
});
