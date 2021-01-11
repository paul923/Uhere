import * as React from 'react';
import * as Location from 'expo-location';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, TouchableHighlight, Picker, FlatList } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import qs from 'qs';
import { ListItem, Image, Button, Text, Input, Icon, Divider, Header, SearchBar } from 'react-native-elements';


export default function LocationSearchScreen({navigation}) {
  const [ locationQuery, setLocationQuery] = React.useState("");
  const [ location, setLocation] = React.useState(null);
  const [ locationResult, setLocationResult] = React.useState([]);


  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
  }, []);

  async function searchLocation() {
    let url = '';
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    try {
      url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURI(locationQuery) + '.json?' + qs.stringify({
        proximity: location.coords.longitude + ',' + location.coords.latitude,
        access_token: 'pk.eyJ1IjoiY3Jlc2NlbnQ5NzIzIiwiYSI6ImNrOGdtbzhjZjAxZngzbHBpb3NubnRwd3gifQ.wesLzeTF2LjrYjgmrfrySQ',
        limit: 10
      });
      let response = await fetch(url);
      let responseJson = await response.json();
      setLocationResult(responseJson.features);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={{flex: 1}}>
      <Header
        centerComponent={{text: 'Location', style: { color: '#fff' }}}
        leftComponent= {
          <Icon
            name="arrowleft"
            type="antdesign"
            color="white"
            onPress={()=> navigation.goBack()}
          />
        }
        rightComponent={
          <TouchableOpacity onPress={()=> {navigation.navigate('Event Edit', {location: location}); console.log(location)}}>
            <Text style={{color: 'white'}}>Confirm</Text>
          </TouchableOpacity>
        }
      />
      <View style={{flexDirection: 'row'}}>
        <Input
          containerStyle={{flex: 1}}
          value={locationQuery}
          onChangeText={setLocationQuery}
          placeholder="Type Address..."
          />
        <Button
          icon={
            <Icon name="search" size={25} color="white" />
          }
          onPress={searchLocation}
        />
      </View>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {locationResult.map((item, index) => (
          <ListItem
            key={index}
            title={item.text}
            subtitle={item.properties.address}
            onPress={() => {console.log(item); setLocation(item)}}
            rightIcon={location && item.id === location.id ? { name: 'check' } : null}
            bottomDivider
          />
        ))}
      </ScrollView>
    </View>
  )
}

