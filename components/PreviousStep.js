import * as React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Divider, Input, Button, Image } from 'react-native-elements';

export default function PreviousStep(props) {
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
      }}>{props.confirm ? 'CONFIRM' : 'PREVIOUS STEP'}</Text>
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignitems: "center",
      }}>
      <Image
        source={{ uri: 'https://img.icons8.com/carbon-copy/2x/left.png'}}
        resizeMode="contain"
        style={{
          height: 40,
        }}
      />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  activeStyle: {
    borderRadius: 20,
    zIndex: 999,
    width: 125,
    height: 80,
    alignSelf: 'flex-end',
    margin: 20,
    backgroundColor: '#15cdca',
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledStyle: {
    borderRadius: 20,
    zIndex: 999,
    width: 125,
    height: 80,
    alignSelf: 'flex-end',
    margin: 20,
    backgroundColor: '#15cdca30',
    flexDirection: 'row',
    alignItems: 'center',
  }
});
