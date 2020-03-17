import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, Platform } from 'react-native';

export default class DefaultSlide extends React.PureComponent {
  render() {
    const { item, dimensions, bottomButton } = this.props;
    const style = {
      flex: 1,
      backgroundColor: item.backgroundColor,
      width: dimensions.width,
      paddingBottom: bottomButton ? 132 : 64,
    };
    return (
      <View style={[styles.mainContent, style]}>
        <Image source={item.image} style={[styles.image, item.imageStyle]} />
        <View style={styles.textBox}>
          <Text style={[styles.title, item.titleStyle]}>{item.title}</Text>
          <Text style={[styles.text, item.textStyle]}>{item.text}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    justifyContent: 'space-around',
  },
  image: {
    alignSelf: 'center'
  },
  textBox : {
    top: 50,
    alignItems: 'flex-start',
  },
  text: {
    color: 'rgba(255, 255, 255, .7)',
    fontSize: 20,
    textAlign: 'left',
    fontWeight: '300',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 40,
    color: 'rgba(255, 255, 255, .7)',
    fontWeight: '500',
    paddingHorizontal: 16,
  },
});
