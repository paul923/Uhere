import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Dimensions, StyleSheet, View } from 'react-native'

import Icon from './icon';

const { width } = Dimensions.get('window');

const ColorOption = (props) => {
  const { icon, color, isSelected, scaleToWindow, onColorChange } = props;
  let scaledWidth = width * .025;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onColorChange(color)}
        style={[
          styles.colorOption,
          { backgroundColor: color },
          scaleToWindow && {
            width: width * .07,
            height: width * .07,
            marginHorizontal: scaledWidth,
            marginVertical: scaledWidth,
            borderRadius: scaledWidth * 2
          }
        ]}
      >
        {isSelected  && <Icon color={color} icon={icon} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  colorOption: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    marginVertical: 15,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: .25,
    borderRadius: 100
  },
  container: {
    width: "25%",
    alignItems: "center"
  }
});

ColorOption.propTypes = {
  icon: PropTypes.node,
  color: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  scaleToWindow: PropTypes.bool.isRequired,
  onColorChange: PropTypes.func.isRequired,
}

export default ColorOption;