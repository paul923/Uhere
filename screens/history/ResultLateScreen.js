import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import { getAvatarImage } from "../../utils/asset.js";

export default function ResultLateScreen({navigation, route}){
  const [ userList ] = React.useState(route && route.params);
  
  React.useEffect(() => {
    console.log(userList)
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemAvatarContainer}>
        <Avatar
          rounded
          imageProps= {{
            style: {
              tintColor: item.AvatarColor
            }
          }}
          source={getAvatarImage(item.AvatarURI)}
          placeholderStyle={{backgroundColor: 'transparent'}}
        />
      </View>
      <Text style={styles.itemNickname}>{item.Nickname}</Text>
      <Text style={styles.itemTime}>{item.LateFlag}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Avatar
          size='large'
          rounded
          imageProps={{
            resizeMode: 'contain',
            style: {
              width: 50,
              alignItems: 'center',
              alignSelf: 'center',
              tintColor: 'white'
            },
          }}
          containerStyle={{
            alignSelf: 'center',
            alignItems: 'center',
            marginVertical: 10,
            backgroundColor: '#FA6969'
          }}
          placeholderStyle={{backgroundColor: 'transparent'}}
          source={require('../../assets/images/miscs/penalty.png')}
        />
        <Text style={styles.findOutText}>Let's find out</Text>
        <Text>who is the real turtle</Text>
      </View>
      <View style={styles.gameContainer}>
        <View style={styles.lateListTextContainer}>
          <Text style={styles.lateListText}>LATE LIST</Text>
        </View>
        <FlatList
          data={userList}
          renderItem={renderItem}
          style={styles.lateList}
          keyExtractor={item => item.UserId}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Start"
          onPress={() => {
            navigation.navigate('Result Game Screen', userList)
          }}
          titleStyle={{fontWeight: 'bold'}}
          buttonStyle={styles.buttonStyle}
        />
      </View>
    </View>
  );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#EDEDED",
  },
  headerContainer: {
    flex: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 15
  },
  buttonContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gameContainer: {
    flex: 8,
    backgroundColor: "#ffffff",
    alignItems: 'center',
    marginHorizontal: 24,
    padding: 15,
    borderRadius: 10
  },
  buttonStyle: {
    width: 89,
    height: 80,
    borderRadius: 25,
    backgroundColor: '#15CDCA'
  },
  pickedUserName:{
    fontSize: 25, 
    marginVertical: 10
  },
  findOutText: {
    fontSize: 25, 
    color: '#15cdca', 
    fontWeight: 'bold',
    marginVertical: 3
  },
  lateListTextContainer: {
    padding: 5,
    width: '100%',
    borderBottomWidth: 2,
    borderColor: '#15CDCA'
  },
  lateList: {
    width: '100%',
    padding: 10
  },
  lateListText: {
    color: '#4A4A4A',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8
  },
  itemAvatarContainer: {
    flex: 1,
  },
  itemNickname: {
    flex: 2,
    fontSize: 12,
    justifyContent: 'center'
  },
  itemTime: {
    flex: 1,
    fontSize: 12,
    color: 'red'
  }
});
