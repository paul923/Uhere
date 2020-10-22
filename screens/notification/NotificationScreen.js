import * as React from 'react';
import { SectionList, SafeAreaView, StyleSheet, View, TouchableOpacity, FlatList  } from 'react-native';
import { Image, Button, Text, CheckBox, Divider, Icon, SearchBar, Header } from 'react-native-elements';
import InviteCard from 'components/InviteCard';
import { formatNotification } from 'utils/event';
import { formatDate, formatTime } from 'utils/date';
import Constants from "expo-constants";
import firebase from "firebase";
const { manifest } = Constants;
import { backend } from 'constants/Environment';
import { getNotifications } from 'api/notification';
import { FloatingAction } from "react-native-floating-action";
import UhereHeader from "../../components/UhereHeader"

export default function NotificationScreen({ navigation, route }) {
  const [notifications, setNotifications] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(false);
  React.useEffect(() => {
    async function fetchData() {
      let notifications = await getNotifications();
      if (notifications.message === "Not Found") {
        setNotifications([]);
      } else {
        setNotifications(formatNotification(notifications))
      }
    }
    const unsubscribeFocus = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribeFocus;
  }, []);

  async function onRefresh() {
    setIsFetching(true);
    let notifications = await getNotifications();
    if (notifications.message === "Not Found") {
      setNotifications([]);
    } else {
      setNotifications(formatNotification(notifications))
    }
    setIsFetching(false);
  }
  return (
    <View style={styles.container}>
      <UhereHeader
      />
      <View style={styles.container}>
        <SectionList
          style={styles.listContainer}
          sections={notifications}
          onRefresh={() => onRefresh()}
          refreshing={isFetching}
          renderItem={({ item }) => (
            <InviteCard
              item={item}
              status="ON-GOING"
            />
          )}
          keyExtractor={(item) => item.EventId.toString()}
          renderSectionHeader={({ section }) => (
            <Text h5 style={styles.sectionHeader}>{section.title}</Text>
          )}
          ItemSeparatorComponent={() => (<Divider style={{ height: 0, margin: 10, backgroundColor: 'black' }} />)}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15
  },
  sectionHeader: {
    marginTop: 15,
    marginBottom: 15,
    fontFamily: "OpenSans_400Regular",
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    color: "#15cdca"
  },
});
