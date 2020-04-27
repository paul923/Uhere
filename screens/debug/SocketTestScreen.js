import * as React from 'react';
import { StyleSheet, View, Text , Dimensions, TextInput} from 'react-native';
import { Button } from 'react-native-elements'
import { backend } from 'constants/Environment';
import * as Location from 'expo-location';
import useSocket from 'use-socket.io-client';
import firebase from 'firebase';
import MapView from 'react-native-maps';

const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const LATITUDE_DELTA_MAP = 0.0922;
const LONGITUDE_DELTA_MAP = LATITUDE_DELTA_MAP * ASPECT_RATIO;


export default function SocketTestScreen({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [event, setEvent] = React.useState("");
    const [socket] = useSocket(`http://${backend}:3000`, { autoConnect: false, reconnectionDelay: 1000, reconnection: true, forceNode: true });
    const [locationData, setLocationData] = React.useState({});
    const [mapRegion, setMapRegion] = React.useState();

    React.useEffect(() => {
        loadInitial()

        return function cleanup() {
            socket.disconnect();
        };
    }, []);


    async function loadInitial() {
        console.log("test");
        socket.connect();
        socket.on('connect', (data) => {
        })
        socket.on('updatePosition', ({user, position}) => {
          console.log('Location Data');
          console.log(locationData);
          setLocationData((prevLocationData) => {
            return {
              ...prevLocationData,
              [user]: position
            }
          })
        })

        let location = await Location.getCurrentPositionAsync();
        let region = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: LATITUDE_DELTA_MAP, longitudeDelta: LONGITUDE_DELTA_MAP }
        setMapRegion(region);
        setIsLoading(false);
    }
    async function emitPosition() {
        let location = await Location.getCurrentPositionAsync();
        let user = firebase.auth().currentUser.uid;
        let position = { latitude: location.coords.latitude, longitude: location.coords.longitude }
        setLocationData({...locationData, [user]: position});
        socket.emit('position', {
            user,
            position,
            event
        })
    }

    async function joinEvent() {
      socket.emit('join', {
        event
      })
      socket.on('requestPosition', () => {
        emitPosition();
      })
    }

    return (
        <View style={styles.container}>
            {isLoading ? (
                <Text>loading...</Text>
            ) : (
                    <MapView
                        style={{
                            flex: 2,
                        }}
                        region={mapRegion}
                    >
                    </MapView>
                )}
            <View style={{ flex: 1 }}>
                {locationData !== null && (
                    <Text>
                        {JSON.stringify(locationData)}
                    </Text>
                )}
                <Button
                    title='Emit My Position'
                    buttonStyle={styles.button}
                    onPress={emitPosition}
                />
                <TextInput
                  onChangeText={text => setEvent(prev => text)}
                  value={event}
                />
                <Button
                  title="Join Event"
                  buttonStyle={styles.button}
                  onPress={joinEvent}
                  />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    button: {
        margin: 5,
        height: 50
    }
});
