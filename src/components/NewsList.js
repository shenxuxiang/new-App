import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  PixelRatio,
  ListView,
} from 'react-native';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { createAction } from '../utils';
import NewsListItem from './NewsListItem';
import EmptyContent from '../components/EmptyContent';
import PullList from '../components/PullList';

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
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
  },
});

export default class NewsList extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.object,
    id: PropTypes.oneOfType([
      PropTypes.number.isRequired,
      PropTypes.string.isRequired,
    ]),
    dispatch: PropTypes.func,
    navigation: PropTypes.object.isRequired,
  }

  static defaultProps = {
    dataSource: {},
    dispatch: () => {},
  }

  constructor(props) {
    super(props);
    this.dataList = this.computedDataSource();
    this.state = {
      refreshing: false,
      loadStatus: 'IDLE', // IDLE 闲置 LOADING 加载中 NOTMORE 没有更多了
      dataSource: (new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }))
        .cloneWithRows(this.dataList),
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount() {
    this.props.dispatch(createAction('news/refreshingNews')({
      id: this.props.id,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    })).then(() => {
      this.dataList = this.computedDataSource(this.props.dataSource);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.dataList),
      });
    });
  }

  computedDataSource = (data) => {
    if (isEmpty(data)) return [];
    return data.content;
  }

  onRefresh = () => {
    this.pageNum = 1;
    this.pageSize = 10;
    this.setState({
      refreshing: true,
      loadStatus: 'IDLE',
    });
    this.props.dispatch(createAction('news/refreshingNews')({
      id: this.props.id,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
    })).then(() => {
      this.dataList = this.computedDataSource(this.props.dataSource);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.dataList),
        refreshing: false,
      });
    });
  }

  onEndReached = () => {
    if (this.state.loadStatus === 'LOADING' || this.state.loadStatus === 'NOTMORE') return;
    this.setState({ loadStatus: 'LOADING' });
    this.props.dispatch(createAction('news/refreshingNews')({
      id: this.props.id,
      pageNum: this.pageNum + 1,
      pageSize: this.pageSize,
    })).then(() => {
      const { pageNum, total, content } = this.props.dataSource;
      let loadStatus;
      if (pageNum >= Math.ceil(total / this.pageSize)) {
        loadStatus = 'NOTMORE';
      } else {
        loadStatus = 'IDLE';
      }
      this.pageNum = pageNum;
      this.dataList = this.dataList.concat(content);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.dataList),
        loadStatus,
      });
    });
  }

  render() {
    const initNum = isEmpty(this.dataList) ? 10 : this.dataList.length;
    if (isEmpty(this.dataList)) return <EmptyContent />;
    return (
      <PullList
        dataSource={this.state.dataSource}
        loadStatus={this.state.loadStatus}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={50}

        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}

        renderRow={(rowData, rowID) => <NewsListItem {...rowData} navigation={this.props.navigation} />}
        initialListSize={this.pageSize}
        pageSize={this.pageSize}
        renderSeparator={() => <View style={styles.itemSeparte} />}
      />
    );
  }
}
