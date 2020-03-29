import * as React from 'react';
import { StyleSheet, StatusBar, Platform, View, Button, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

export default class JayTestScreen extends React.Component {
  
  state = {
    mapRegion: { latitude: 49.2442458, longitude: -122.8926027, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA },
    locationResult: null,
    location: {coords: { latitude: 37.78825, longitude: -122.4324}},
    juilet: { latitude: 49.2451673, longitude: -122.8933748, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA },
    matthew: { latitude: 49.3049901, longitude: -122.8332702, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA },
    paul: { latitude: 49.2620402, longitude: -122.8763948, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA },
    justin: { latitude: 49.2509886, longitude: -122.8920569, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA },
  };
  

  componentDidMount() {
    this._getLocationAsync();
  }
  
  _handleRegionChange = mapRegion => {
    this.mapView.animateToRegion(mapRegion);
  }

  async _goToMyLocation() {
    let location = await Location.getCurrentPositionAsync({});
    let region = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }
    this.mapView.animateToRegion(region);
  };

  _ZoomOut = ()  => {
    let coordinates = [
      { latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude },
      this.state.juilet,
      this.state.matthew,
      this.state.paul,
      this.state.justin,
      // to test something far way My Office
      //{ latitude: 49.2797516, longitude: -123.1235704 },
    ]
    this.mapView.fitToCoordinates(coordinates, { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },animated: true });
  };
  
  _getLocationAsync = async () => {
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ locationResult: JSON.stringify(location), location, });
    let region = { latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }
    this.setState({ mapRegion: region});
  };

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <MapView 
          ref = {(ref)=> this.mapView=ref}
          style={styles.mapStyle} 
          showsUserLocation={true}    
          // below doesnt work with iOS map
          showsMyLocationButton={true}
          showsCompass={true}
          showsPointsOfInterest={true}
          // region : which section of the map to render/zoom
          region={this.state.mapRegion}
        >

          <MapView.Circle
            center = {{
              latitude: this.state.juilet.latitude,
              longitude: this.state.juilet.longitude,
            }}
            radius = {500} // in meters
            fillColor = { 'rgba(230,238,255,0.5)' }
          />

          <MapView.Marker
            //Matthew
            pinColor = '#fc0f03'
            coordinate = {{latitude: this.state.matthew.latitude,longitude: this.state.matthew.longitude}}
          />
          <MapView.Marker
            //Paul
            pinColor = '#0362fc'
            coordinate = {{latitude: this.state.paul.latitude,longitude: this.state.paul.longitude}}
          />
          <MapView.Marker
            //Justin
            pinColor = '#fcba03'
            coordinate = {{latitude: this.state.justin.latitude,longitude: this.state.justin.longitude}}
          />

        </MapView>
        
        <View style={styles.myLocationStyle}>
          <Button title= 'My Location'onPress = {() => this._goToMyLocation()}
          />
        </View>
        <View style={styles.zoomOutStyle}>
          <Button title= 'Zoom out' onPress = {this._ZoomOut}/>
        </View>
        <View style={styles.goalStyle}>
          <Button title= 'GOAL!'/>
        </View>
        
        <View style={styles.buttonContainer}>
          <ScrollView horizontal={true} contentContainerStyle={{flexGrow: 1, justifyContent : 'center'}}>
            <Button title= 'Juilet' onPress = {() => this._handleRegionChange(this.state.juilet)}/>
            <Button title= 'Matthew' onPress = {() => this._handleRegionChange(this.state.matthew)}/>
            <Button title= 'Paul' onPress = {() => this._handleRegionChange(this.state.paul)}/>
            <Button title= 'Justin' onPress = {() => this._handleRegionChange(this.state.justin)}/>
          </ScrollView>
        </View>

      </View>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    bottom: 0,
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: 'white',
  },
  myLocationStyle: {
    position: 'absolute',
    top:100,
    right:0,
    backgroundColor: 'white',
  },
  zoomOutStyle: {
    position: 'absolute',
    top:150,
    right:0,
    backgroundColor: 'white',
  },
  goalStyle: {
    position: 'absolute',
    bottom:50,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
});
