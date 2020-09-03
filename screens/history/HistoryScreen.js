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
	const [searchText, setserchText] = React.useState();
	

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
					round={true}
					lightTheme={true}
					placeholder="Search..."
					autoCapitalize='none'
					autoCorrect={false}
					onChangeText={(searchText) => setserchText(searchText)}
					value={searchText}
					containerStyle={{
						backgroundColor: "white",
						margin: 10,
						borderColor: "#C4C4C4",
						borderWidth: 1,
						borderRadius: 10,
						padding: 3
					}}
					inputContainerStyle={{
						backgroundColor: "white"
					}}
					inputStyle={{
						backgroundColor: "white"
					}}
					leftIconContainerStyle={{
						backgroundColor: "white"
					}}
					rightIconContainerStyle={{
						backgroundColor: "white"
					}}
				/>
				{/* History List */}
				<FlatList
					style={styles.listContainer}
					contentContainerStyle={{ paddingTop: 10 }}
					data={events}
					onRefresh={() => onRefresh()}
					refreshing={isFetching}
					renderItem={({ item }) => (
						<HistoryCard
							event={item}
							onPress={() => navigation.navigate('HistoryDetail', {
								EventId: item.EventId
							})}
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
	historyText: {
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