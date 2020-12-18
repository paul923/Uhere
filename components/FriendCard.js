import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import {Icon, Header, Avatar, ListItem} from 'react-native-elements'
import { getAvatarImage } from '../utils/asset';




export default class FriendCard extends Component {
  render(){
    return (
        <ListItem containerStyle={styles.container} bottomDivider={this.props.bottomDivider}>
          <Avatar
            size={45}
            source={getAvatarImage(this.props.avatarUrl)}
            overlayContainerStyle={styles.avatarOverlayContainer}
            imageProps={{
              style: {
                tintColor: `${this.props.avatarColor}`,
              }
            }}
            placeholderStyle={{backgroundColor: "transparent"}}
          />
          <View style={styles.meContentContainer}>
            { this.props.meIcon &&
              <Image
                resizeMode="contain"
                style={styles.meIcon}
                source={require('../assets/icons/me/icon_me.png')}
              />
            }
            <ListItem.Content>
              <ListItem.Title style={styles.title}>{this.props.displayName}</ListItem.Title>
              <ListItem.Subtitle style={styles.subtitle}>{`@${this.props.userId}`}</ListItem.Subtitle>
            </ListItem.Content>
            { this.props.editToggle && !this.props.meIcon &&
              <TouchableOpacity onPress={this.props.onPressDelete}>
                <Icon
                  type="entypo"
                  name="circle-with-minus"
                  color="red"
                />
            </TouchableOpacity>}
          </View>
        </ListItem>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    marginHorizontal: 15,
    padding: 0,
    paddingVertical: 10
  },
  title: {
    fontWeight: "700",
    fontSize: 17, 
    fontWeight: "700"
  },
  subtitle: {
    fontSize: 12, 
    fontFamily: "OpenSans_400Regular", 
    fontWeight: "500"
  },
  avatarOverlayContainer: {
    overflow: 'hidden',
    borderRadius: 15,
    borderColor: "#d8d8d8",
    borderWidth: 1,
    backgroundColor: "#fff"
  },
  meIcon: {
    width: 23,
    height: 23,
    marginRight: 10
  },
  meContentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
});
