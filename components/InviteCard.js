import * as React from 'react';
import { formatDate, formatTime, convertDateToLocalTimezone } from "../utils/date";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Avatar, Icon, Button, Image } from 'react-native-elements';
import { backend } from '../constants/Environment';
import firebase from 'firebase';
import { acceptEvent, declineEvent } from 'api/event';

export default function InviteCard({onPress, item, status}) {

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <View style={styles.cardColumn}>
          <Avatar
            overlayContainerStyle={{
              borderRadius: 10
            }}
            size={45}
          />
        </View>
        <View style={{
          ...styles.cardColumn,
          paddingHorizontal: 10,
          flex: 1
        }}>
          <View style={{
            ...styles.cardRow,
            width : 137
          }}>
            <Text style={styles.inviteContent}>You are invited to event {item ? item.Name : "No Name"}</Text>
          </View>
          <View style={styles.cardRow}>
          <Text style={styles.dateContent}>
            {item ? formatDate(convertDateToLocalTimezone(new Date(item.DateTime))) + ' | ' + formatTime(convertDateToLocalTimezone(new Date(item.DateTime))) : "No Date"}
          </Text>
          </View>
        </View>
        <View style={styles.cardColumn}>
          <TouchableOpacity style={styles.acceptButton} onPress={() => acceptEvent(item.EventId)}>
            <Text style={styles.buttonFont}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.declineButton} onPress={() => declineEvent(item.EventId)}>
            <Text style={styles.buttonFont}>Decline</Text>
          </TouchableOpacity>
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
    height: 84,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 7, 
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    padding: 10
  },
  cardContentContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignContent: 'stretch'
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
  },
  cardRow: {
    flexDirection: 'row',
    alignContent: 'stretch'
  },
  cardColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  inviteContent: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 12,
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: 0,
    color: '#000000'
  },
  dateContent: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 8,
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    color: '#15cdca'
  },
  acceptButton: {
    width: 73, 
    height: 28,
    borderRadius: 14,
    backgroundColor: "#15cdca",
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  declineButton: {
    width: 73, 
    height: 28,
    borderRadius: 14,
    backgroundColor: "#505050",
    marginBottom: 5,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonFont: {
    fontFamily: "OpenSans_400Regular",
    fontSize: 12,
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#ffffff",
  }
});
