import * as React from 'react';
import { formatDate, formatTime, convertDateToLocalTimezone } from "../utils/date";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Divider, Icon, Button, Image } from 'react-native-elements';
import { backend } from '../constants/Environment';
import firebase from 'firebase';
import { acceptEvent, declineEvent } from 'api/event';

export default function InviteCard({onPress, item, status}) {

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <View style={{
          ...styles.cardColumn,
          flex: 2
        }}>
          <View style={styles.cardRow}>
            <Text style={styles.inviteContent}>You are invited to event {item.Name}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.dateContent}>{formatDate(convertDateToLocalTimezone(new Date(item.DateTime))) + ' | ' + formatTime(convertDateToLocalTimezone(new Date(item.DateTime)))}</Text>
          </View>
        </View>
        <View style={styles.cardColumn}>
          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.acceptButton} onPress={() => acceptEvent(item.EventId)}>
              <Text style={styles.buttonFont}>Accept</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.declineButton} onPress={() => declineEvent(item.EventId)}>
              <Text style={styles.buttonFont}>Decline</Text>
            </TouchableOpacity>
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
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15
  },
  cardContentContainer: {
    flex: 1,
    margin: 20,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignContent: 'stretch'
  },
  cardContent: {
    margin: 20,
    flex: 1,
    flexDirection: 'row',
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
  inviteContent: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 18,
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: 0,
    color: '#000000'
  },
  dateContent: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: '#15cdca'
  },
  acceptButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#15cdca",
    marginTop: 5,
    alignItems: 'center'
  },
  declineButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#505050",
    marginBottom: 5,
    marginTop: 5,
    alignItems: 'center'
  },
  buttonFont: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 14,
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#ffffff",
  }
});
