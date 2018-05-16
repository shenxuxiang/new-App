import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  Animated,
  PanResponder,
  Easing,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import Icon from './Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
    zIndex: -999,
  },
  container_header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 56,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container_header_box: {
    height: 36,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    borderRadius: 18,
    zIndex: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container_header_search: {
    width: '100%',
    height: 36,
    padding: 0,
    paddingHorizontal: 8,
  },
  container_header_box_searchicon: {
    position: 'absolute',
    top: 6,
    left: 8,
  },
  container_header_box_deleteicon: {
    position: 'absolute',
    top: 6,
    right: 8,
  },
  hide: {
    position: 'absolute',
    left: 10000,
  },
  show: {
    position: 'relative',
    left: 0,
  },
});

const DeviceWidth = Dimensions.get('window').width;
const inputMaxWidth = DeviceWidth - 20;
const inputMinWidth = DeviceWidth - 80;

const pullOkMargin = 100;
const duration = 300;
const defaultFlag = { pulling: false, pullOk: false, pullRelease: false };
const flagPulling = { pulling: true, pullOk: false, pullRelease: false };
const flagPullOk = { pulling: false, pullOk: true, pullRelease: false };
const flagPullRelease = { pulling: false, pullOk: false, pullRelease: true };
const isUpGesture = (x, y) => y < 0 && (Math.abs(y) > Math.abs(x));
const isDownGesture = (x, y) => y > 0 && (y > Math.abs(x));
const isVerticalGesture = (x, y) => Math.abs(x) < Math.abs(y);

export default class PullView extends PureComponent {
  static propTypes = {
    showSearchBar: PropTypes.bool,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    keyboardType: PropTypes.string,
    onSubmitEditing: PropTypes.func,

    keyboardDismissMode: PropTypes.string,
    keyboardShouldPersistTaps: PropTypes.string,
    showsHorizontalScrollIndicator: PropTypes.bool,
    showsVerticalScrollIndicator: PropTypes.bool,
    stickyHeaderIndices: PropTypes.array,
    style: PropTypes.object,
    children: PropTypes.node.isRequired,
    refreshing: PropTypes.bool,
    onRefresh: PropTypes.func,
  }

  static defaultProps = {
    showSearchBar: false,
    placeholder: '',
    placeholderTextColor: '#999',
    keyboardType: 'default', // deafult 默认 numeric数字键盘
    onSubmitEditing: () => {},

    keyboardDismissMode: 'none', // none拖拽时不隐藏 on-drag隐藏 interactive上拉恢复下拉隐藏 android不支持
    keyboardShouldPersistTaps: 'never', // never收起 always不收起 handled不同键盘类型之间转换
    showsHorizontalScrollIndicator: true,
    showsVerticalScrollIndicator: true,
    stickyHeaderIndices: [],
    style: null,
    refreshing: false,
    onRefresh: () => {},
  }

  constructor() {
    super();
    this.topIndicatorHeight = 60;
    this.defaultXY = { x: 0, y: this.topIndicatorHeight * -1 };
    this.scrollEnabled = false;
    this.flag = defaultFlag;
    this.showSearchBtn = false;
    this.minWidth = inputMinWidth;
    this.maxWidth = inputMaxWidth;
    this.state = {
      searchVal: '',

      dist: new Animated.ValueXY(this.defaultXY),
      offset: new Animated.Value(0),
      searchBoxWidth: new Animated.Value(this.minWidth),
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
    if (isUpGesture(gesture.dx, gesture.dy)) {
      if (this.isPullState()) {
        this.resetDefaultXYHandler();
      } else {
        this.scroll.scrollTo({ x: 0, y: gesture.dy * -1 });
      }
    } else if (isDownGesture(gesture.dx, gesture.dy)) {
      this.state.dist.setValue({ x: 0, y: this.lastY + gesture.dy / 2 });
      if (gesture.dy < this.topIndicatorHeight + pullOkMargin) {
        if (!this.flag.pulling) {
          this.setFlag(flagPulling);
        }
      } else if (!this.flag.pullOk) {
        this.setFlag(flagPullOk);
      }
    }
  }

  onPanResponderRelease = (event, gesture) => {
    if (this.flag.pulling) {
      this.resetDefaultXYHandler();
    }
    if (this.flag.pullOk) {
      if (!this.flag.pullRelease) {
        // 处理异步请求
        this.props.onRefresh();
      }
      this.setFlag(flagPullRelease);
      Animated.timing(this.state.dist, {
        toValue: { x: 0, y: 0 },
        duration,
        easing: Easing.linear,
      }).start();
    }
  }

  setFlag = (flag) => {
    if (this.flag !== flag) {
      this.flag = flag;
      this.updateIndicatorStatus();
    }
  }

  isPullState = () => {
    const { pulling, pullOk, pullRelease } = this.flag;
    return pulling || pullOk || pullRelease;
  }
  // 恢复刷新指示器的初始状态
  resetDefaultXYHandler = () => {
    this.setFlag(defaultFlag);
    this.state.dist.setValue(this.defaultXY);
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
          height: this.topIndicatorHeight,
        }}
    >
      <ActivityIndicator size="small" color="gray" />
      <Text ref={ref => this.txtPulling = ref} style={styles.show}>下拉即可刷新</Text>
      <Text ref={ref => this.txtPullOk = ref} style={styles.hide}>释放即可刷新</Text>
      <Text ref={ref => this.txtPullRelease = ref} style={styles.hide}>努力加载中...</Text>
    </View>
  )
  // 点击软键盘中的提交或确定按钮
  onSubmitEditing = () => {
    Keyboard.dismiss();
    this.props.onSubmitEditing(this.state.searchVal);
  }
  // 输入框宽度大小缩放 动画
  startAnimated = (value) => {
    Animated.timing(this.state.searchBoxWidth, {
      toValue: value,
      duration: 200,
      easing: Easing.linear,
    }).start();
  }
  // 渲染输入框
  renderSearchBox = () => {
    const {
      showSearchBar,
      placeholder,
      placeholderTextColor,
    } = this.props;
    if (!showSearchBar) return null;
    return (
      <View style={styles.container_header}>
        <Animated.View
          style={[
            styles.container_header_box,
            { width: this.state.searchBoxWidth },
          ]}
        >
          <Icon name="search" size={26} color="#ccc" style={styles.container_header_box_searchicon} />
          <TextInput
            style={styles.container_header_search}
            onChangeText={text => this.setState({ searchVal: text })}
            value={this.state.searchVal}
            placeholder={placeholder}
            underlineColorAndroid="transparent"
            keyboardType="default"
            multiline={false}
            placeholderTextColor={placeholderTextColor}
            onSubmitEditing={this.onSubmitEditing}
          />
          <Icon
            name="delete_fill"
            size={this.state.searchVal ? 26 : 0}
            color="#ccc"
            style={styles.container_header_box_deleteicon}
            onPress={() => this.setState({ searchVal: '' })}
          />
        </Animated.View>
        <Text
          style={{
            fontSize: 18,
            color: '#fff',
            width: 60,
            textAlign: 'center',
            zIndex: 12,
          }}
          onPress={this.onSubmitEditing}
        >搜索
        </Text>
        <Animated.View
          style={[
            {
              width: DeviceWidth,
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: 'rgb(230,230,230)',
              zIndex: 1,
            },
            {
              opacity: this.state.offset.interpolate({
                inputRange: [0, 50, 160, 161],
                outputRange: [0, 0, 0.95, 0.95],
              }),
            },
          ]}
        />
      </View>
    );
  }

  onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    this.scrollContent && this.scrollContent.setNativeProps({
      style: { height },
    });
  }

  onScroll = (event) => {
    const { x, y } = event.nativeEvent.contentOffset;
    if (y <= 0) {
      this.scroll.setNativeProps({ scrollEnabled: false });
      this.scrollEnabled = false;
    } else if (!this.isPullState()) {
      if (!this.scrollEnabled) {
        this.scroll.setNativeProps({ scrollEnabled: true });
        this.scrollEnabled = true;
      }
      if (this.props.showSearchBar) {
        this.state.offset.setValue(y);
        if (y > 100 && !this.showSearchBtn) {
          this.showSearchBtn = true;
          this.startAnimated(this.maxWidth);
        } else if (y <= 100 && this.showSearchBtn) {
          this.showSearchBtn = false;
          this.startAnimated(this.minWidth);
        }
      }
    }
  }

  render() {
    const {
      keyboardDismissMode,
      keyboardShouldPersistTaps,
      showsHorizontalScrollIndicator,
      showsVerticalScrollIndicator,
      stickyHeaderIndices,
      style,
      children,
    } = this.props;
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        <Animated.View style={[this.state.dist.getLayout()]}>
          { this.renderIndicator() }
          <View
            ref={ref => this.scrollContent = ref}
            style={{
              width: DeviceWidth, height: 0,
            }}
            {...this.panResponder.panHandlers}
          >
            { this.renderSearchBox() }
            <ScrollView
              ref={ref => this.scroll = ref}
              scrollEnabled={this.scrollEnabled}
              onScroll={this.onScroll}
              style={{ flex: 1 }}
              horizontal={false}
              keyboardDismissMode={keyboardDismissMode}
              keyboardShouldPersistTaps={keyboardShouldPersistTaps}
              showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
              showsVerticalScrollIndicator={showsVerticalScrollIndicator}
              stickyHeaderIndices={stickyHeaderIndices}
              style={style}
            >
              {
                React.Children.map(children, child => child)
              }
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    );
  }
}
