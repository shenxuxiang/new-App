import React, { PureComponent } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ListView,
  Dimensions,
  Animated,
  PanResponder,
  Easing,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import PullList from './PullList';

const { width: DEVICEWIDTH } = Dimensions.get('window');

const defaultFlag = { pulling: false, pullOk: false, pullRelease: false };
const flagPulling = { pulling: true, pullOk: false, pullRelease: false };
const flagPullOk = { pulling: false, pullOk: true, pullRelease: false };
const flagPullRelease = { pulling: false, pullOk: false, pullRelease: true };
const isUpGesture = (x, y) => y < 0 && (Math.abs(y) > Math.abs(x));
const isDownGesture = (x, y) => y > 0 && (y > Math.abs(x));
const isVerticalGesture = (x, y) => Math.abs(x) < Math.abs(y);
const pullOkMargin = 100;

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

  constructor(props) {
    super(props);
    this.dataList = props.dataSource;
    this.defaultXY = { x: 0, y: 0 };
    this.scrollEnabled = false;
    this.flag = defaultFlag;
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(this.dataList),
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
    if (this.props.dataSource !== nextProps.dataSource && !isEmpty(nextProps.dataSource)) {
      this.dataList = nextProps.dataSource;
      this.setState({ dataSource: this.state.dataSource.cloneWithRows(this.dataList) });
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
      if (gesture.dy < pullOkMargin) {
        this.setFlag(flagPulling);
      } else {
        this.setFlag(flagPullOk);
      }
    }
  }

  onPanResponderRelease = (event, gesture) => {
    if (this.flag.pulling) {
      this.resetDefaultXYHandler();
    } else if (this.flag.pullOk) {
      this.setFlag(defaultFlag);
      Animated.timing(this.state.dist, {
        toValue: this.defaultXY,
        duration: 300,
        easing: Easing.linear,
      }).start();
    }
  }

  setFlag = (flag) => {
    if (this.flag !== flag) {
      this.flag = flag;
    }
  }

  isPullState = () => {
    const { pulling, pullOk, pullRelease } = this.flag;
    return pulling || pullOk || pullRelease;
  }

  resetDefaultXYHandler = () => {
    this.setFlag(defaultFlag);
    this.state.dist.setValue(this.defaultXY);
  }

  onRefresh = () => {
    this.props.onRefresh();
  }


  renderItem = (item) => {
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
              { backgroundColor: '#fff', borderColor: '#ddd' },
          ]}
          onPress={() => onChange(item)}
        >
          <Text
            style={[
              styles.button_con_font,
              isSelected ? { color: '#fff' } : { color: 'black' },
            ]}
          >{item.label}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    this.wrapScroll.setNativeProps({ style: { height } });
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

  render() {
    return (
      <View style={{ flex: 1 }} onLayout={this.onLayout}>
        <Animated.View style={[this.state.dist.getLayout()]}>
          <View
            ref={ref => this.wrapScroll = ref}
            style={{
              width: DEVICEWIDTH, height: 0,
            }}
            {...this.panResponder.panHandlers}
          >
            <ListView
              ref={ref => this.scroll = ref}
              scrollEnabled={this.scrollEnabled}
              onScroll={this.onScroll}
              initialListSize={19}
              dataSource={this.state.dataSource}
              pageSize={19}
              renderRow={this.renderItem}
              contentContainerStyle={styles.columnWrapper}
              style={{ flex: 1 }}
            />
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    width: (DEVICEWIDTH - 20) / 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  button_con: {
    width: 80,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
  },
  button_con_font: {
    fontSize: 14,
  },
  columnWrapper: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});
