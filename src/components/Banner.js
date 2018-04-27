import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Image,
  ViewPagerAndroid,
} from 'react-native';
import { Toast } from '../utils';

export default class Banner extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.array,
    height: PropTypes.number,
    width: PropTypes.number,
    initialPage: PropTypes.number,
    time: PropTypes.number,
  }
  static defaultProps = {
    dataSource: [],
    height: 150,
    initialPage: 0,
    time: 5000,
  }

  constructor(props) {
    super(props);
    this.state = {
      idx: props.initialPage,
    };
    this.idx = props.initialPage;
  }

  componentDidMount() {
    this.refScrollView.setPageWithoutAnimation(this.props.initialPage + 1);
    this.interval();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.timerOut);
    this.timer = null;
    this.timerOut = null;
  }
  // 设置idx
  setStateIdx = (position) => {
    const len = this.props.dataSource.length;
    let currentIdx;
    if (position <= 0) {
      currentIdx = len - 1;
    } else if (position >= len + 1) {
      currentIdx = 0;
    } else {
      currentIdx = position - 1;
    }
    this.setState({ idx: currentIdx });
  }
  // 自动播放的定时器
  interval = () => {
    const len = this.props.dataSource.length;
    this.timer = setTimeout(() => {
      let position =  this.state.idx + 1;
      if (position === len) {
        this.refScrollView.setPageWithoutAnimation(0);
      }
      position = position > len - 1 ? 0 : position;
      this.idx = position;
      this.setState({ idx: position }, () => {
        this.refScrollView.setPage(this.state.idx + 1);
      });
    }, this.props.time);
  }
  // 当页面切换完成时
  onPageSelected = (event) => {
    const len = this.props.dataSource.length;
    const idx = event.nativeEvent.position;
    let currentIdx;
    if (idx <= 0) {
      currentIdx = len - 1;
    } else if (idx >= len + 1) {
      currentIdx = 0;
    } else {
      currentIdx = idx - 1;
    }
    this.idx = currentIdx;
    this.setState({ idx: currentIdx }, () => {
    });
    if (idx === len + 1) {
      this.timerOut = setTimeout(() => {
        this.refScrollView.setPageWithoutAnimation(1);
      }, 80);
    } else if (idx === 0) {
      this.timerOut = setTimeout(() => {
        this.refScrollView.setPageWithoutAnimation(len);
      }, 80);
    }
  }
  // 页面在切换的过程中
  onPageScroll = (event) => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    const { offset, position } = event.nativeEvent;
    const len = this.props.dataSource.length;
    const prevPosition = this.idx + 1;
    if (prevPosition === position) {
      // 往左边拖拽时 offset值是 0 => 1
      if (offset >= 0.5) {
        this.setStateIdx(position + 1);
      } else {
        this.setStateIdx(position);
      }
    } else if (prevPosition - 1 === position) {
      // 往右边拖拽时 offset值是 1 => 0
      if (offset <= 0.5) {
        this.setStateIdx(position);
      } else {
        this.setStateIdx(position + 1);
      }
    }
    if (!this.timer) {
      this.interval();
    }
  }

  render() {
    const { width, height, dataSource, initialPage } = this.props;
    const pageStyle = [{width: width, height: height}];
    const total = dataSource.length;
    let pages = [];
    pages = Object.keys(dataSource);
    pages.unshift(total - 1 + '');
    pages.push('0');
    return (
      <View
        style={{ width, height }}
      >
        <ViewPagerAndroid
          style={{ width, height }}
          peekEnabled
          initialPage={initialPage}
          onPageSelected={this.onPageSelected}
          onPageScroll={this.onPageScroll}
          ref={ref => this.refScrollView = ref}
        >
          {
            pages.map((item, index) =>
              <View style={pageStyle} key={index}>
                <Image
                  source={{ uri: dataSource[item] }}
                  style={{ width, height }}
                />
              </View>
            )
          }
        </ViewPagerAndroid>
        <View style={styles.pagination}>
          {
            dataSource.map((item, index) =>
              <View
                key={index}
                style={[
                  styles.pagination_item,
                  this.state.idx === index ? styles.active : null
                ]}
              />
            )
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    backgroundColor: 'transparent',
  },
  pagination: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination_item: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  active: {
    backgroundColor: '#fff',
  },
})
