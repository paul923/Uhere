import * as React from 'react';
import { StyleSheet, View, TouchableOpacity, TouchableHighlight, FlatList } from 'react-native';
import { Text, Divider, Icon, Button, Image, Avatar } from 'react-native-elements';
import { backend } from '../constants/Environment';
import firebase from 'firebase';
import { getAvatarImage } from '../utils/asset';

export default function EventMenuContent(props) {
  const renderItem = ({ item }) => (
    <View style={styles.memberCard}>
      <Avatar
        imageProps={{
          resizeMode: 'contain',
          style: {
            tintColor: item.AvatarColor
          },
          source:getAvatarImage(item.AvatarURI)
        }}
        style={[styles.memberAvatar, { borderColor: item.AvatarColor }]}
      />
      <Text style={styles.memberName}>{item.Nickname}</Text>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.eventTitle}>{props.eventTitle}</Text>
        </View>
        <View style={styles.hostContainer}>
          <Avatar
            containerStyle={[styles.hostAvatar, { borderColor: props.hostData.AvatarColor }]}
            imageProps={{
              resizeMode: 'contain',
              style: {
                tintColor: props.hostData.AvatarColor
              },
              source:getAvatarImage(props.hostData.AvatarURI)
            }}
          />
          <Text style={styles.hostText}>Host</Text>
          <Text style={styles.displayName}>{props.hostData.Nickname}</Text>
        </View>
        <View style={styles.usersContainer}>
          <Text style={styles.participantText}>Participants</Text>
          <FlatList
            data={props.membersData}
            renderItem= {renderItem}
            keyExtractor={item => item.UserId}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <Icon type="material-community" name="exit-to-app" color="#636363" onPress={props.close}/>
        <Icon type="antdesign" name="setting" color="#636363" onPress={props.navigation}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20
  },
  titleContainer: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    paddingVertical: 5
  },
  hostAvatar: {
    alignSelf: 'center',
    margin: 10,
    width: 65,
    height: 65,
    borderWidth: 3,
    borderRadius: 10,
    overflow:'hidden',
  },
  eventTitle: {
    fontSize: 14,
    color: "#15CDCA",
    fontWeight: "bold"
  },
  hostContainer: {
    width: '100%',
    aspectRatio: 1.3,
    justifyContent: 'center',
  },
  displayName: {
    fontSize: 14, 
    color: 'black', 
    textAlign: 'center',
    fontWeight: "bold",
  },
  hostText: {
    fontSize: 10, 
    color: '#15CDCA', 
    fontWeight: "bold",
    textAlign: 'center'
  },
  usersContainer: {
    flex: 1,
  },
  participantText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 5
  },
  memberCard: {
    flexDirection: 'row',
    marginVertical: 7,
    alignItems: 'center',
    height: 40,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderRadius: 10,
    overflow:'hidden',
    marginHorizontal: 3
  },
  memberName: {
    fontSize: 14,
    marginHorizontal: 10,
    fontWeight: "500"
  },
  footer: {
    height: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#F5F5F5"
  }
});
