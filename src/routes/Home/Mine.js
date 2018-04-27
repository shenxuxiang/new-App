import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  DeviceEventEmitter,
  StatusBar,
} from 'react-native';
import { isEmpty } from 'lodash';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';
import TabBarIcon from '../../components/TabBarIcon';
import NewsList from '../../components/NewsList';
import { Toast, Storage, createAction } from '../../utils';

@connect(({ news }) => ({ news }))
export default class Mine extends PureComponent {
  static navigationOptions = ({navigation}) => ({
    title: '首页',
    headerLeft: null,
    tabBarIcon: ({ focused, tintColor }) =>
      <TabBarIcon
        name="homepage"
        activeName="homepage_fill"
        size={22}
        tintColor={tintColor}
        focused={focused}
      />,
  })

  static propTypes = {
    news: PropTypes.object,
  }

  static defaultProps = {
    news: {},
  }

  constructor() {
    super();
    this.state = {
      category: [],
      initialPage: 0,
    };
  }

  componentWillMount() {
    // 获取当前分类
    Storage.getItem('MYCATEGORY')
      .then(data => {
        this.setState({ category: data });
      });
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('changeCategory', (value) => {
      this.setState({ category: value, initialPage: 0 });
    });
  }

  componentWillUnmount() {
    DeviceEventEmitter.remove();
  }

  onChangeTab = (obj) => {
    this.setState({ initialPage: obj.i });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          animated={true}
          backgroundColor="#3e9ce9"
        />
        <ScrollableTabView
          renderTabBar={() => <ScrollableTabBar/>}
          tabBarPosition="top"
          locked={false}
          tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
          tabBarBackgroundColor="#fcfcfc"
          tabBarActiveTextColor="#3e9ce9"
          tabBarInactiveTextColor="#aaa"
          scrollWithoutAnimation={false}
          initialPage={this.state.initialPage}
          onChangeTab={this.onChangeTab}
        >
          {
            this.state.category.map(item => {
              let data = {};
              const key = `news_${item.id}`;
              return (
                <View key={item.id} tabLabel={item.label} style={styles.container}>
                  <NewsList
                    dataSource={this.props.news[key]}
                    id={item.id}
                    dispatch={this.props.dispatch}
                    navigation={this.props.navigation}
                  />
                </View>
              );
            })
          }
        </ScrollableTabView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarUnderlineStyle: {
    backgroundColor: '#3e9ce9',
    height: 2,
  }
})
