import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing,
} from 'react-native';
import PropTypes from 'prop-types';

export default class MyProgress extends PureComponent {
  static propTypes = {
    style: PropTypes.object,
    progressColor: PropTypes.string,
    status: PropTypes.string,
    relatedNum: PropTypes.number,
    onProgressEnd: PropTypes.func,
  }
  static defaultProps = {
    style: null,
    progressColor: '#3e9ce9',
    status: 'loading',
    relatedNum: 0.6,
    onProgressEnd: () => {},
  }
  constructor() {
    super();
    this.state = {};
    this.progressOneVal = new Animated.Value(0);
    this.progressTwoVal = new Animated.Value(0);
    this.totalLength = 0;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status !== this.props.status && nextProps.status === 'success') {
      this.progressTwoVal.stopAnimation((num) => {
        this.progressOneVal.setValue(num);
        this.startAnimationOne(this.totalLength);
        this.animate = this.progressOneVal.addListener((info) => {
          if (info.value === this.totalLength) {
            this.props.onProgressEnd();
          }
        });
      });
    }
  }

  componentWillUnmount() {
    this.progressOneVal.removeListener(this.animate);
  }

  onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0) {
      this.progressOne.setNativeProps({
        style: {
          height,
        },
      });
      this.progressTwo.setNativeProps({
        style: {
          height,
        },
      });
      this.totalLength = width;
      this.startAnimationTwo(width * this.props.relatedNum);
    }
  }

  startAnimationOne = (value) => {
    Animated.timing(this.progressOneVal, {
      toValue: value,
      duration: 500,
      easing: Easing.linear,
    }).start();
  }

  startAnimationTwo = (value) => {
    Animated.timing(this.progressTwoVal, {
      toValue: value,
      duration: 2000,
      easing: Easing.linear,
    }).start();
  }

  render() {
    return (
      <View
        style={this.props.style}
        onLayout={this.onLayout}
      >
        <Animated.View
          ref={ref => this.progressOne = ref}
          style={{
            position: 'absolute',
            width: this.progressOneVal,
            backgroundColor: this.props.progressColor,
          }}
        />
        <Animated.View
          ref={ref => this.progressTwo = ref}
          style={{
            position: 'absolute',
            width: this.progressTwoVal,
            backgroundColor: this.props.progressColor,
          }}
        />
      </View>
    );
  }
}
