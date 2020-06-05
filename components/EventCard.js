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
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.cardContentContainer} onPress = {onPress}>
          <Text style={styles.cardTitle} h4>{item.Name}</Text>
          <View style={styles.row}>
            <Icon color="white" name="location-on"/>
            <View style={styles.cardFullColumn}>
              <Text h5 style={styles.cardColumnText}>{item.IsOnline ? 'Online Meeting' : item.LocationName}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Icon color="white" name="event"/>
            <View style={styles.cardFullColumn}>
              <Text h5 style={styles.cardColumnText}>{formatDate(convertDateToLocalTimezone(new Date(item.DateTime))) + ' / ' + formatTime(convertDateToLocalTimezone(new Date(item.DateTime)))}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Icon color="white" name="person"/>
            <View style={styles.cardFullColumn}>
              <Text h5 style={styles.cardColumnText}>{item.MemberCount + "/" + item.MaxMember}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.cardButtonContainer}>
          <View style={styles.cardLogo}>
            <Image
              source={{uri: 'https://scx1.b-cdn.net/csz/news/800/2017/gps.jpg'}}
              style={{width: 30, height: 40}}
              containerStyle={{justifyContent: 'center'}}
              />
          </View>
          <View style={styles.cardChip}>
            <Image
              source={{uri: 'https://as1.ftcdn.net/jpg/01/22/06/72/500_F_122067245_li2zr9npi1aZZ6dto4SNgxAFKt302X7d.jpg'}}
              style={{width: 40, height: 30}}
              containerStyle={{justifyContent: 'center'}}
              />
          </View>
          <View style={styles.cardLightGroup}>
            <View style={styles.cardLightRed}>
            </View>
            <View style={styles.cardLightGreen}>
            </View>
          </View>
        </View>
      </View>
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
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 5,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  cardContentContainer: {
    flex: 4,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 30
  },
  cardButtonContainer: {
    flex: 1,
  },
  cardLogo: {
    paddingTop: 10,
    paddingRight: 10,
    flex: 1,
    borderWidth: 1,
    alignItems: 'flex-end'
  },
  cardChip: {
    paddingTop: 10,
    flex: 5,
    alignItems: 'center'
  },
  cardLightGroup: {
    flex: 4,
    flexDirection: 'row',
    marginBottom: 10,
    marginRight: 10
  },
  cardLightRed: {
    flex: 1,
    borderRadius: 40,
    backgroundColor: 'red',
  },
  cardLightGreen: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 40,
    backgroundColor: 'green',
  },
  cardButton: {
    flex: 1,
    justifyContent: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    flexGrow: 0,
    alignItems: 'center',
    paddingBottom: 5
  },
  cardColumn: {
    flexBasis: '40%',
    paddingTop: 2,
    paddingBottom: 2,
  },
  cardFullColumn: {
    flexBasis: '90%',
    paddingTop: 2,
    paddingBottom: 2,
  },
  cardColumnText: {
    paddingLeft: 2,
    color: 'white'
  },
  cardTitle: {
    color: 'white',
    paddingLeft: 10,
    paddingBottom: 5
  }
});
