import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, ScrollView, Dimensions } from 'react-native';
import { Avatar, Header, Button , Icon} from 'react-native-elements';
import Constants from 'expo-constants';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

// Constants
const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// Below should come from Event Detial in the future
const meetingLocation = { latitude: 49.2451673, longitude: -122.8933748 }
const members = [
  {
    name: 'Matthew Kim',
    initial: 'MK',
    color: '#fc0f03',
    location : { latitude: 49.3049901, longitude: -122.8332702 },
  },
  {
    name: 'Paul Kim',
    initial: 'PK',
    color: '#0362fc',
    location : { latitude: 49.2620402, longitude: -122.8763948 },
  },
  {
    name: 'Justin Choi',
    initial: 'JC',
    color: '#fcba03',
    location : { latitude: 49.2509886, longitude: -122.8920569 },
  },
]

export default class JayTestScreen extends React.Component {

  state = {
    mapRegion: { latitude: 0, longitude: 0, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA },
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let location = await Location.getCurrentPositionAsync({});
    let region = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }
    this.setState({ mapRegion: region});
  };

  async _goToMyLocation() {
    let location = await Location.getCurrentPositionAsync({});
    let region = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }
    this.mapView.animateToRegion(region);
  };

  _fitAll = async () => {
    let location = await Location.getCurrentPositionAsync({});
    let coordinates = []
    // user's location
    coordinates.push({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    // meeting location
    coordinates.push(meetingLocation);
    // members' locations
    members.map((u) => coordinates.push(u.location))
    this.mapView.fitToCoordinates(coordinates, { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },animated: true });
  };

  render() {
    return (
      <View style={styles.container}>

        <Header
          leftComponent={{ icon: 'chevron-left', color: '#fff' }}
          centerComponent={{ text: 'Map View', style: { color: '#fff' } }}
          centerContainerStyle= {{flex: 1}}
          rightComponent={{ text: 'Event Detail', style: { color: '#fff', flexWrap: 'wrap' } }}
        />
        {/* MapView */}
        <MapView
          ref = {(ref)=> this.mapView=ref}
          style={styles.mapStyle}
          showsUserLocation={true}
          // region : which section of the map to render/zoom
          region={this.state.mapRegion}
        >
          {/* Meeting Location Circle */}
          <MapView.Circle
            center = {{
              latitude: meetingLocation.latitude,
              longitude: meetingLocation.longitude,
            }}
            radius = {500} // in meters
            strokeWidth = {2}
            strokeColor = 'rgba(89, 89, 89, 0.42)'
            fillColor = 'rgba(89, 89, 89, 0.42)'
          />
          {/* Member Markers */}
          {
            members.map((u, i) => {
              return(
                <MapView.Marker
                  key = {i}
                  pinColor = {u.color}
                  coordinate = {
                    {
                      latitude: u.location.latitude,
                      longitude: u.location.longitude,
                    }
                  }
                />
              )
            })
          }
        </MapView>

        {/* My Location Button */}
        <View style={styles.myLocationStyle}>
          <Icon
            reverse
            name='location-arrow'
            type='font-awesome'
            onPress = {() => this._goToMyLocation()}
          />
        </View>

        {/* Goal In Button */}
        <View style={styles.goalStyle}>
          <Icon
            reverse
            name='check'
            type='font-awesome'
          />
        </View>

        <View style={styles.avatarContianer}>
          <ScrollView horizontal={true} contentContainerStyle={{flexGrow: 1, justifyContent : 'center'}}>
            {/* fitAll */}
            <View style={styles.avatar}>
              <Avatar
                rounded
                size='medium'
                icon={{name: 'users', type: 'font-awesome'}}
                onPress = {() => this._fitAll()}
              />
            </View>
            {/* Meeting Location */}
            <View style={styles.avatar}>
              <Avatar
                rounded
                size='medium'
                icon={{name: 'map-marker', type: 'font-awesome'}}
                onPress = {() => this.mapView.animateToRegion({latitude: meetingLocation.latitude, longitude: meetingLocation.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA })}
              />
            </View>
            {/* Members */}
            {
              members.map((u, i) => {
                let memberRegion = { latitude: u.location.latitude, longitude: u.location.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }
                console.log(memberRegion)
                return(
                  <View style={styles.avatar} key = {i}>
                    <Avatar
                      rounded
                      size='medium'
                      title = {u.initial}
                      onPress = {() => this.mapView.animateToRegion(memberRegion)}
                    />
                  </View>
                )
              })
            }
          </ScrollView>
        </View>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapStyle: {
    flex: 1,
  },
  avatarContianer: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  avatar: {
    margin: 10,
  },
  myLocationStyle: {
    position: 'absolute',
    top:150,
    right:0,
  },
  goalStyle: {
    alignSelf: 'center',
    position: 'absolute',
    bottom:100,
  },
});
