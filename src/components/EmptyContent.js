import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  emptybox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptybox_text: {
    fontSize: 26,
    color: '#a1a1a1',
  },
});

export default function EmptyContent(props) {
  return (
    <View style={styles.emptybox}>
      <Text style={styles.emptybox_text}>Hello World</Text>
    </View>
  );
}
