import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Avatar, Header, Button, Icon } from 'react-native-elements';
import ColorPalette from '../components/react-native-color-palette/src';


const avatarImages = [
  {
    key: '1',
    name: 'Image1',
    uri: 'https://img.insight.co.kr/static/2018/05/01/700/f9v32iy7li764c61kj2k.jpg'
  },
  {
    key: '1',
    name: 'Image2',
    uri: 'https://img.insight.co.kr/static/2019/12/04/700/2pyx44485s6q97u8z8dd.jpg'
  },
  {
    key: '1',
    name: 'Image3',
    uri: 'https://i.ytimg.com/vi/ljUwX9a2Cr4/maxresdefault.jpg'
  },
  {
    key: '1',
    name: 'Image4',
    uri: 'https://img1.daumcdn.net/thumb/R720x0.q80/?scode=mtistory2&fname=http%3A%2F%2Fcfile4.uf.tistory.com%2Fimage%2F996B483A5D73B72B34D12F'
  },
  {
    key: '1',
    name: 'Image5',
    uri: 'https://lh3.googleusercontent.com/proxy/_2txXPzwe8cBYyYvWAPqQQ2ecVaI2Nflnk5kECHmJBjQ-zGjRokEoSK53mmLyWto3-CNScz3L5n9YJe75Ds2pr_KUWE7F8YrQItr3NXPmxbarZ64LtPbNuv3sdjoAUfxCzkcpT_heDlKeZk5614DmqWI9uwX51Pn178SffwyEgk'
  },
  {
    key: '1',
    name: 'Image6',
    uri: 'https://img.insight.co.kr/static/2019/12/13/700/09yeacn8uz5cpkhf78qf.jpg'
  }
]


export default class AvatarImageScreen extends Component {
  state = {
    uri: ''
  }


  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon
              name="arrow-left"
              type="entypo"
              color= "white"
              size={30}
              underlayColor= "transparent"
              onPress={()=> this.props.navigation.goBack()}
            />
          }
          centerComponent={{text: 'Select Your Avatar', style: {color: 'black', fontSize: 25}}}
          containerStyle={{backgroundColor: 'transparent', borderBottomWidth: 0}}
        />
        <View style={styles.imageContainer}>
          {
            avatarImages.map((u, i) => {
              return(
                <View style={{margin: 5}}>
                  <Avatar
                    key={i}
                    rounded
                    size={100}
                    source={{
                      uri : u.uri
                    }}
                    onPress={()=>{
                      this.props.navigation.navigate('AvatarScreen', {uri: u.uri})
                    }}
                  />
                </View>
              )
            })
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
    marginTop: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '90%',
    flexWrap: 'wrap',
  }
});
