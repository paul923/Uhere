import * as React from 'react';
import { StyleSheet, View, Text , Dimensions, TextInput} from 'react-native';
import { Button, ListItem } from 'react-native-elements'
var options = ["Crescent9723", "jayshur", "paulkim", "mk"];


export default function RouletteTestScreen({ navigation }) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [loser, setLoser] = React.useState(null);
    const [playable, setPlayable] = React.useState(true);
    const selectedIndexRef = React.useRef(selectedIndex);
    selectedIndexRef.current = selectedIndex;
    let ctx;
    React.useEffect(() => {
        return function cleanup() {
        };
    }, []);
    async function draw() {
      setPlayable(false);
      var min = 3;
      var max = 5;
      var rand = Math.floor(Math.random() * (max - min + 1) + min); //Generate Random number between 5 - 10
      var interval = setInterval(() => {
        if (selectedIndexRef.current == options.length - 1){
          setSelectedIndex(selectedIndex => 0);
        } else {
          setSelectedIndex(selectedIndex => selectedIndex + 1)
        }
      }, 100)
      setTimeout(() => {
        clearInterval(interval);
        setLoser(options[selectedIndexRef.current])
      }, rand * 1000);
    }
    return (
        <View style={styles.container}>
        {loser && (
          <ListItem
            key={0}
            title={loser}
            rightIcon={{ name: 'check' }}
            bottomDivider
          />
        )}

          {!playable && !loser && options.map((item, index) => (
            <ListItem
              key={index}
              title={item}
              rightIcon={selectedIndex === index ? { name: 'check' } : null}
              bottomDivider
            />
          ))}
          {playable && (
            <Button
              title="DRAW"
              onPress={draw}
              />
          )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
});
