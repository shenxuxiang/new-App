import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import SelectCategory from '../../components/SelectCategory';
import Icon from '../../components/Icon';
import { Toast, Storage, createAction } from '../../utils';

import TabBarIcon from '../../components/TabBarIcon';
import EmptyContent from '../../components/EmptyContent';

const mapStateToProps = state => ({
  category: state.app.category,
});

const mapDispatchToProps = {
  getCategory: createAction('app/getCategory'),
};


@connect(mapStateToProps, mapDispatchToProps)
export default class Category extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    tabBarLabel: '分类',
    headerLeft: <Text style={styles.headerLeftIcon}>分类</Text>,
    headerRight: (
      <Icon
        name="right"
        size={30}
        color="#fff"
        style={styles.headerRightIcon}
        onPress={() => {
          // 当params存在时说明category已经发生改变 此时可以去调用onConfirm方法
          // 否则就返回到首页
          if (navigation.state.params) {
            navigation.state.params.onConfirm();
          } else {
            navigation.navigate('Mine');
          }
        }}
      />
    ),
    tabBarIcon: ({ focused, tintColor }) =>
      (<TabBarIcon
        name="collection"
        activeName="collection_fill"
        size={22}
        tintColor={tintColor}
        focused={focused}
      />),
  })

  static propTypes = {
    category: PropTypes.array.isRequired,
    getCategory: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.state = {
      selectedArray: [],
      refreshing: false,
    };
    this.maxCategory = 4;
  }

  componentDidMount() {
    this.props.category.length <= 0 && this.props.getCategory()
      .catch(err => console.log(err));
    Storage.getItem('MYCATEGORY')
      .then((data) => {
        this.setState({ selectedArray: data.map(item => item.id) });
      });
  }

  onConfirm = () => {
    const { selectedArray } = this.state;
    if (selectedArray.length > this.maxCategory) {
      Toast.showShort(`选取的分类不能超过${this.maxCategory}个~~~`);
      return;
    } else if (selectedArray.length === 0) {
      Toast.showShort('选取的分类不能为空哦~~~');
      return;
    }
    const result = selectedArray.map(id => this.props.category.find(obj => obj.id === id));
    Storage.setItem('MYCATEGORY', result);
    DeviceEventEmitter.emit('changeCategory', result);
    this.props.navigation.navigate('Mine');
    // .then(() => {
    //   this.props.navigation.navigate('Mine');
    // });
  }

  updateCategory = (item) => {
    const { id } = item;
    const { selectedArray } = this.state;
    const findResult = selectedArray.find(ele => ele === id);
    let value;
    if (findResult) {
      value = selectedArray.filter(ele => ele !== id);
    } else {
      value = selectedArray.concat(id);
    }
    this.setState({ selectedArray: value });
    if (!this.props.navigation.state.params) {
      this.props.navigation.setParams({
        onConfirm: this.onConfirm,
      });
    }
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.getCategory()
      .then(() => this.setState({ refreshing: false }))
      .catch(err => console.log(err));
  }

  render() {
    if (this.props.category.length <= 0) return <EmptyContent />;
    return (
      <View
        style={styles.container}
      >
        <StatusBar
          animated={false}
          backgroundColor="#3e9ce9"
        />
        <View style={styles.header}>
          <Text
            style={styles.header_font}
          >
            {`请选择您所喜欢的1-${this.maxCategory}个类别吧~~`}
          </Text>
        </View>
        <View style={styles.content}>
          <SelectCategory
            dataSource={this.props.category}
            selectedArray={this.state.selectedArray}
            onChange={this.updateCategory}
            onRefresh={this.onRefresh}
            refreshing={this.state.refreshing}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fcfcfc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header_font: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    // alignItems: 'center',
  },
  headerLeftIcon: {
    paddingHorizontal: 30,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRightIcon: {
    paddingHorizontal: 15,
  },
});
