import * as React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/*Icon*/}
      <Image
        style={styles.uhereIcon}
        // source={require('assets/images/logo_icon_colored/png/Group3Copy.imageset/UhereLogo.png')}
        source={require('../assets/images/logos/logo_icon_colored/png/Group3Copy.imageset/UhereLogo.png')}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: "center",
  },
  uhereIcon: {
    width: 75,
    height: 90.6,
  },
  uhereLogo: {
    width: 125,
    height: 42,
  },
  text: {
    width: 130,
    height: 15,
  },
});
