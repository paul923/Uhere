import * as React from 'react';
import { formatDate, formatTime } from "../utils/date";
import { StyleSheet, View } from 'react-native';
import { Text, Divider, Icon } from 'react-native-elements';


export default function EventCard({item, status}) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <Text h4>{item.name}</Text>
        <View style={styles.row}>
          <Icon name="event"/>
          <View style={styles.cardColumn}>
            <Text h5 style={styles.cardColumnText}>{formatDate(item.date)}</Text>
            <Text h5 style={styles.cardColumnText}>{formatTime(item.date)}</Text>
          </View>
          <Icon name="remove-circle"/>
          <View style={styles.cardColumn}>
            <Text h5 style={styles.cardColumnText}>{item.prize}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Icon name="location-on"/>
          <View style={styles.cardColumn}>
            <Text h5 style={styles.cardColumnText}>{item.location}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Icon name="person"/>
          <View style={styles.cardColumn}>
            <Text h5 style={styles.cardColumnText}>{item.members.length + "/" + item.maximumNumberOfMembers}</Text>
          </View>
        </View>
      </View>
      <Divider style={{ height: 0.3, margin: 5, backgroundColor: 'black' }} />
    </View>
  )
}

const styles = StyleSheet.create({
    row: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexGrow: 0,
      alignItems: 'center'
    },
    cardColumn: {
      flexBasis: '40%',
      paddingTop: 2,
      paddingBottom: 2,
    },
    cardColumnText: {
      paddingLeft: 2
    },
    cardContent: {
      marginTop: 5,
      marginBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
      backgroundColor: '#C4C4C4'
    }
});
