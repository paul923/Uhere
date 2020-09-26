import * as React from 'react';
import { StyleSheet, View, Dimensions, Text, SafeAreaView } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { backend } from 'constants/Environment';
import * as Location from 'expo-location';
import useSocket from 'use-socket.io-client';
import firebase from 'firebase';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import * as userapi from 'api/user';
import SplashScreen from '../SplashScreen';
import { ScrollView } from 'react-native-gesture-handler';
//import HistoryResult from  '../history/HistoryDetail'

const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const LATITUDE_DELTA_MAP = 0.0922;
const LONGITUDE_DELTA_MAP = LATITUDE_DELTA_MAP * ASPECT_RATIO;

export default function JayTestScreen({ navigation }) {

    async function getUserByUserId() {
        let user = await userapi.getUserByUserId('MT8zHZzyrsUxLXC50y3TO6e36HS2');
        let user2 = await userapi.getUserByUserId('ddd');
        console.log(user);
        console.log(user2);
    }
    async function getUserByUsername(){
        let user = await userapi.getUserByUsername('jay');
        let user2 = await userapi.getUserByUsername('hello');
        console.log(user);
        console.log(user2);
    }
    async function getGroupsByUserId(){
        let groups = await userapi.getGroupsByUserId('MT8zHZzyrsUxLXC50y3TO6e36HS2');
        let goups2 = await userapi.getGroupsByUserId('hello');
        console.log(groups);
        console.log(goups2);
    }
    async function getRelationships(){
        let relationships = await userapi.getRelationships('MT8zHZzyrsUxLXC50y3TO6e36HS2');
        let relationships2 = await userapi.getRelationships('O1BDrdaufPcrbKaKt4v1w8Bz0Zl1');
        console.log(relationships);
        console.log(relationships2);
    }
    async function getRelationshipByUsername(){
        let relationship = await userapi.getRelationshipByUsername('MT8zHZzyrsUxLXC50y3TO6e36HS2','paul923');
        let relationship2 = await userapi.getRelationshipByUsername('MT8zHZzyrsUxLXC50y3TO6e36HS2','molah');
        console.log(relationship);
        console.log(relationship2);
    }
    async function createUser(){
        let user = {
            "UserId": "jaowije2p918rfjaoie",
            "Username": "Test Create",
            "Nickname": "nickname",
            "AvatarURI": "jyp",
            "AvatarColor": "#D47FA6",
            "RegisteredDate": "2020-04-20 04:13:34"
        }
        let created = await userapi.createUser(user);
        //let fail = await userapi.createUser(user);
        console.log(created);
    }
    async function createRelationship(){
        let created = await userapi.createRelationship('friend1','friend2');
        console.log(created);
    }
    async function updateUser(){
        let user = {
            "UserId": "jaowije2p918rfjaoie",
            "Username": "Test Create",
            "Nickname": "updatednick",
            "AvatarURI": "jyp",
            "AvatarColor": "#D47FA6",
            "RegisteredDate": "2020-04-20 04:13:34"
        }
        let updated = await userapi.updateUser(user);
        console.log(updated);
    }
    async function updateRelationship(){
        let updated = await userapi.updateRelationship('MT8zHZzyrsUxLXC50y3TO6e36HS2','test','Blocked');
        let updated2 = await userapi.updateRelationship('MT8zHZzyrsUxLXC50y3TO6e36HS2','test2','Friend');
        console.log(updated);
        console.log(updated2);
    }
    async function deleteUser(){
        let deleted = await userapi.deleteUser('xltCuDt5quTdCTCKtJbkGOuB3Co2');
        console.log(deleted);
    }

    return (
        //<HistoryResult/>
        <SplashScreen/>
        /*
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Button
                    title='getUserByUserId'
                    buttonStyle={styles.button}
                    onPress={getUserByUserId}
                />
                <Button
                    title='getUserByUsername'
                    buttonStyle={styles.button}
                    onPress={getUserByUsername}
                />
                <Button
                    title='getGroupsByUserId'
                    buttonStyle={styles.button}
                    onPress={getGroupsByUserId}
                />
                <Button
                    title='getRelationships'
                    buttonStyle={styles.button}
                    onPress={getRelationships}
                />
                <Button
                    title='getRelationshipByUsername'
                    buttonStyle={styles.button}
                    onPress={getRelationshipByUsername}
                />
                <Button
                    title='createUser'
                    buttonStyle={styles.button}
                    onPress={createUser}
                />
                <Button
                    title='createRelationship'
                    buttonStyle={styles.button}
                    onPress={createRelationship}
                />
                <Button
                    title='updateUser'
                    buttonStyle={styles.button}
                    onPress={updateUser}
                />
                <Button
                    title='updateRelationship'
                    buttonStyle={styles.button}
                    onPress={updateRelationship}
                />
                <Button
                    title='deleteUser'
                    buttonStyle={styles.button}
                    onPress={deleteUser}
                />
            </ScrollView>
        </SafeAreaView>
        */
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
    button: {
        margin: 5,
        height: 40
    }
});
