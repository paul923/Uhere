import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar, Header, Button, Icon, ListItem } from 'react-native-elements';

export default function EventUser (props){
    return (
        <View style={styles.item}>
            <View style={styles.row}>
                <Text style={styles.title}>{props.index + 1}.</Text>
                <View style={styles.column}>
                    <Avatar
                        rounded
                        source={{uri: props.item.AvatarURI}}
                        containerStyle={styles.icon}
                    />
                    <Text style={styles.title}>{props.item.Nickname}</Text>
                </View>
                {props.item.ArrivedTime === null ?
                    (<Text style={styles.status}>Late</Text>)
                    :
                    (<Text style={styles.status}>{new Date(props.item.ArrivedTime) <= new Date(props.event.DateTime) ? 'On Time' : 'Late'}</Text>)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        padding: 15,
        marginHorizontal: 16,
    },
    icon: {
        alignSelf:'auto',
        right:0
    },
    title: {
        alignSelf:'center',
        right:0
    },
    status: {
        alignSelf:'center',
        position:'absolute',
        right: 0
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    column: {
        marginLeft: 15,
    },
})