import React, { PureComponent } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

export default class SelectCategory extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.array,
    selectedArray: PropTypes.array,
    onChange: PropTypes.func,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
  }
  static defaultProps = {
    dataSource: [],
    selectedArray: [],
    onChange: () => {},
    onRefresh: () => {},
    refreshing: false,
  }

  constructor() {
    super();
    this.state = {
      refreshing: false,
    };
  }
  onRefresh = () => {
    this.props.onRefresh();
  }

  renderItem = ({item, index}) => {
    const { selectedArray, onChange } = this.props;
    const isSelected = selectedArray.some(ele => ele === item.id);
    return (
      <View style={styles.button}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.button_con,
            isSelected ?
              { backgroundColor: '#3e9ce9', borderColor: '#3e9ce9' } :
              { backgroundColor: '#fff', borderColor: '#ddd' }
          ]}
          onPress={() => onChange(item)}
        >
          <Text
            style={[
              styles.button_con_font,
              isSelected ? { color: '#fff' } : { color: 'black' }
            ]}
          >{item.label}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  render() {
    return (
      <FlatList
        keyExtractor={(item, index) => item.id}
        initialNumToRender={19}
        style={styles.container}
        data={this.props.dataSource}
        getItemLayout={(data, index) => ({
          length: 60, offset: 60 * (index - 1), index,
        })}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        onRefresh={this.onRefresh}
        refreshing={this.props.refreshing}
        renderItem={this.renderItem}
        showsVerticalScrollIndicator={false}
      />
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button_con: {
    padding: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  button_con_font: {
    fontSize: 14,
  },
  columnWrapper: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
})
