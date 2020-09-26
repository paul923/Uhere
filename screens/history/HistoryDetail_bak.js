import * as React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Image, Text, SearchBar, Header } from 'react-native-elements';
import ResultCard from '../../components/ResultCard'


export default function HistoryDetail(event) {
    return (
      <View style={styles.container}>
        
        <View style={styles.dateNameStyle}>
          <Text style={styles.dateStyle}>25 June 2020</Text>
          <Text style={styles.eventNameStyle}>Event Title Goes Here</Text>
        </View>
        
        <View style={{
          borderBottomWidth: 1,
          borderBottomColor: "#a9a8aa",
          width: 340,
          alignSelf: "center"
        }}
        />
        
        <View style={styles.locationtimepenalty}>
          <View style={styles.item}>
            <Text style={styles.subTitleText}>Location</Text>
            <Text style={styles.titleText}>Ham Ji Bak</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.subTitleText}>Time</Text>
            <Text style={styles.titleText}>5:30 PM</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.subTitleText}>Penalty</Text>
            <Text style={styles.titleText}>Bingsoo</Text>
          </View>
        </View>


        <Text style={{
          fontSize: 15,
          color: "#a9a8aa",
          marginLeft: 10,
          marginTop: 10,
        }}>Result</Text>
        <View style={styles.resultList}>
          <ScrollView
            horizontal
          >
            <TouchableOpacity
            activeOpacity={1}>
            <ResultCard></ResultCard>
            </TouchableOpacity>
            <TouchableOpacity
            activeOpacity={1}>
            <ResultCard></ResultCard>
            </TouchableOpacity>
            <TouchableOpacity
            activeOpacity={1}>
            <ResultCard></ResultCard>
            </TouchableOpacity>
            <TouchableOpacity
            activeOpacity={1}>
            <ResultCard></ResultCard>
            </TouchableOpacity>
            
          </ScrollView>
        </View>
        
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
      width: 374,
      height: 380,
      backgroundColor: "white",
      alignSelf: "center"
    },
    dateNameStyle:{
      marginHorizontal:10,
      marginVertical:10
    },
    dateStyle:{
      fontSize: 15 ,
      color: "#a9a8aa"
    },
    eventNameStyle:{
      fontSize: 25,
      color: "#15cdca"
    },
    locationtimepenalty: {
      flexDirection: 'row',
      alignContent: 'stretch',
      justifyContent: "space-between",
      marginTop: 20
    },
    item: {
      marginHorizontal:10,
    },
    subTitleText:{
      fontSize: 15,
      color: "#a9a8aa"
    },
    titleText:{
      fontSize: 20,
      color: "#15cdca",
    },
    resultList:{
      marginHorizontal:10,
      marginTop:20,
      flexDirection: 'row',
      alignContent: 'stretch',
      justifyContent: "space-between",
    },
  });