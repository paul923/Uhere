import * as React from 'react';
import { formatHeaderDate, convertDateToLocalTimezone } from "../utils/date";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Avatar } from 'react-native-elements';
import { getAvatarImage } from 'utils/asset'

export default function HistoryCard({ event, onPress}) {
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
            {event.Members.map((member, i) => {
              if(i < 3)
                return(
                  <MemberTile
                    key={i}
                    imageProps={{resizeMode: 'contain'}}
                    overlayContainerStyle={{backgroundColor: 'white'}}
                    source={getAvatarImage(member.AvatarURI)}
                  />
                )
            })}
            {
              (event.Members.length > 3) && <MemberTile title={"+" + (event.Members.length - 3)} titleStyle={styles.avatarTitle}/>
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
      style={styles.memberAvatar}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: {
      width: 0,
      height: 10
    },
    elevation: 5,
    shadowRadius: 10,
    shadowOpacity: 1,
    padding: 18,
    margin: 10,
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
  memberList: {
    flexDirection: "row"
  },
  avatarTitle: {
    fontSize: 10
  },
  memberAvatar: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 10,
    overflow:'hidden',
    borderColor: '#15cdca',
    marginHorizontal: 3
  }
});
