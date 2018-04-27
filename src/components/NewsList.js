import React, { PureComponent } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  PixelRatio,
} from 'react-native';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { createAction } from '../utils';
import NewsListItem from './NewsListItem';

export default class NewsList extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object,
    id: PropTypes.oneOfType([
      PropTypes.number.isRequired,
      PropTypes.string.isRequired,
    ]),
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  static defaultProps = {
    dataSource: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      dataList: isEmpty(props.dataSource) ? [] : props.dataSource.content,
    };
    this.pageNum = 1;
    this.pageSize = 10;
    this.loadingStatus = 'STOP'; // STOP 休息 LOADING 加载中 NOTMORE 没有更多了
    this.fHeight = 0;
  }

  componentDidMount() {
    this.props.dispatch(createAction('news/refreshingNews')({
      id: this.props.id,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    })).then(() => {
      this.setState({
        dataList: isEmpty(this.props.dataSource) ? [] : this.props.dataSource.content,
      });
    });
  }

  onRefresh = () => {
    this.pageNum = 1;
    this.pageSize = 10;
    this.props.dispatch(createAction('news/refreshingNews')({
      id: this.props.id,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    })).then(() => {
      this.setState({
        refreshing: false,
        dataList: isEmpty(this.props.dataSource) ? [] : this.props.dataSource.content,
      });
      this.loadingStatus = 'STOP';
    });
  }
  onEndReached = () => {
    if (this.loadingStatus === 'LOADING' || this.loadingStatus === 'NOTMORE') return;

    this.loadingStatus = 'LOADING';
    this.props.dispatch(createAction('news/refreshingNews')({
      id: this.props.id,
      pageNum: this.pageNum + 1,
      pageSize: this.pageSize,
    })).then(() => {
      const { pageNum, total, content } = this.props.dataSource;
      if (pageNum >= Math.ceil(total / this.pageSize)) {
        this.loadingStatus = 'NOTMORE';
      } else {
        this.loadingStatus = 'STOP';
      }
      this.pageNum = pageNum;
      this.setState({
        dataList: this.state.dataList.concat(this.props.dataSource.content),
      });
    });
  }

  emptyComponent = () => {
    return <View style={{
      height: this.fHeight,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text style={{
          fontSize: 16
      }}>暂无数据</Text>
    </View>
  }
  footerComponent = () => {
    let content = null;
    if (this.loadingStatus === 'LOADING') {
      content = (
        <View style={styles.container_footer}>
          <ActivityIndicator
            size="small"
            color="#999"
            style={styles.container_footer_indicator}
          />
          <Text>
            努力加载中...
          </Text>
        </View>
      );
    } else if (this.loadingStatus === 'NOTMORE') {
      content = (
        <View style={styles.container_footer}>
          <Text>
            我是有底线的~~~
          </Text>
        </View>
      );
    }
    return content;
  }

  render() {
    const initNum = isEmpty(this.state.dataList) ? 10 : this.state.dataList.length;
    return (
      <FlatList
        initialNumToRender={initNum}
        onLayout={e => {
          this.fHeight = e.nativeEvent.layout.height
        }}
        keyExtractor={(item, index) => item.id}
        style={styles.container}
        getItemLayout={(data, index) => ({
          length: 100, offset: 100 * (index), index,
        })}
        data={this.state.dataList}
        renderItem={({item}) => <NewsListItem {...item} navigation={this.props.navigation} />}
        ListEmptyComponent={this.emptyComponent}
        ListFooterComponent={this.footerComponent}
        ItemSeparatorComponent={() => <View style={styles.itemSeparte}/>}
        onRefresh={this.onRefresh}
        refreshing={this.state.refreshing}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.1}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container_footer: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_footer_indicator: {
    marginRight: 10,
  },
  itemSeparte: {
    height: 2/PixelRatio.get(),
    backgroundColor: '#ccc',
  },
})
