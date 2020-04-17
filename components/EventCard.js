import * as React from 'react';
import { formatDate, formatTime } from "../utils/date";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Divider, Icon, Button } from 'react-native-elements';


export default function EventCard({onPress, item, status}) {

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.cardContentContainer} onPress = {onPress}>
          <Text h4>{item.Name}</Text>
          <View style={styles.row}>
            <Icon name="event"/>
            <View style={styles.cardColumn}>
              <Text h5 style={styles.cardColumnText}>{formatDate(new Date(item.DateTime))}</Text>
              <Text h5 style={styles.cardColumnText}>{formatTime(new Date(item.DateTime))}</Text>
            </View>
            <Icon name="remove-circle"/>
            <View style={styles.cardColumn}>
              <Text h5 style={styles.cardColumnText}>{item.Penalty}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Icon name="location-on"/>
            <View style={styles.cardFullColumn}>
              <Text h5 style={styles.cardColumnText}>{item.IsOnline ? 'Online Meeting' : item.LocationName}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Icon name="person"/>
            <View style={styles.cardFullColumn}>
              <Text h5 style={styles.cardColumnText}>{item.MemberCount + "/" + item.MaxMember}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {status === 'PENDING' && (
          <View style={styles.cardButtonContainer}>
            <View style={{...styles.cardButton, backgroundColor: '#A0A0A0', borderTopRightRadius: 10}}>
              <Icon name="close" color="white"/>
            </View>
            <View style={{...styles.cardButton, backgroundColor: '#5A5A5A', borderBottomRightRadius: 10}}>
              <Icon name="check" color="white"/>
            </View>
          </View>
        )}
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
    backgroundColor: '#C4C4C4',
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
  cardButton: {
    flex: 1,
    justifyContent: 'center'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    flexGrow: 0,
    alignItems: 'center'
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
    paddingLeft: 2
  },
});
