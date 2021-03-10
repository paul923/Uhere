import * as React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Image, Text, SearchBar, Header } from 'react-native-elements';
import HistoryCard from 'components/HistoryCard';
import { getEvents, getEvent } from 'api/event';
import UhereHeader from '../../components/UhereHeader';

export default function HistoryScreen({ navigation, route }) {
	const [isFetching, setIsFetching] = React.useState(false);
	const [events, setEvents] = React.useState([]);
	const [filteredEvents, setFilteredEvents] = React.useState([]);
	const [searchText, setserchText] = React.useState();

	React.useEffect(() => {
		async function fetchData() {
			let events = await getEvents('ACCEPTED', true, 100, 0);
			if (events.message === "Not Found") {
				setEvents([]);
				setFilteredEvents([]);
			} else {
				setEvents(events)
				setFilteredEvents(events);
			}
		}
		const unsubscribeFocus = navigation.addListener('focus', () => {
			fetchData();
		});
		return unsubscribeFocus;
	}, []);

	async function filterEvents(searchText) {
		setserchText(searchText);
		if (searchText.length > 0) {
			let filtered = events.filter(
				(event) => {
					return event.Name.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || event.LocationName.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
				}
			);
			setFilteredEvents(filtered);
		} else {
			setFilteredEvents(events);
		}
	}

	async function onRefresh() {
		setIsFetching(true);
		let events = await getEvents('ACCEPTED', true, 10, 0);
		if (events.message === "Not Found") {
			setEvents([]);
			setFilteredEvents([]);
		} else {
			setEvents(events)
			setFilteredEvents(events);
		}
		setserchText();
		setIsFetching(false);
	}

	function renderHistoryCard({ item }) {
		return (
			<HistoryCard
				event={item}
				onPress={() => navigation.navigate('HistoryDetail', {
					EventId: item.EventId
				})}
			/>
		)
	}

	return (
		<View style={styles.container}>
			{/* Header */}
			<UhereHeader
                showBackButton={false}
            />
			<View style={{flex: 1, paddingTop: 30}}>
				<Text style={styles.historyText}>History</Text>
				{/* Search Bar */}
				<SearchBar
					lightTheme
					placeholder="search for your past events here"
					inputContainerStyle={{height: 30, backgroundColor: '#FEFEFE'}}
					containerStyle={styles.searchBarContainer}
					onChangeText={(searchText) => filterEvents(searchText)}
					value={searchText}		
				/>
				{/* History List */}
				<FlatList
					style={styles.listContainer}
					contentContainerStyle={{ paddingTop: 10 }}
					data={filteredEvents}
					onRefresh={() => onRefresh()}
					refreshing={isFetching}
					renderItem={renderHistoryCard}
					keyExtractor={(item) => item.EventId.toString()}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#f5f5f5",
	},
	historyText: {
		fontSize: 24,
		fontWeight: "500",
		letterSpacing: 0,
		color: "#15cdca",
		marginHorizontal: 15,
	},
	searchBarContainer: {
		alignContent: 'center',
		backgroundColor: '#FEFEFE',
		marginHorizontal: 15,
		borderRadius: 5,
		borderTopColor: "#fff",
		borderBottomColor: "#fff",
		marginVertical: 10
	},
	listContainer: {
		flex: 1,
	},
});
