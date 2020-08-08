import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Divider, Input, Button } from 'react-native-elements';

export default function CustomInput(props) {
  return (
    <Input
      inputContainerStyle={styles.inputContainerStyle}
      inputStyle={styles.inputStyle}
      labelStyle={styles.labelStyle}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  inputContainerStyle: {
    borderRadius: 5,
    backgroundColor: "#ffffff",
    borderBottomWidth: 0,
    marginLeft: 10,
    marginRight: 10
  },
  inputStyle: {
    paddingLeft: 10,
    fontFamily: "OpenSans_400Regular",
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#d8d8d8"
  },
  labelStyle: {
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 10,
    paddingTop  : 10,
    fontFamily: "OpenSans_400Regular",
    fontSize: 14,
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#5d5d5d"
  }
});
