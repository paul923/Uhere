import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Divider, Input, Button, Image } from 'react-native-elements';

export default function NextStep(props) {
  return (
    <TouchableOpacity style={props.disabled ? styles.disabledStyle : styles.activeStyle}
    {...props}
    >
      <Text style={{
        flex: 1,
        color: "#ffffff",
        fontFamily: "OpenSans_400Regular",
        fontSize: 20,
        fontWeight: "700",
        letterSpacing: 0,
        marginLeft: 20
      }}>{props.confirm ? 'CONFIRM' : 'NEXT'}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  activeStyle: {
    borderRadius: 20,
    zIndex: 999,
    width: 300,
    height: 80,
    alignSelf: 'center',
    margin: 20,
    backgroundColor: '#15cdca',
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledStyle: {
    borderRadius: 20,
    zIndex: 999,
    width: 300,
    height: 80,
    alignSelf: 'center',
    margin: 20,
    backgroundColor: '#15cdca30',
    flexDirection: 'row',
    alignItems: 'center',
  }
});
