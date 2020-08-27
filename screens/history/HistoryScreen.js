import * as React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Image, Text, SearchBar, Header } from 'react-native-elements';
import HistoryCard from 'components/HistoryCard';
import HistoryDetail from './HistoryDetail'
import { getEvents, getEvent } from 'api/event';
import Modal from 'react-native-modal';

export default function HistoryScreen({ navigation, route }) {
		const [isFetching, setIsFetching] = React.useState(false);
		const [events, setEvents] = React.useState([]);
		const [serchText, setserchText] = React.useState();
		const [modalVisible, setModalVisible] = React.useState(false);

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
						placeholder="Search for your past events here"
						onChangeText={(searchText) => setserchText(searchText)}
						value={serchText}
						lightTheme={true}
					/>

					{/* History List */}
          <FlatList
						style={styles.listContainer}
						contentContainerStyle={{paddingTop: 10}}
            data={events}
            onRefresh={() => onRefresh()}
            refreshing={isFetching}
            renderItem={({ item }) => (
							<View>
								<HistoryCard
									event={item}
									onPress={() => setModalVisible(true)}
								/>
								<Modal
									isVisible={modalVisible}
									swipeDirection={['down']}
									onSwipeComplete={() => setModalVisible(false)}
									onBackdropPress={() => setModalVisible(false)}
									propagateSwipe={true}
								>
									<HistoryDetail
										event={item}
									/>
								</Modal>
							</View>
            )}
            keyExtractor={(item, index) => item.EventId.toString() }
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
		},
		searchBar: {
			flex: 1,
    },
    listContainer: {
			flex: 1,
		},
  });