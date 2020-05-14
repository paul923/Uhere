import * as React from 'react';
import { formatDate, formatTime } from "../utils/date";
import { StyleSheet, View } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';

export default function Collapse({title, collapsed, content}) {
  const [ isCollapsed, setIsCollapsed ] = React.useState(collapsed);
  return (
    <View>
      <ListItem
        style={styles.collapseButton}
        key={title}
        title={title}
        bottomDivider
        onPress={() => setIsCollapsed(!isCollapsed)}
        rightIcon={<Icon name="expand-more" />}
      />
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.content}>
          {content}
        </View>
      </Collapsible>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
});
