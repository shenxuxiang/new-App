import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ListView,
  ActivityIndicator,
  Animated,
  PanResponder,
  Dimensions,
  StleSheet,
  Easing,
  Platform,
  Alert,
} from 'react-native';
import styles from './styles';

const { width: DEVICEWIDTH } = Dimensions.get('window');
const pullOkMargin = 100;
const defaultFlag = { pulling: false, pullOk: false, pullRelease: false };
const flagPulling = { pulling: true, pullOk: false, pullRelease: false };
const flagPullOk = { pulling: false, pullOk: true, pullRelease: false };
const flagPullRelease = { pulling: false, pullOk: false, pullRelease: true };
const isUpGesture = (x, y) => y < 0 && (Math.abs(x) < Math.abs(y));
const isDownGesture = (x, y) => y > 0 && (Math.abs(x) < y);
const isVerticalGesture = (x, y) => Math.abs(x) < Math.abs(y);

export default class PullList extends PureComponent {
  static propTypes = {
    topIndicatorHeight: PropTypes.number,
    duration: PropTypes.number,
    dataSource: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    pageSize: PropTypes.number,
    initialListSize: PropTypes.number,
    onEndReached: PropTypes.func,
    onEndReachedThreshold: PropTypes.number,
    renderRow: PropTypes.func,
    renderFooter: PropTypes.func,
    renderHeader: PropTypes.func,
    renderSectionHeader: PropTypes.func,
    renderSeparator: PropTypes.func,
    stickyHeaderIndices: PropTypes.array,
    stickySectionHeadersEnabled: PropTypes.bool,
    loadStatus: PropTypes.string,
    onRefresh: PropTypes.func,
    refreshing: PropTypes.bool,
    showsHorizontalScrollIndicator: PropTypes.bool,
    showsVerticalScrollIndicator: PropTypes.bool,
    contentContainerStyle: PropTypes.object,
    style: PropTypes.object,
  }
  static defaultProps = {
    topIndicatorHeight: 60,
    duration: 300,
    dataSource: [],
    pageSize: 10,
    initialListSize: 10,
    onEndReached: () => {},
    onEndReachedThreshold: 30,
    renderRow: () => <Text>text...</Text>,
    renderFooter: () => {},
    renderHeader: () => {},
    renderSectionHeader: () => {},
    renderSeparator: () => {},
    stickyHeaderIndices: [],
    stickySectionHeadersEnabled: Platform.OS !== 'ios',
    loadStatus: 'IDLE', // IDLE 闲置 LOADING 加载中 NOTMORE 没有更多了
    onRefresh: () => {}, // 下拉刷新方法
    refreshing: false, // 下拉刷新是否结束
    showsHorizontalScrollIndicator: true,
    showsVerticalScrollIndicator: true,
    contentContainerStyle: null,
    style: null,
  }
  constructor(props) {
    super(props);
    this.scrollEnabled = false;
    this.defaultXY = { x: 0, y: props.topIndicatorHeight * -1 };
    this.flag = defaultFlag;
    this.state = {
      dist: new Animated.ValueXY(this.defaultXY),
    };
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.onShouldSetPanResponder,
      onMoveShouldSetPanResponder: this.onShouldSetPanResponder,
      onPanResponderGrant: () => {},
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
      onPanResponderTerminate: this.onPanResponderRelease,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.refreshing !== nextProps.refreshing && nextProps.refreshing === false) {
      this.resetDefaultXYHandler();
    }
  }

  onShouldSetPanResponder = (event, gesture) => {
    if (!isVerticalGesture(gesture.dx, gesture.dy)) return false;
    if (!this.scrollEnabled) {
      this.lastY = this.state.dist.y._value;
      return true;
    }
    return false;
  }

  onPanResponderMove = (event, gesture) => {
    if (isUpGesture(gesture.dx, gesture.dy)) { // 向上滑动
      if (this.isPullState()) {
        this.resetDefaultXYHandler();
      } else {
        this.scroll.scrollTo({ x: 0, y: gesture.dy * -1 });
      }
    } else if (isDownGesture(gesture.dx, gesture.dy)) { // 向下滑动
      this.state.dist.setValue({ x: 0, y: this.lastY + gesture.dy / 2 });
      if (gesture.dy < pullOkMargin + this.props.topIndicatorHeight) { // 当滑动的距离小于规定值时
        if (!this.flag.pulling) {
          this.setFlag(flagPulling);
        }
        // this.setFlag(flagPulling);
      } else {
        if (!this.flag.pullOk) {
          this.setFlag(flagPullOk);
        }
        // this.setFlag(flagPullOk);
      }
    }
  }

  onPanResponderRelease = (event, gesture) => {
    if (this.flag.pulling) {
      this.resetDefaultXYHandler();
    } else if (this.flag.pullOk) {
      if (!this.flag.pullRelease) {
        // 处理异步请求
        this.props.onRefresh();
      }
      this.setFlag(flagPullRelease);
      Animated.timing(this.state.dist, {
        toValue: { x: 0, y: 0 },
        duration: this.props.duration,
        easing: Easing.linear,
      }).start();
    }
  }
  // 指示器恢复到初始状态
  resetDefaultXYHandler = () => {
    this.setFlag(defaultFlag);
    this.state.dist.setValue(this.defaultXY);
  }
  // 指示器是否处于显示状态 true/false
  isPullState = () => this.flag.pulling || this.flag.pullOk || this.flag.pullRelease
  // 设置指示器的状态
  setFlag = (flag) => {
    if (this.flag !== flag) {
      this.flag = flag;
      this.updateIndicatorStatus();
    }
  }

  // 更新指示器的展示描述
  updateIndicatorStatus = () => {
    const { pulling, pullOk, pullRelease } = this.flag;
    if (pulling) {
      this.txtPulling && this.txtPulling.setNativeProps({ style: styles.show });
      this.txtPullOk && this.txtPullOk.setNativeProps({ style: styles.hide });
      this.txtPullRelease && this.txtPullRelease.setNativeProps({ style: styles.hide });
    }
    if (pullOk) {
      this.txtPulling && this.txtPulling.setNativeProps({ style: styles.hide });
      this.txtPullOk && this.txtPullOk.setNativeProps({ style: styles.show });
      this.txtPullRelease && this.txtPullRelease.setNativeProps({ style: styles.hide });
    }
    if (pullRelease) {
      this.txtPulling && this.txtPulling.setNativeProps({ style: styles.hide });
      this.txtPullOk && this.txtPullOk.setNativeProps({ style: styles.hide });
      this.txtPullRelease && this.txtPullRelease.setNativeProps({ style: styles.show });
    }
  }
  // 渲染指示器
  renderIndicator = () => (
    <View
      style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: this.props.topIndicatorHeight,
        }}
    >
      <ActivityIndicator size="small" color="gray" />
      <Text ref={ref => this.txtPulling = ref} style={styles.show}>下拉即可刷新</Text>
      <Text ref={ref => this.txtPullOk = ref} style={styles.hide}>释放即可刷新</Text>
      <Text ref={ref => this.txtPullRelease = ref} style={styles.hide}>努力加载中...</Text>
    </View>
  )

  onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    this.scrollContainer && this.scrollContainer.setNativeProps({
      style: { height },
    });
  }

  onScroll = (event) => {
    const { x, y } = event.nativeEvent.contentOffset;
    if (y <= 0) {
      this.scrollEnabled = false;
      this.scroll.setNativeProps({ scrollEnabled: false });
    } else if (!this.isPullState()) {
      this.scrollEnabled = true;
      this.scroll.setNativeProps({ scrollEnabled: true });
    }
  }
  // 上拉加载数据
  renderLoading = (status) => {
    let text;
    if (status === 'LOADING') {
      text = '拼命加载中...';
    } else if (status === 'NOTMORE') {
      text = '没有更多了';
    } else if (status === 'IDLE') {
      text = '上拉加载';
    }
    return (
      <View
        style={{
          width: '100%',
          height: 50,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 14, color: '#666' }}>{text}</Text>
      </View>
    );
  }

  renderFooter = () => {
    const { loadStatus } = this.props;
    return this.renderLoading(loadStatus);
  }
  // 上拉加载数据
  onEndReached = () => {
    this.props.loadStatus === 'IDLE' && this.props.onEndReached();
  }

  render() {
    const {
      dataSource, // 数据
      pageSize, // 每次事件循环多少 条数据
      initialListSize, // 初始化渲染多少条数据
      onEndReachedThreshold, // 距离底部多少像素时触发下拉刷新方法
      renderRow, // 渲染每行的内容
      renderHeader, // 渲染头部内容
      renderSectionHeader, // 小节内容
      renderSeparator, // 行与行之间的间隙内容
      stickyHeaderIndices, // 小节的头部显示在屏幕上方[1,5,8]
      stickySectionHeadersEnabled,
      showsHorizontalScrollIndicator, // 是否现实垂直滚动条
      showsVerticalScrollIndicator, // 是否现实水平滚动条
      contentContainerStyle,
      style,
    } = this.props;
    return (
      <View style={styles.wrap} onLayout={this.onLayout}>
        <Animated.View style={[this.state.dist.getLayout()]}>
          { this.renderIndicator() }
          <View
            ref={ref => this.scrollContainer = ref}
            style={{ width: DEVICEWIDTH, height: 0 }}
            {...this.panResponder.panHandlers}
          >
            <ListView
              ref={ref => this.scroll = ref}
              onScroll={this.onScroll}
              scrollEnabled={this.scrollEnabled}
              dataSource={dataSource}
              initialListSize={initialListSize}
              pageSize={pageSize}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={onEndReachedThreshold}
              renderRow={renderRow}
              renderFooter={this.renderFooter}
              renderHeader={renderHeader}
              renderSectionHeader={renderSectionHeader}
              renderSeparator={renderSeparator}
              stickyHeaderIndices={stickyHeaderIndices}
              stickySectionHeadersEnabled={stickySectionHeadersEnabled}
              showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
              showsVerticalScrollIndicator={showsVerticalScrollIndicator}
              contentContainerStyle={contentContainerStyle}
              style={style}
            />
          </View>
        </Animated.View>
      </View>
    );
  }
}
