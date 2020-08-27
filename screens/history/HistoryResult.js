import * as React from 'react';
import { StyleSheet, View, Image, Text, ScrollView } from 'react-native';
import UhereHeader from '../../components/UhereHeader';
import Timeline from 'react-native-timeline-flatlist'
import ResultTimeLine from '../../components/ResultTimeLine'

export default function HistoryResult() {
    return (
        <View style={styles.container}>
            <UhereHeader/>
            <Image  
                style={styles.avatarStyle}
                source={{
                    uri:
                        'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                }}
            />
            <View style={styles.textContainer}>
                <Text style={styles.titleText}>
                    You arrived second!
                </Text>
                <Text style={styles.descriptionText}>
                    Congratulate Jay for having the honors to buy everyone!
                </Text>
            </View>
            <View style={styles.timeline}>
            <Timeline
                data={data}
                columnFormat='two-column'
                circleSize={35}
                circleColor='rgba(0,0,0,0)'
                lineColor='#15cdca'
                timeContainerStyle={{minWidth:52}}
                timeStyle={{textAlign: 'center', backgroundColor:'#15cdca', color:'white', padding:5, borderRadius:13}}
                options={{
                  style:{paddingTop:10}
                }}
                innerCircle={'icon'}                 
                separator={false}
                detailContainerStyle={{marginBottom: 50,alignItems:"center", backgroundColor: "#15cdca", borderRadius: 15}}
            />
            </View>
        </View>
    )
}

const data = [
    { time: '09:00', title: 'First Doe', lineColor:'#15cdca', icon: require('../../assets/images/robot-dev.png') },
    { time: '10:45', title: 'Second Doe', lineColor:'#15cdca', icon: require('../../assets/images/robot-dev.png') },
    { time: '12:00', title: 'Third Doe', lineColor:'#15cdca',  icon: require('../../assets/images/robot-dev.png') },
    { time: '14:00', title: 'Fourth Doe', lineColor:'#15cdca',  icon: require('../../assets/images/robot-dev.png') },
    { time: '16:30', title: 'Fifth Doe', lineColor:'#15cdca',  icon: require('../../assets/images/robot-dev.png') }
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:"center",
    },
    timeline: {
        marginTop:50,
        width:362,
        height:380,
        backgroundColor:'white'
    },
    avatarStyle: {
        width:90,
        height:90,
        borderRadius: 45,
        margin:15
    },
    textContainer: {
        alignItems:"center",
    },
    titleText:{
        fontSize:25,
        color: "#15cdca"
    },
    descriptionText:{
        fontSize:12,
        color: "#4A4A4A"
    },
    scrollViewStyle:{
        margin:25
    }
});