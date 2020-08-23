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
      }}>NEXT STEP</Text>
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignitems: "center",
      }}>
      <Image
        source={{ uri: 'https://img.icons8.com/carbon-copy/2x/arrow.png'}}
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
    position: 'absolute',
    borderRadius: 20,
    zIndex: 999,
    width: 250,
    height: 80,
    bottom: 40,
    right: 0,
    backgroundColor: '#15cdca',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledStyle: {
    position: 'absolute',
    borderRadius: 20,
    zIndex: 999,
    width: 250,
    height: 80,
    bottom: 100,
    right: 0,
    backgroundColor: '#15cdca30',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  }
});
