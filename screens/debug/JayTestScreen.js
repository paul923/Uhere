import * as React from 'react';
import { StyleSheet, View, Text , Dimensions} from 'react-native';
import { Button } from 'react-native-elements'
import { backend } from '../../constants/Environment';
import * as Location from 'expo-location';
import useSocket from 'use-socket.io-client';
import firebase from 'firebase';
import MapView from 'react-native-maps';

const SCREEN = Dimensions.get('window');
const ASPECT_RATIO = SCREEN.width / SCREEN.height;
const LATITUDE_DELTA_MAP = 0.0922;
const LONGITUDE_DELTA_MAP = LATITUDE_DELTA_MAP * ASPECT_RATIO;

export default function JayTestScreen({ navigation }) {
    const [isLoading, setIsLoading] = React.useState(true);
    const [socket] = useSocket(`http://${backend}:3000`, { autoConnect: false, reconnectionDelay: 1000, reconnection: true, forceNode: true });
    const [locationData, setLocationData] = React.useState();
    const [mapRegion, setMapRegion] = React.useState();
    React.useEffect(() => {
        async function loadInitial() {
            socket.connect();
            socket.on('otherPositions', (positionsData) => {
                console.log(positionsData);
                setLocationData(positionsData);
            })
            let location = await Location.getCurrentPositionAsync();
            let region = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: LATITUDE_DELTA_MAP, longitudeDelta: LONGITUDE_DELTA_MAP }
            setMapRegion(region);
            setIsLoading(false);
        }
        loadInitial()
        return function cleanup() {
            socket.disconnect();
        };
    }, []);

    async function emitPosition() {
        let location = await Location.getCurrentPositionAsync();
        socket.emit('position', {
            isocketI: socket.id,
            firebaseId: firebase.auth().currentUser.uid,
            position: { latitude: location.coords.latitude, longitude: location.coords.longitude },
            timestamp: Date.now(),
        })
    }

    return (
        <View style={styles.container}>
            {isLoading ? (
                <Text>loading...</Text>
            ) : (
                    <MapView
                        style={{
                            flex: 4,
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