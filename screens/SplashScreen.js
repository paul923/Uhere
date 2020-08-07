import * as React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/*Icon*/}
      <Image
        style={styles.uhereIcon}
        source={require('assets/images/Group3Copy-ios-all/png/Group3Copy.imageset/UhereLogo.png')}
        resizeMode="contain"
      />
      {/*Logo*/}
      <Image
        source={require('assets/images/UhereCopy2-ios-all/png/UhereCopy2.imageset/UhereCopy2.png')}
        style={styles.uhereLogo}
        resizeMode="contain"
      />
      {/*Text*/}
      <Text style={styles.text}>
        {"Don’t be late ever again"}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: "center",
  },
  iconContianer: {

  },
  uhereIcon: {
    width: 75,
    height: 90.6,
  },
  logoContainer: {

  },
  uhereLogo: {
    width: 125,
    height: 42,
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
    fontStyle: "italic",
    letterSpacing: 0,
    margin: 6,
    flexDirection: 'row'
  },
});
