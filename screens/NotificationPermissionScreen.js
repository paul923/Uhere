import * as React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.instruction}>
        <Image
          style={styles.bulletPoint}
          source={require("../assets/images/logos/logo_icon_white/png/Group3Copy.imageset/Group3Copy.png")}
          resizeMode="contain"
        />
        <Text style={styles.instructionText}>At setting, click the location button</Text>
      </View>
      <View style={styles.logoWrapper}>
        {/*Icon*/}
        <Image
          style={styles.uhereIcon}
          source={require('../assets/images/logos/logo_icon_white/png/Group3Copy.imageset/Group3Copy.png')}
          resizeMode="contain"
        />
        {/*Logo*/}
        <Image
          source={require('../assets/images/logos/logo_letter_colored/png/UhereCopy2.imageset/UhereCopy2.png')}
          style={styles.uhereLogo}
          resizeMode="contain"
        />
        {/*Text*/}
        <Image
          source={require('../assets/images/logos/logo_letter_colored/png/UhereCopy2.imageset/dontbelateeveragain.png')}
          style={styles.text}
          resizeMode="contain"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15cdca",
    justifyContent: 'center',
    alignItems: "center",
  },
  uhereIcon: {
    width: 100,
    height: 100,
  },
  uhereLogo: {
    width: 125,
    height: 42,
  },
  text: {
    width: 130,
    height: 15,
  },
  logoWrapper: {
    width: "100%",
    height: "60%",
    justifyContent: 'center',
    alignItems: 'center'
  },
  instruction: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16
  },
  bulletPoint:{
    width: 30,
    height: 30,
  },
  instructionText: {
    fontSize: 15,
    fontWeight: "bold",  
    color: "#fff",
    margin: 15
  },
});
