import * as React from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import firebase from 'firebase';
import Timer from '../../components/Timer'

const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const LATITUDE_DELTA_MAP = 0.0922;
const LONGITUDE_DELTA_MAP = LATITUDE_DELTA_MAP * ASPECT_RATIO;

export default function EventMap({ event, eventMembers, locations }) {
    const [isLoading, setIsLoading ] = React.useState(true);
    const [mapRegion, setMapRegion] = React.useState();
    const mapRef = React.useRef();

    React.useEffect(() => {
        //console.log("Locations")
        //console.log(locations)
        //console.log(eventMembers)
        async function fetchData() {
            let location = await Location.getCurrentPositionAsync();
            let region = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: LATITUDE_DELTA_MAP, longitudeDelta: LONGITUDE_DELTA_MAP }
            setMapRegion(region);
            setIsLoading(false);
        }
        fetchData()
    }, []);

    async function _goToMyLocation() {
        let location = await Location.getCurrentPositionAsync();
        let region = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: LATITUDE_DELTA_MAP, longitudeDelta: LONGITUDE_DELTA_MAP }
        mapRef.current.animateToRegion(region);
    }

    async function _fitAll() {
        let location = await Location.getCurrentPositionAsync();
        let coordinates = []
        // user's location
        coordinates.push({ latitude: location.coords.latitude, longitude: location.coords.longitude });
        // meeting location
        coordinates.push({ latitude: event.LocationGeolat, longitude: event.LocationGeolong });
        // eventMembers' locations
        Object.keys(locations).map((key) => {
            let coordinate = { latitude: locations[key].latitude, longitude: locations[key].longitude }
            coordinates.push(coordinate);   
        })
        mapRef.current.fitToCoordinates(coordinates, { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true });
    }

    return (
        <View style={styles.container}>
          {!isLoading && event && (
            <React.Fragment>
              {/* Timer */}
              <View style={styles.timer}>
                  <Timer eventDateTime={event.DateTime} />
              </View>
              {/* MapView */}
              <MapView
                  ref={mapRef}
                  style={styles.mapStyle}
                  showsUserLocation={true}
                  showsMyLocationButton={false}
                  // region : which section of the map to render/zoom
                  initialRegion={mapRegion}
              >
                  {/* Meeting Location Circle */}
                  <MapView.Circle
                      center={{
                          latitude: event.LocationGeolat,
                          longitude: event.LocationGeolong,
                      }}
                      radius={500} // in meters
                      strokeWidth={2}
                      strokeColor='rgba(89, 89, 89, 0.42)'
                      fillColor='rgba(89, 89, 89, 0.42)'
                  />
                  {/* Member Markers */}
                  {
                    Object.keys(locations).map((key) => {
                        const member = eventMembers.find(m => m.UserId === key);
                        if (key !== firebase.auth().currentUser.uid) {
                            return (
                                <MapView.Marker
                                    key={key}
                                    pinColor={member.AvatarColor}
                                    coordinate={
                                        {
                                            latitude: locations[key].latitude,
                                            longitude: locations[key].longitude,
                                        }
                                    }
                                />
                            )
                        }
                      })
                  }
              </MapView>
              {/* My Location Button */}
              <View style={styles.myLocationStyle}>
                  <Icon
                      reverse
                      name='location-arrow'
                      type='font-awesome'
                      size={20}
                      onPress={_goToMyLocation}
                  />
              </View>
              {/* fitAll */}
              <View style={styles.fitAllStyle}>
                  <Icon
                      reverse
                      name='users'
                      type='font-awesome'
                      size={20}
                      onPress={_fitAll}
                  />
              </View>
              {/* Avatars */}
              <View style={styles.avatarContianer}>
                  <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                      {/* Meeting Location */}
                      <View style={styles.avatar}>
                          <Avatar
                              rounded
                              size='medium'
                              icon={{ name: 'map-marker', type: 'font-awesome' }}
                              onPress={() => mapRef.current.animateToRegion({ latitude: event.LocationGeolat, longitude: event.LocationGeolong, latitudeDelta: LATITUDE_DELTA_MAP, longitudeDelta: LONGITUDE_DELTA_MAP })}
                          />
                      </View>
                      {/* eventMembers */}
                      {
                        Object.keys(locations).map((key) => {
                            const member = eventMembers.find(m => m.UserId === key);
                            if (key !== firebase.auth().currentUser.uid) {
                                let memberRegion = { latitude: locations[key].latitude, longitude: locations[key].longitude, latitudeDelta: LATITUDE_DELTA_MAP, longitudeDelta: LONGITUDE_DELTA_MAP }
                                return (
                                    <View style={styles.avatar} key={key}>
                                        <Avatar
                                            rounded
                                            size='medium'
                                            title={member.Nickname.substring(0, 2)}
                                            onPress={() => mapRef.current.animateToRegion(memberRegion)}
                                        />
                                    </View>
                                )
                            }
                        })
                      }
                  </ScrollView>
              </View>
            </React.Fragment>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    timer: {
        position:'absolute',
        alignSelf:'center',
        top:0,
        zIndex:9999,
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
    fitAllStyle: {
        position: 'absolute',
        top: 150,
        right: 0,
    },
    myLocationStyle: {
        position: 'absolute',
        top: 100,
        right: 0,
    },
});
