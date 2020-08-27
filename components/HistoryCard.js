import * as React from 'react';
import { formatHeaderDate, convertDateToLocalTimezone } from "../utils/date";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Divider, Icon, Button, Image, Avatar } from 'react-native-elements';
import { backend } from '../constants/Environment';
import firebase from 'firebase';
import { TouchableHighlight } from 'react-native-gesture-handler';
import FriendTile from '../components/FriendTile'
import { getEvents, getEvent } from 'api/event';

export default function HistoryCard({ event, onPress,}) {
  return (
    <TouchableOpacity onPress = {onPress}>
      <View style={styles.cardContainer}>
        <View style={styles.cardRow}>
          <View>
            <Text style={styles.subTitleText}>{formatHeaderDate(convertDateToLocalTimezone(new Date(event.DateTime)))}</Text>
            <Text style={styles.titleText}>{event.Name}</Text>
          </View>
        </View>
        <View style={styles.spacer}></View>

        <View style={styles.cardRow}>
          <View>
            <Text style={styles.subTitleText}>Location</Text>
            <Text style={styles.titleText}>{event.LocationName}</Text>
          </View>
          <View style={styles.memberList}>
            {data.map((member, i) => {
              if(i < 3)
                return(
                  <MemberTile
                    source={member.uri}
                  />
                )
            })}
            {
              (data.length > 3) && <MemberTile title={"+" + (data.length - 3)} titleStyle={styles.avatarTitle}/>
            }
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function MemberTile(props){
  return (
    <Avatar
      containerStyle={styles.memberTile}
      rounded
      {...props}
    />
  );
}

const data = [
  {uri: require("../assets/images/robot-dev.png")},
  {uri: require("../assets/images/robot-dev.png")},
  {uri: require("../assets/images/robot-dev.png")},
  {uri: require("../assets/images/robot-dev.png")},
  {uri: require("../assets/images/robot-dev.png")},
  {uri: require("../assets/images/robot-dev.png")},
]

const styles = StyleSheet.create({
  cardContainer: {
    width: 380,
    height: 122,
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    padding: 18,
    marginVertical: 10,
  },
  cardRow:{
    flexDirection: "row",
    justifyContent: "space-between"
  },
  subTitleText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#a9a8aa"
  },
  titleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#15cdca"
  },
  spacer: {
    height: 31
  },
  memberTile: {
    borderWidth: 1,
    marginHorizontal: 2,
    borderRadius: 10,
  },
  memberList: {
    flexDirection: "row"
  },
  avatarTitle: {
    fontSize: 10
  }
});
