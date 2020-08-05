import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Avatar, Header, Button, Icon } from 'react-native-elements';
import ColorPalette from '../components/react-native-color-palette/src';


const avatarImages = [
  {
    key: '1',
    name: 'Image1',
    uri: 'https://img.insight.co.kr/static/2018/05/01/700/f9v32iy7li764c61kj2k.jpg'
  },
  {
    key: '2',
    name: 'Image2',
    uri: 'https://img.insight.co.kr/static/2019/12/04/700/2pyx44485s6q97u8z8dd.jpg'
  },
  {
    key: '3',
    name: 'Image3',
    uri: 'https://i.ytimg.com/vi/ljUwX9a2Cr4/maxresdefault.jpg'
  },
  {
    key: '4',
    name: 'Image4',
    uri: 'https://img1.daumcdn.net/thumb/R720x0.q80/?scode=mtistory2&fname=http%3A%2F%2Fcfile4.uf.tistory.com%2Fimage%2F996B483A5D73B72B34D12F'
  },
  {
    key: '5',
    name: 'Image5',
    uri: 'https://lh3.googleusercontent.com/proxy/ajInWbANUxvZ5pd4vjow2p-d1pHN7NYKQBn5Z3gXmOGbMaLoD_SdskZxl9gEiWV7gsB-mnAuuVsfOlNpz9_g7K8GlFSn3SwRTr9pbwthUj6qV4IL-rKsJBbnhK966_hNbUxviIAV6XJ0rdzOuU9k6vv4LjS-fYPnDg'
  },
  {
    key: '6',
    name: 'Image6',
    uri: 'https://img.insight.co.kr/static/2019/12/13/700/09yeacn8uz5cpkhf78qf.jpg'
  },
  {
    key: '7',
    name: 'Image7',
    uri: 'https://cdn.ppomppu.co.kr/zboard/data3/tf_news/2017/0325/m_201712241490410521.jpg'
  },
  {
    key: 'initial',
    name: 'initial',
    uri: undefined
  },

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
                <View style={{margin: 5,}} key={i}>
                  <Avatar
                    key={u.key}
                    rounded
                    size={100}
                    source={u.uri && {
                      uri : u.uri
                    }}
                    title={u.uri ? undefined : this.props.route.params.initial}
                    onPress={()=>{
                      this.props.navigation.navigate('ProfileScreen', {uri: u.uri})
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
    marginTop: 30,
    justifyContent: "center",
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 5,
    flexWrap: 'wrap',
  }
});
