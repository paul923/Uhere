import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements'
import Timer from '../../components/Timer'
import { backend } from '../../constants/Environment';
import io from 'socket.io-client';

export default function JayTestScreen({ navigation }) {
    socket = io.connect(`http://${backend}:3000`);
    socket.on('otherPositions', positionsData => {
        console.log(positionsData);
    })
    
    
    React.useEffect(() => {
    }, []);
    
    let eventDateTime = new Date(2020,3,18,13,30);
    console.log('render');
    
    function emitPosition() {
        socket.emit('position', {
            data: 123,
            id: socket.id,
        })
    }
    
    return (
        <View style={styles.container}>
            <Button
                title='Emit Something'
                buttonStyle={styles.button}
                onPress={emitPosition}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF00',
        justifyContent: 'center'
    },
    button: {
        margin: 5,
        height: 50
    }
});