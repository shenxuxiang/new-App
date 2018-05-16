import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import SelectCategory from '../components/SelectCategory';
import Loading from '../components/Loading';
import { Toast, Storage, createAction } from '../utils';
import EmptyContent from '../components/EmptyContent';

const mapStateToProps = state => ({
  category: state.app.category,
});
const mapDispatchToProps = {
  getCategory: createAction('app/getCategory'),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class InitCategory extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: '分类',
  })

  static propTypes = {
    category: PropTypes.array.isRequired,
    getCategory: PropTypes.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      selectedArray: [],
      refreshing: false,
      isLoading: true,
    };
    this.maxCategory = 5;
  }

  componentDidMount() {
    this.props.getCategory()
      .then(() => this.setState({ isLoading: false }))
      .catch(err => this.setState({ isLoading: false }));
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
  }

  confirmSubmit = () => {
    const { selectedArray } = this.state;
    const len = selectedArray.length;
    if (len > this.maxCategory) {
      Toast.showShort(`不要超过${this.maxCategory}个类别哦~~~`);
      return;
    } else if (len < 1) {
      Toast.showShort('不要少于1个类别哦~~~');
      return;
    }
    Storage.multiSet([
      {
        key: 'ISNOTFIRST',
        value: true,
      },
      {
        key: 'MYCATEGORY',
        value: selectedArray.map(item => this.props.category.find(data => data.id === item)),
      },
    ]).then(() => this.props.navigation.navigate('Home'));
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
        <View style={styles.header}>
          <Text
            style={styles.header_font}
          >
            {`初次见面请选择您所喜欢的1-${this.maxCategory}个类别吧~~`}
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
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={this.confirmSubmit}
          >
            <Text style={styles.button_font}>确认</Text>
          </TouchableOpacity>
        </View>
        { this.state.isLoading ? <Loading /> : null }
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
    alignItems: 'center',
  },
  footer: {
    width: '100%',
    height: 60,
    padding: 10,
    backgroundColor: '#fcfcfc',
  },
  button: {
    flex: 1,
    backgroundColor: '#3e9ce9',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_font: {
    fontSize: 16,
    color: '#fff',
  },
});
