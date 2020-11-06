import * as React from 'react';
import { formatDate, formatTime, convertDateToLocalTimezone } from "../utils/date";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Divider, Icon, Button, Image } from 'react-native-elements';
import { backend } from '../constants/Environment';
import firebase from 'firebase';

export default function EventCard({onPress, item, status}) {
  async function accept() {
    let response = await fetch(`http://${backend}:3000/event/accept`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        EventId: item.EventId,
        UserId: firebase.auth().currentUser.uid
      }),
    });
    let responseJson = await response.json();
    alert(responseJson.response);
  }
  async function decline() {
    let response = await fetch(`http://${backend}:3000/event/decline`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        EventId: item.EventId,
        UserId: firebase.auth().currentUser.uid
      }),
    });
    let responseJson = await response.json();
    alert(responseJson.response);
  }

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.cardContentContainer} onPress = {onPress}>
        <View style={styles.cardRow}>
          <View style={styles.cardColumn}>
            <Text style={styles.cardColumnTitle}>Event Name</Text>
            <Text style={styles.cardTitle}>{item.Name}</Text>
          </View>
          <View style={styles.cardColumn}>
            <Text style={styles.cardColumnTitle}>Location</Text>
            <Text style={styles.cardContent}>{item.LocationName}</Text>
          </View>
        </View>
        <View style={{
          ...styles.cardRow,
          marginTop: 30
        }}>
          <View style={styles.cardColumn}>
            <Text style={styles.cardColumnTitle}>Date</Text>
            <Text style={styles.cardContent}>{formatDate(convertDateToLocalTimezone(new Date(item.DateTime))) + ' | ' + formatTime(convertDateToLocalTimezone(new Date(item.DateTime)))}</Text>
          </View>
          <View style={styles.cardColumn}>
            <View style={styles.cardRow}>
              {item.Members.map((member, index) => {
                if (index < 3) {
                  return (
                      <Image
                        key={index}
                        source={{uri: member.AvatarURI}}
                        style={styles.memberAvatar}
                        resizeMode='contain'
                      />
                  )
                }
              })}
              {item.MemberCount > 3 && (
                <View style={styles.memberAvatarPlaceholder}>
                  <Text style={styles.memberCount}>+{item.MemberCount-4 < 0 ? 0 : item.MemberCount-4}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15,
    elevation: 5,
  },
  cardContentContainer: {
    flex: 1,
    margin: 20,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignContent: 'stretch'
  },
  cardRow: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'stretch'
  },
  cardColumn: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'stretch'
  },
  cardColumnTitle: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 10,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#9b9b9b"
  },
  cardTitle: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 12,
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#15cdca",
    marginTop: 5
  },
  cardContent: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 12,
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#121212",
    marginTop: 5
  },
  memberAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginLeft: 5,
    backgroundColor: "#15cdca",
    justifyContent: 'center',
    alignItems: 'center'
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderColor: '#15cdca',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  memberCount: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 14,
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#ffffff"
  }
});
