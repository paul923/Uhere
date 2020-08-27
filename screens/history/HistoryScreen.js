import * as React from 'react';
import { SectionList, SafeAreaView, StyleSheet, View, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Image, Button, Text, CheckBox, Divider, Icon, SearchBar, Header } from 'react-native-elements';
// history card
import HistoryCard from 'components/HistoryCard';
import { formatEventList } from 'utils/event';
import { getEvents, getEvent } from 'api/event';

export default function HistoryScreen({ navigation, route }) {
    const [events, setEvents] = React.useState([]);
    const [isFetching, setIsFetching] = React.useState(false);
    React.useEffect(() => {
      async function fetchData() {
        let events = await getEvents('ACCEPTED', true, 10, 0);
        setEvents(events)
      }
      const unsubscribeFocus = navigation.addListener('focus', () => {
        fetchData();
      });
      return unsubscribeFocus;
    }, []);
  
    async function onRefresh() {
      setIsFetching(true);
      let events = await getEvents('ACCEPTED', true, 10, 0);
      setEvents(events)
      setIsFetching(false);
    }
    return (
      <View style={styles.container}>
				{/* Header */}
				<Header
					backgroundColor="#ffffff"
					centerComponent={<Image
						source={require('assets/images/UhereCopy2-ios-all/png/UhereCopy2.imageset/UhereCopy2.png')}
						style={{
							height: 40,
							width: 100
						}}
						resizeMode="contain"
					/>}
					statusBarProps={{ translucent: true }}
				/>
        <View style={styles.searchBar}>
          <Text style={styles.historyText}>
						History
					</Text>
					{/* Search Bar */}
					<SearchBar
						placeholder="Type Here..."
						//onChangeText={}
						//value={search}
					/>

					{/* History List */}
          <FlatList
						style={styles.listContainer}
						contentContainerStyle={{paddingTop: 10}}
            data={events}
            onRefresh={() => onRefresh()}
            refreshing={isFetching}
            renderItem={({ item }) => (
              <HistoryCard
								event={item}
                // onPress={()=>navigation.navigate('HistoryDetail', {
                //   EventId: item.EventId,
                //   EventType: "ON-GOING"
                // })}
                />
            )}
            keyExtractor={(item) => item.EventId}
          />
        </View>
      </View>
    )
  }
  
  const styles = StyleSheet.create({
		container: {
      flex: 1,
      justifyContent: 'center',
			alignItems: "center",
		},
		historyText:{
			fontSize: 25,
			marginVertical: 10,
			color: "#15cdca",
			fontFamily: "OpenSans",
		},
		searchBar: {
			flex: 1,
    },
    listContainer: {
			flex: 1,
		},
  });