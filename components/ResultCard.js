import * as React from 'react';
import { StyleSheet, View,Image, TouchableOpacity } from 'react-native';
import { Text, Divider, Icon, Button } from 'react-native-elements';

export default function ResultCard() {
    return (
        <View style={styles.container}>
            <Image
                style={{borderRadius: 10,width:42, height:42}}
                source={require("../assets/images/robot-dev.png")} 
            />
            <View>
                <Text style={{color:"#15cdca"}}>1st</Text>
                <Text>Jay</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 110,
        height: 48,
        backgroundColor: "white",
        alignSelf: "center",
        flexDirection: "row",
        shadowColor: "rgba(0, 0, 0, 0.15)",
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowRadius: 10,
        shadowOpacity: 0.2,
        borderRadius: 10 
    }
});